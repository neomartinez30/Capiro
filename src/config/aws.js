// ═══════════════════════════════════════════════════════════════
//  AWS Service Configuration
//  Replace placeholder values with your actual AWS resources
// ═══════════════════════════════════════════════════════════════

const AWS_CONFIG = {
  // Amazon API Gateway — primary data API
  apiGateway: {
    endpoint: "https://UPDATE-WITH-YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod",
    region: "us-east-1",
  },

  // Amazon S3 — static assets, document storage
  s3: {
    bucket: "capiro-app-assets",
    region: "us-east-1",
  },

  // Amazon CloudFront — CDN distribution
  cloudfront: {
    distributionId: "EXXXXXXXXXXXXX",
    domain: "dXXXXXXXXXXXXX.cloudfront.net",
  },

  // Amazon EC2 / ECS — application hosting
  hosting: {
    ec2InstanceId: "i-XXXXXXXXXXXXXXXXX",
    albDns: "capiro-alb-XXXXXXXXX.us-east-1.elb.amazonaws.com",
  },

  // Amazon DynamoDB / RDS — database
  database: {
    tableName: "capiro-compliance-data",
    rdsEndpoint: "capiro-db.XXXXXXXXXX.us-east-1.rds.amazonaws.com",
  },

  // Amazon SNS / SES — notifications and email
  notifications: {
    snsTopicArn: "arn:aws:sns:us-east-1:XXXXXXXXXXXX:capiro-alerts",
    sesFromEmail: "noreply@capiro.io",
  },

  // AWS Lambda — serverless processing
  lambda: {
    liveFeedProcessor:
      "arn:aws:lambda:us-east-1:XXXXXXXXXXXX:function:capiro-live-feed",
    aiInsightsGenerator:
      "arn:aws:lambda:us-east-1:XXXXXXXXXXXX:function:capiro-ai-insights",
    complianceScorer:
      "arn:aws:lambda:us-east-1:XXXXXXXXXXXX:function:capiro-compliance-score",
    filingValidator:
      "arn:aws:lambda:us-east-1:XXXXXXXXXXXX:function:capiro-filing-validate",
  },
};

export default AWS_CONFIG;
