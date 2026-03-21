// ═══════════════════════════════════════════════════════════════
//  Lambda: capiro-lda-proxy
//  Proxies requests to lda.gov API with rate limiting + caching
// ═══════════════════════════════════════════════════════════════

const LDA_BASE = process.env.LDA_API_BASE_URL || "https://lda.gov/api/v1";

/**
 * Map incoming API Gateway path to LDA API path
 */
function mapPath(path, pathParams) {
  // For proxy resource /api/lda/{proxy+}, the pathParams.proxy contains the rest
  if (pathParams && pathParams.proxy) {
    const proxyPath = pathParams.proxy;
    // Remove leading slash if present
    const cleanPath = proxyPath.startsWith('/') ? proxyPath.substring(1) : proxyPath;
    return `/${cleanPath}`;
  }
  
  // Fallback for direct path matching
  const segments = path.replace("/api/lda/", "").split("/");
  const resource = segments[0]; // registrants, lobbyists, clients, filings, contributions, constants

  if (resource === "constants") {
    const type = segments[1];
    const constantMap = {
      filingtypes: "constants/filing/filingtypes",
      lobbyingactivityissues: "constants/filing/lobbyingactivityissues",
      governmententities: "constants/filing/governmententities",
      countries: "constants/general/countries",
      states: "constants/general/states",
      prefixes: "constants/lobbyist/prefixes",
      suffixes: "constants/lobbyist/suffixes",
    };
    return `/${constantMap[type] || `constants/${type}`}/`;
  }

  const id = segments[1];
  if (id) {
    return `/${resource}/${id}/`;
  }
  return `/${resource}/`;
}

export async function handler(event) {
  // DEBUG: Return the event to see what API Gateway is sending
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      event: event,
      pathParams: event.pathParameters,
      proxy: event.pathParameters?.proxy
    }),
  };
