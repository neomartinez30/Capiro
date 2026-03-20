import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { EnvironmentConfig } from './config';

export interface NetworkStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
}

export class NetworkStack extends cdk.Stack {
  public readonly vpc: ec2.IVpc;
  public readonly publicSubnets: ec2.ISubnet[];
  public readonly privateSubnets: ec2.ISubnet[];
  public readonly isolatedSubnets: ec2.ISubnet[];
  public readonly albSg: ec2.ISecurityGroup;
  public readonly apiSg: ec2.ISecurityGroup;
  public readonly dbSg: ec2.ISecurityGroup;
  public readonly redisSg: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string, props: NetworkStackProps) {
    super(scope, id, props);

    const { config } = props;

    // VPC
    const vpc = new ec2.Vpc(this, 'Vpc', {
      vpcName: `capiro-${config.env}-vpc`,
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: 2,
      natGateways: config.nat.gateways,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: 'Isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    this.vpc = vpc;
    this.publicSubnets = vpc.publicSubnets;
    this.privateSubnets = vpc.privateSubnets;
    this.isolatedSubnets = vpc.isolatedSubnets;

    // VPC Endpoints

    // S3 Gateway endpoint
    vpc.addGatewayEndpoint('S3Endpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });

    // SQS Interface endpoint
    vpc.addInterfaceEndpoint('SqsEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SQS,
      privateDnsEnabled: true,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });

    // Secrets Manager Interface endpoint
    vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      privateDnsEnabled: true,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });

    // Security Groups

    // ALB Security Group - ingress 443 from anywhere
    this.albSg = new ec2.SecurityGroup(this, 'AlbSg', {
      vpc,
      securityGroupName: `capiro-${config.env}-alb-sg`,
      description: 'Security group for Application Load Balancer',
      allowAllOutbound: true,
    });
    this.albSg.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS from anywhere',
    );

    // API Security Group - ingress 4000 from ALB SG
    this.apiSg = new ec2.SecurityGroup(this, 'ApiSg', {
      vpc,
      securityGroupName: `capiro-${config.env}-api-sg`,
      description: 'Security group for API services (ECS)',
      allowAllOutbound: true,
    });
    this.apiSg.addIngressRule(
      this.albSg,
      ec2.Port.tcp(4000),
      'Allow traffic from ALB on port 4000',
    );

    // DB Security Group - ingress 5432 from API SG
    this.dbSg = new ec2.SecurityGroup(this, 'DbSg', {
      vpc,
      securityGroupName: `capiro-${config.env}-db-sg`,
      description: 'Security group for Aurora PostgreSQL',
      allowAllOutbound: false,
    });
    this.dbSg.addIngressRule(
      this.apiSg,
      ec2.Port.tcp(5432),
      'Allow PostgreSQL from API services',
    );

    // Redis Security Group - ingress 6379 from API SG
    this.redisSg = new ec2.SecurityGroup(this, 'RedisSg', {
      vpc,
      securityGroupName: `capiro-${config.env}-redis-sg`,
      description: 'Security group for ElastiCache Redis',
      allowAllOutbound: false,
    });
    this.redisSg.addIngressRule(
      this.apiSg,
      ec2.Port.tcp(6379),
      'Allow Redis from API services',
    );

    // Outputs
    new cdk.CfnOutput(this, 'VpcId', {
      value: vpc.vpcId,
      exportName: `${config.env}-VpcId`,
    });
  }
}
