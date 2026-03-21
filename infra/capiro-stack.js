// ═══════════════════════════════════════════════════════════════
//  Capiro CDK-style Stack Definition
//  AWS resources for lobbyist profile + LDA API integration
//  NOTE: This is a declarative spec — deploy via CDK CLI or SAM
// ═══════════════════════════════════════════════════════════════

/**
 * DynamoDB Table: capiro-organizations
 *
 * Stores lobbyist profiles, firm profiles, and client profiles.
 * Single-table design with PK = entityType#id, SK = metadata key.
 */
export const DYNAMODB_TABLE = {
  tableName: "capiro-organizations",
  partitionKey: { name: "PK", type: "S" },
  sortKey: { name: "SK", type: "S" },
  gsis: [
    {
      indexName: "GSI1",
      partitionKey: { name: "GSI1PK", type: "S" },
      sortKey: { name: "GSI1SK", type: "S" },
    },
    {
      indexName: "GSI2-registrantId",
      partitionKey: { name: "lda_registrant_id", type: "N" },
      sortKey: { name: "SK", type: "S" },
    },
  ],
  billingMode: "PAY_PER_REQUEST",
};

/**
 * Lambda: capiro-lda-proxy
 *
 * Proxies requests to lda.gov API with rate-limit handling,
 * caching, and API key management via Secrets Manager.
 */
export const LDA_PROXY_LAMBDA = {
  functionName: "capiro-lda-proxy",
  runtime: "nodejs20.x",
  handler: "index.handler",
  memorySize: 256,
  timeout: 30,
  environment: {
    LDA_API_BASE_URL: "https://lda.gov/api/v1",
    LDA_API_KEY_SECRET_NAME: "capiro/lda-api-key",
    DYNAMODB_TABLE: "capiro-organizations",
  },
};

/**
 * Lambda: capiro-profile-api
 *
 * CRUD operations for lobbyist/firm/client profiles in DynamoDB.
 */
export const PROFILE_API_LAMBDA = {
  functionName: "capiro-profile-api",
  runtime: "nodejs20.x",
  handler: "index.handler",
  memorySize: 256,
  timeout: 15,
  environment: {
    DYNAMODB_TABLE: "capiro-organizations",
  },
};

/**
 * API Gateway routes
 */
export const API_ROUTES = {
  // LDA proxy endpoints
  "GET /api/lda/registrants": "capiro-lda-proxy",
  "GET /api/lda/registrants/{id}": "capiro-lda-proxy",
  "GET /api/lda/lobbyists": "capiro-lda-proxy",
  "GET /api/lda/lobbyists/{id}": "capiro-lda-proxy",
  "GET /api/lda/clients": "capiro-lda-proxy",
  "GET /api/lda/clients/{id}": "capiro-lda-proxy",
  "GET /api/lda/filings": "capiro-lda-proxy",
  "GET /api/lda/contributions": "capiro-lda-proxy",
  "GET /api/lda/constants/{type}": "capiro-lda-proxy",

  // Profile CRUD endpoints
  "GET /api/profiles/lobbyists": "capiro-profile-api",
  "GET /api/profiles/lobbyists/{id}": "capiro-profile-api",
  "PUT /api/profiles/lobbyists/{id}": "capiro-profile-api",
  "POST /api/profiles/lobbyists": "capiro-profile-api",
  "GET /api/profiles/firms": "capiro-profile-api",
  "GET /api/profiles/firms/{id}": "capiro-profile-api",
  "PUT /api/profiles/firms/{id}": "capiro-profile-api",
  "POST /api/profiles/firms": "capiro-profile-api",
  "GET /api/profiles/clients": "capiro-profile-api",
  "GET /api/profiles/clients/{id}": "capiro-profile-api",
  "PUT /api/profiles/clients/{id}": "capiro-profile-api",
  "POST /api/profiles/clients": "capiro-profile-api",
};

/**
 * Secrets Manager
 */
export const SECRETS = {
  "capiro/lda-api-key": {
    description: "API key for lda.gov REST API (registered user token)",
  },
};
