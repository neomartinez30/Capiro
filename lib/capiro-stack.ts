import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class CapiroStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const table = new dynamodb.Table(this, 'CapiroOrganizationsTable', {
      tableName: 'capiro-organizations',
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Add GSI1
    table.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'GSI1PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI1SK', type: dynamodb.AttributeType.STRING },
    });

    // Add GSI2
    table.addGlobalSecondaryIndex({
      indexName: 'GSI2-registrantId',
      partitionKey: { name: 'lda_registrant_id', type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
    });

    // Secrets Manager for LDA API Key
    const ldaApiKeySecret = new secretsmanager.Secret(this, 'LdaApiKeySecret', {
      secretName: 'capiro/lda-api-key',
      description: 'API key for LDA.gov API access',
    });

    // Lambda execution role
    const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:Query', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
      resources: [table.tableArn, table.tableArn + '/index/*'],
    }));
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['secretsmanager:GetSecretValue'],
      resources: [ldaApiKeySecret.secretArn],
    }));

    // LDA Proxy Lambda
    const ldaProxyLambda = new lambda.Function(this, 'LdaProxyLambda', {
      functionName: 'capiro-lda-proxy',
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../infra/lambda')),
      handler: 'lda-proxy.handler',
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: {
        LDA_API_BASE_URL: 'https://lda.gov/api/v1',
        LDA_API_KEY_SECRET_NAME: 'capiro/lda-api-key',
        DYNAMODB_TABLE: table.tableName,
      },
      role: lambdaRole,
    });

    // Profile API Lambda
    const profileApiLambda = new lambda.Function(this, 'ProfileApiLambda', {
      functionName: 'capiro-profile-api',
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../infra/lambda')),
      handler: 'profile-api.handler',
      memorySize: 256,
      timeout: cdk.Duration.seconds(15),
      environment: {
        DYNAMODB_TABLE: table.tableName,
      },
      role: lambdaRole,
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'CapiroApi', {
      restApiName: 'capiro-api',
      description: 'API Gateway for Capiro application',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // API Gateway Lambda permissions
    ldaProxyLambda.addPermission('ApiGatewayPermission', {
      principal: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      action: 'lambda:InvokeFunction',
      sourceArn: api.arnForExecuteApi('*'),
    });

    profileApiLambda.addPermission('ApiGatewayPermission', {
      principal: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      action: 'lambda:InvokeFunction',
      sourceArn: api.arnForExecuteApi('*'),
    });

    // LDA API routes
    const ldaResource = api.root.addResource('api').addResource('lda');

    // LDA proxy endpoints
    const registrantsResource = ldaResource.addResource('registrants');
    registrantsResource.addMethod('GET', new apigateway.LambdaIntegration(ldaProxyLambda));
    const registrantResource = registrantsResource.addResource('{id}');
    registrantResource.addMethod('GET', new apigateway.LambdaIntegration(ldaProxyLambda));

    const lobbyistsResource = ldaResource.addResource('lobbyists');
    lobbyistsResource.addMethod('GET', new apigateway.LambdaIntegration(ldaProxyLambda));
    const lobbyistResource = lobbyistsResource.addResource('{id}');
    lobbyistResource.addMethod('GET', new apigateway.LambdaIntegration(ldaProxyLambda));

    const clientsResource = ldaResource.addResource('clients');
    clientsResource.addMethod('GET', new apigateway.LambdaIntegration(ldaProxyLambda));
    const clientResource = clientsResource.addResource('{id}');
    clientResource.addMethod('GET', new apigateway.LambdaIntegration(ldaProxyLambda));

    ldaResource.addResource('filings').addMethod('GET', new apigateway.LambdaIntegration(ldaProxyLambda));
    ldaResource.addResource('contributions').addMethod('GET', new apigateway.LambdaIntegration(ldaProxyLambda));

    const constantsResource = ldaResource.addResource('constants').addResource('{type}');
    constantsResource.addMethod('GET', new apigateway.LambdaIntegration(ldaProxyLambda));

    // Profile API routes
    const profilesResource = api.root.addResource('api').addResource('profiles');

    // Lobbyists
    const lobbyistsProfResource = profilesResource.addResource('lobbyists');
    lobbyistsProfResource.addMethod('GET', new apigateway.LambdaIntegration(profileApiLambda));
    lobbyistsProfResource.addMethod('POST', new apigateway.LambdaIntegration(profileApiLambda));
    const lobbyistProfResource = lobbyistsProfResource.addResource('{id}');
    lobbyistProfResource.addMethod('GET', new apigateway.LambdaIntegration(profileApiLambda));
    lobbyistProfResource.addMethod('PUT', new apigateway.LambdaIntegration(profileApiLambda));

    // Firms
    const firmsResource = profilesResource.addResource('firms');
    firmsResource.addMethod('GET', new apigateway.LambdaIntegration(profileApiLambda));
    firmsResource.addMethod('POST', new apigateway.LambdaIntegration(profileApiLambda));
    const firmResource = firmsResource.addResource('{id}');
    firmResource.addMethod('GET', new apigateway.LambdaIntegration(profileApiLambda));
    firmResource.addMethod('PUT', new apigateway.LambdaIntegration(profileApiLambda));

    // Clients
    const clientsProfResource = profilesResource.addResource('clients');
    clientsProfResource.addMethod('GET', new apigateway.LambdaIntegration(profileApiLambda));
    clientsProfResource.addMethod('POST', new apigateway.LambdaIntegration(profileApiLambda));
    const clientProfResource = clientsProfResource.addResource('{id}');
    clientProfResource.addMethod('GET', new apigateway.LambdaIntegration(profileApiLambda));
    clientProfResource.addMethod('PUT', new apigateway.LambdaIntegration(profileApiLambda));

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });
  }
}