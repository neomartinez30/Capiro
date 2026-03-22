// ═══════════════════════════════════════════════════════════════
//  External Integration Configuration
//  Replace placeholder values with your actual API credentials
// ═══════════════════════════════════════════════════════════════

const INTEGRATIONS = {
  // LDA Senate API — registrant search via Lambda proxy
  ldaProxy: {
    baseUrl: "https://qzisgoeehkjqvg2vu2qfpm6jki0czheo.lambda-url.us-east-1.on.aws/",
  },

  // Congress.gov API — bill tracking, committee data
  congressGov: {
    apiKey: "YOUR_CONGRESS_GOV_API_KEY",
    baseUrl: "https://api.congress.gov/v3",
  },

  // Federal Register API — agency rulemaking, regulations
  federalRegister: {
    baseUrl: "https://www.federalregister.gov/api/v1",
  },

  // X (Twitter) API — legislator social monitoring
  twitter: {
    bearerToken: "YOUR_TWITTER_BEARER_TOKEN",
    apiBaseUrl: "https://api.twitter.com/2",
  },

  // News API — policy news aggregation
  newsApi: {
    apiKey: "YOUR_NEWS_API_KEY",
    baseUrl: "https://newsapi.org/v2",
  },

  // Salesforce — CRM integration
  salesforce: {
    clientId: "YOUR_SALESFORCE_CLIENT_ID",
    instanceUrl: "https://your-instance.salesforce.com",
  },

  // GovTrack — legislative tracking
  govTrack: {
    baseUrl: "https://www.govtrack.us/api/v2",
  },
};

export default INTEGRATIONS;
