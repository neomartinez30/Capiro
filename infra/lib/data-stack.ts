import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { EnvironmentConfig } from './config';

export interface DataStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
  vpc: ec2.IVpc;
  privateSubnets: ec2.ISubnet[];
  isolatedSubnets: ec2.ISubnet[];
  dbSg: ec2.ISecurityGroup;
  redisSg: ec2.ISecurityGroup;
}

export class DataStack extends cdk.Stack {
  public readonly auroraCluster: rds.IDatabaseCluster;
  public readonly documentsBucket: s3.IBucket;
  public readonly exportsBucket: s3.IBucket;
  public readonly yjsSnapshotsBucket: s3.IBucket;
  public readonly documentIngestionQueue: sqs.IQueue;
  public readonly submissionGenerationQueue: sqs.IQueue;
  public readonly notificationQueue: sqs.IQueue;
  public readonly redisAuthSecret: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props: DataStackProps) {
    super(scope, id, props);

    const { config, vpc, privateSubnets, isolatedSubnets, dbSg, redisSg } = props;

    // ─── Aurora Serverless v2 (PostgreSQL 15) ────────────────────────

    const auroraKey = new kms.Key(this, 'AuroraEncryptionKey', {
      alias: `capiro-${config.env}-aurora-key`,
      description: 'KMS key for Aurora PostgreSQL encryption',
      enableKeyRotation: true,
      removalPolicy: config.isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    const auroraCluster = new rds.DatabaseCluster(this, 'AuroraCluster', {
      clusterIdentifier: `capiro-${config.env}-aurora`,
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_15_4,
      }),
      defaultDatabaseName: 'capiro',
      serverlessV2MinCapacity: config.aurora.minCapacity,
      serverlessV2MaxCapacity: config.aurora.maxCapacity,
      vpc,
      vpcSubnets: {
        subnets: isolatedSubnets,
      },
      securityGroups: [dbSg],
      storageEncryptionKey: auroraKey,
      storageEncrypted: true,
      iamAuthentication: true,
      backup: {
        retention: cdk.Duration.days(config.aurora.backupRetention),
      },
      writer: rds.ClusterInstance.serverlessV2('Writer', {
        publiclyAccessible: false,
      }),
      readers: config.aurora.multiAz
        ? [
            rds.ClusterInstance.serverlessV2('Reader', {
              publiclyAccessible: false,
            }),
          ]
        : [],
      removalPolicy: config.isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    this.auroraCluster = auroraCluster;

    // ─── ElastiCache Redis 7 ─────────────────────────────────────────

    const redisAuthSecret = new secretsmanager.Secret(this, 'RedisAuthToken', {
      secretName: `capiro/${config.env}/redis-auth-token`,
      description: 'Auth token for ElastiCache Redis',
      generateSecretString: {
        excludePunctuation: true,
        passwordLength: 64,
      },
    });
    this.redisAuthSecret = redisAuthSecret;

    const redisSubnetGroup = new elasticache.CfnSubnetGroup(this, 'RedisSubnetGroup', {
      cacheSubnetGroupName: `capiro-${config.env}-redis-subnets`,
      description: 'Subnet group for Capiro Redis cluster',
      subnetIds: privateSubnets.map((s) => s.subnetId),
    });

    if (config.redis.numNodes === 1) {
      // Single-node for dev/staging
      new elasticache.CfnCacheCluster(this, 'RedisCluster', {
        clusterName: `capiro-${config.env}-redis`,
        engine: 'redis',
        engineVersion: '7.0',
        cacheNodeType: config.redis.nodeType,
        numCacheNodes: 1,
        cacheSubnetGroupName: redisSubnetGroup.cacheSubnetGroupName!,
        vpcSecurityGroupIds: [redisSg.securityGroupId],
        transitEncryptionEnabled: true,
        atRestEncryptionEnabled: true,
      });
    } else {
      // Replication group for prod
      new elasticache.CfnReplicationGroup(this, 'RedisReplicationGroup', {
        replicationGroupId: `capiro-${config.env}-redis`,
        replicationGroupDescription: 'Capiro Redis replication group',
        engine: 'redis',
        engineVersion: '7.0',
        cacheNodeType: config.redis.nodeType,
        numCacheClusters: config.redis.numNodes,
        automaticFailoverEnabled: true,
        multiAzEnabled: true,
        cacheSubnetGroupName: redisSubnetGroup.cacheSubnetGroupName!,
        securityGroupIds: [redisSg.securityGroupId],
        transitEncryptionEnabled: true,
        atRestEncryptionEnabled: true,
        authToken: redisAuthSecret.secretValue.unsafeUnwrap(),
      });
    }

    // ─── S3 Buckets ──────────────────────────────────────────────────

    // Documents bucket
    this.documentsBucket = new s3.Bucket(this, 'DocumentsBucket', {
      bucketName: `capiro-documents-${config.env}`,
      versioned: true,
      intelligentTieringConfigurations: [
        {
          name: 'default',
          archiveAccessTierTime: cdk.Duration.days(90),
          deepArchiveAccessTierTime: cdk.Duration.days(180),
        },
      ],
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          exposedHeaders: ['ETag'],
          maxAge: 3600,
        },
      ],
      removalPolicy: config.isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: !config.isProd,
    });

    // Exports bucket
    this.exportsBucket = new s3.Bucket(this, 'ExportsBucket', {
      bucketName: `capiro-exports-${config.env}`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(7),
        },
      ],
      removalPolicy: config.isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: !config.isProd,
    });

    // Yjs snapshots bucket
    this.yjsSnapshotsBucket = new s3.Bucket(this, 'YjsSnapshotsBucket', {
      bucketName: `capiro-yjs-snapshots-${config.env}`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: config.isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: !config.isProd,
    });

    // ─── SQS FIFO Queues ─────────────────────────────────────────────

    this.documentIngestionQueue = this.createFifoQueue('DocumentIngestion', config.env);
    this.submissionGenerationQueue = this.createFifoQueue('SubmissionGeneration', config.env);
    this.notificationQueue = this.createFifoQueue('Notification', config.env);

    // ─── Outputs ─────────────────────────────────────────────────────

    new cdk.CfnOutput(this, 'AuroraClusterEndpoint', {
      value: auroraCluster.clusterEndpoint.hostname,
      exportName: `${config.env}-AuroraClusterEndpoint`,
    });

    new cdk.CfnOutput(this, 'DocumentsBucketName', {
      value: this.documentsBucket.bucketName,
      exportName: `${config.env}-DocumentsBucketName`,
    });
  }

  private createFifoQueue(name: string, env: string): sqs.Queue {
    const kebabName = name.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);

    const dlq = new sqs.Queue(this, `${name}Dlq`, {
      queueName: `capiro-${env}-${kebabName}-dlq.fifo`,
      fifo: true,
      retentionPeriod: cdk.Duration.days(14),
    });

    return new sqs.Queue(this, `${name}Queue`, {
      queueName: `capiro-${env}-${kebabName}.fifo`,
      fifo: true,
      visibilityTimeout: cdk.Duration.seconds(300),
      deadLetterQueue: {
        queue: dlq,
        maxReceiveCount: 3,
      },
    });
  }
}
