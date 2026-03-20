#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { DataStack } from '../lib/data-stack';
import { AuthStack } from '../lib/auth-stack';
import { getConfig } from '../lib/config';

const app = new cdk.App();

const env = app.node.tryGetContext('env') ?? 'dev';
const config = getConfig(env);

const cdkEnv: cdk.Environment = {
  account: config.account || process.env.CDK_DEFAULT_ACCOUNT,
  region: config.region || process.env.CDK_DEFAULT_REGION,
};

const stackPrefix = `Capiro-${config.env}`;

const networkStack = new NetworkStack(app, `${stackPrefix}-Network`, {
  env: cdkEnv,
  config,
});

const dataStack = new DataStack(app, `${stackPrefix}-Data`, {
  env: cdkEnv,
  config,
  vpc: networkStack.vpc,
  privateSubnets: networkStack.privateSubnets,
  isolatedSubnets: networkStack.isolatedSubnets,
  dbSg: networkStack.dbSg,
  redisSg: networkStack.redisSg,
});
dataStack.addDependency(networkStack);

const authStack = new AuthStack(app, `${stackPrefix}-Auth`, {
  env: cdkEnv,
  config,
});

// Tag all resources
cdk.Tags.of(app).add('Project', 'Capiro');
cdk.Tags.of(app).add('Environment', config.env);

app.synth();
