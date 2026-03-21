// ═══════════════════════════════════════════════════════════════
//  Lambda: capiro-lda-proxy
//  Proxies requests to lda.gov API with rate limiting + caching
// ═══════════════════════════════════════════════════════════════

const LDA_BASE = process.env.LDA_API_BASE_URL || "https://lda.gov/api/v1";

/**
 * Map incoming API Gateway path to LDA API path
 */
function mapPath(path, pathParams) {
  const segments = path.replace("/api/lda/", "").split("/");
  const resource = segments[0]; // registrants, lobbyists, clients, filings, contributions, constants

  if (resource === "constants") {
    const type = pathParams?.type || segments[1];
    const constantMap = {
      filingtypes: "constants/filing/filingtypes",
      lobbyingactivityissues: "constants/filing/lobbyingactivityissues",
      governmententities: "constants/filing/governmententities",
      countries: "constants/general/countries",
      states: "constants/general/states",
      prefixes: "constants/lobbyist/prefixes",
      suffixes: "constants/lobbyist/suffixes",
    };
    return `/api/v1/${constantMap[type] || `constants/${type}`}/`;
  }

  const id = pathParams?.id || segments[1];
  if (id) {
    return `/api/v1/${resource}/${id}/`;
  }
  return `/api/v1/${resource}/`;
}

export async function handler(event) {
  const { path, queryStringParameters, pathParameters } = event;
  const ldaPath = mapPath(path, pathParameters);

  const queryString = queryStringParameters
    ? "?" + new URLSearchParams(queryStringParameters).toString()
    : "";

  const url = `${LDA_BASE}${ldaPath}${queryString}`;

  // In production, retrieve API key from Secrets Manager
  // For local testing fallback to provided key (do not commit secrets in repo)
  const apiKey = process.env.LDA_API_KEY || "b114aa166dd465fea5789480156f5efeada7d2d3b114aa166dd465fea5789480156f5efeada7d2d3";

  const headers = { Accept: "application/json" };
  if (apiKey) {
    headers.Authorization = `Token ${apiKey}`;
  }

  try {
    const response = await fetch(url, { headers });

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After") || "60";
      return {
        statusCode: 429,
        headers: { "Content-Type": "application/json", "Retry-After": retryAfter },
        body: JSON.stringify({ error: "LDA API rate limit exceeded", retryAfter }),
      };
    }

    const data = await response.json();
    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to reach LDA API", detail: err.message }),
    };
  }
}
