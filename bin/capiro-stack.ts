#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CapiroStack } from '../lib/capiro-stack.js';

const app = new cdk.App();
new CapiroStack(app, 'CapiroStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});