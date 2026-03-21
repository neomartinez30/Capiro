// ═══════════════════════════════════════════════════════════════
//  Lambda: capiro-profile-api
//  CRUD for lobbyist / firm / client profiles in DynamoDB
// ═══════════════════════════════════════════════════════════════

// In production, use @aws-sdk/client-dynamodb + @aws-sdk/lib-dynamodb
// This is the handler scaffold for deployment.

const TABLE = process.env.DYNAMODB_TABLE || "capiro-organizations";

export async function handler(event) {
  const { httpMethod, path, pathParameters, body } = event;
  const segments = path.replace("/api/profiles/", "").split("/");
  const entityType = segments[0]; // lobbyists | firms | clients
  const entityId = pathParameters?.id || segments[1];

  // Route to appropriate handler
  if (httpMethod === "GET" && entityId) {
    return getProfile(entityType, entityId);
  }
  if (httpMethod === "GET") {
    return listProfiles(entityType);
  }
  if (httpMethod === "POST") {
    return createProfile(entityType, JSON.parse(body));
  }
  if (httpMethod === "PUT" && entityId) {
    return updateProfile(entityType, entityId, JSON.parse(body));
  }

  return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
}

async function getProfile(entityType, id) {
  // DynamoDB GetItem: PK = LOBBYIST#<id>, SK = PROFILE
  // Placeholder — wire up DynamoDB SDK in deployment
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ id, entityType, message: "Profile retrieved (placeholder)" }),
  };
}

async function listProfiles(entityType) {
  // DynamoDB Query: GSI1PK = TYPE#<entityType>
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ results: [], entityType, message: "List profiles (placeholder)" }),
  };
}

async function createProfile(entityType, data) {
  // DynamoDB PutItem
  const id = `${entityType.toUpperCase()}-${Date.now()}`;
  return {
    statusCode: 201,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ id, ...data, message: "Profile created (placeholder)" }),
  };
}

async function updateProfile(entityType, id, data) {
  // DynamoDB UpdateItem
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ id, ...data, message: "Profile updated (placeholder)" }),
  };
}
