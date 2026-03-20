import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { EnvironmentConfig } from './config';

export interface AuthStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
}

export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.IUserPool;
  public readonly userPoolClient: cognito.IUserPoolClient;
  public readonly userPoolDomain: cognito.UserPoolDomain;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    const { config } = props;

    // ─── Cognito User Pool ───────────────────────────────────────────

    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: `capiro-${config.env}-user-pool`,
      selfSignUpEnabled: false,
      signInAliases: {
        email: true,
      },
      passwordPolicy: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      mfa: cognito.Mfa.OPTIONAL,
      mfaSecondFactor: {
        sms: false,
        otp: true,
      },
      customAttributes: {
        tenant_id: new cognito.StringAttribute({ mutable: true }),
        role: new cognito.StringAttribute({ mutable: true }),
        org_id: new cognito.StringAttribute({ mutable: true }),
      },
      userVerification: {
        emailSubject: 'Capiro - Verify your email address',
        emailBody: 'Your Capiro verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: config.isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    this.userPool = userPool;

    // ─── User Pool Domain ────────────────────────────────────────────

    this.userPoolDomain = userPool.addDomain('Domain', {
      cognitoDomain: {
        domainPrefix: `capiro-${config.env}`,
      },
    });

    // ─── User Pool Client ────────────────────────────────────────────

    const userPoolClient = userPool.addClient('AppClient', {
      userPoolClientName: `capiro-${config.env}-app-client`,
      authFlows: {
        userPassword: true,
        userSrp: true,
        custom: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL, cognito.OAuthScope.PROFILE],
        callbackUrls: config.cognito.callbackUrls,
        logoutUrls: config.cognito.logoutUrls,
      },
      accessTokenValidity: cdk.Duration.hours(1),
      idTokenValidity: cdk.Duration.hours(1),
      refreshTokenValidity: cdk.Duration.days(30),
      generateSecret: false,
      preventUserExistenceErrors: true,
    });

    this.userPoolClient = userPoolClient;

    // ─── SSM Parameters ──────────────────────────────────────────────

    new ssm.StringParameter(this, 'UserPoolIdParam', {
      parameterName: `/capiro/${config.env}/cognito/user-pool-id`,
      stringValue: userPool.userPoolId,
      description: 'Capiro Cognito User Pool ID',
    });

    new ssm.StringParameter(this, 'UserPoolClientIdParam', {
      parameterName: `/capiro/${config.env}/cognito/user-pool-client-id`,
      stringValue: userPoolClient.userPoolClientId,
      description: 'Capiro Cognito User Pool Client ID',
    });

    new ssm.StringParameter(this, 'UserPoolDomainParam', {
      parameterName: `/capiro/${config.env}/cognito/user-pool-domain`,
      stringValue: this.userPoolDomain.domainName,
      description: 'Capiro Cognito User Pool Domain',
    });

    // ─── Outputs ─────────────────────────────────────────────────────

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      exportName: `${config.env}-UserPoolId`,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      exportName: `${config.env}-UserPoolClientId`,
    });

    new cdk.CfnOutput(this, 'UserPoolDomain', {
      value: this.userPoolDomain.domainName,
      exportName: `${config.env}-UserPoolDomain`,
    });
  }
}
