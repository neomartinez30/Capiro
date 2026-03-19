// ═══════════════════════════════════════════════════════════════
//  AWS Cognito Configuration
//  Replace placeholder values with your actual Cognito resources
// ═══════════════════════════════════════════════════════════════

const COGNITO_CONFIG = {
  region: "us-east-1",                                        // TODO: Your AWS region
  userPoolId: "us-east-1_XXXXXXXXX",                          // TODO: Your Cognito User Pool ID
  userPoolWebClientId: "XXXXXXXXXXXXXXXXXXXXXXXXXX",           // TODO: Your App Client ID
  domain: "your-domain.auth.us-east-1.amazoncognito.com",     // TODO: Your Cognito domain
  redirectUri: "https://your-ec2-domain.com/callback",        // TODO: Your EC2 callback URL
};

export default COGNITO_CONFIG;

// ═══════════════════════════════════════════════════════════════
//  Example Amplify Setup (uncomment when ready)
// ═══════════════════════════════════════════════════════════════
//
//  import { Amplify } from 'aws-amplify';
//
//  Amplify.configure({
//    Auth: {
//      Cognito: {
//        userPoolId: COGNITO_CONFIG.userPoolId,
//        userPoolClientId: COGNITO_CONFIG.userPoolWebClientId,
//        loginWith: {
//          oauth: {
//            domain: COGNITO_CONFIG.domain,
//            scopes: ['openid', 'email', 'profile'],
//            redirectSignIn: [COGNITO_CONFIG.redirectUri],
//            redirectSignOut: [COGNITO_CONFIG.redirectUri],
//            responseType: 'code',
//          },
//        },
//      },
//    },
//  });
