export interface EnvironmentConfig {
  env: string;
  isProd: boolean;
  account: string;
  region: string;
  aurora: {
    minCapacity: number;
    maxCapacity: number;
    multiAz: boolean;
    backupRetention: number;
  };
  redis: {
    nodeType: string;
    numNodes: number;
  };
  nat: {
    gateways: number;
  };
  cognito: {
    callbackUrls: string[];
    logoutUrls: string[];
  };
}

const configs: Record<string, EnvironmentConfig> = {
  dev: {
    env: 'dev',
    isProd: false,
    account: process.env.CDK_DEFAULT_ACCOUNT ?? '',
    region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
    aurora: {
      minCapacity: 0.5,
      maxCapacity: 8,
      multiAz: false,
      backupRetention: 7,
    },
    redis: {
      nodeType: 'cache.t4g.micro',
      numNodes: 1,
    },
    nat: {
      gateways: 1,
    },
    cognito: {
      callbackUrls: ['http://localhost:3000/auth/callback'],
      logoutUrls: ['http://localhost:3000/auth/logout'],
    },
  },
  staging: {
    env: 'staging',
    isProd: false,
    account: process.env.CDK_DEFAULT_ACCOUNT ?? '',
    region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
    aurora: {
      minCapacity: 0.5,
      maxCapacity: 16,
      multiAz: false,
      backupRetention: 7,
    },
    redis: {
      nodeType: 'cache.t4g.micro',
      numNodes: 1,
    },
    nat: {
      gateways: 1,
    },
    cognito: {
      callbackUrls: ['https://staging.capiro.io/auth/callback'],
      logoutUrls: ['https://staging.capiro.io/auth/logout'],
    },
  },
  prod: {
    env: 'prod',
    isProd: true,
    account: process.env.CDK_DEFAULT_ACCOUNT ?? '',
    region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
    aurora: {
      minCapacity: 0.5,
      maxCapacity: 32,
      multiAz: true,
      backupRetention: 14,
    },
    redis: {
      nodeType: 'cache.r7g.large',
      numNodes: 2,
    },
    nat: {
      gateways: 2,
    },
    cognito: {
      callbackUrls: ['https://app.capiro.io/auth/callback'],
      logoutUrls: ['https://app.capiro.io/auth/logout'],
    },
  },
};

export function getConfig(env: string): EnvironmentConfig {
  const config = configs[env];
  if (!config) {
    throw new Error(
      `Unknown environment: ${env}. Valid environments: ${Object.keys(configs).join(', ')}`,
    );
  }
  return config;
}
