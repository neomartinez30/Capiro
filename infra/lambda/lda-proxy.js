// ═══════════════════════════════════════════════════════════════
//  Lambda: capiro-lda-proxy
//  Proxies requests to lda.gov API with rate limiting + caching
// ═══════════════════════════════════════════════════════════════

const LDA_BASE = "https://lda.gov/api/v1";

export async function handler(event) {
  try {
    const { path, queryStringParameters } = event;
    
    // Strip /api/lda from the path to get the LDA API path
    let ldaPath = path.replace('/api/lda', '');
    if (!ldaPath.startsWith('/')) {
      ldaPath = '/' + ldaPath;
    }
    
    // Build the full URL with query string
    const queryString = queryStringParameters
      ? "?" + new URLSearchParams(queryStringParameters).toString()
      : "";
    
    const url = `${LDA_BASE}${ldaPath}${queryString}`;
    
    // Get API key
    const apiKey = "b114aa166dd465fea5789480156f5efeada7d2d3";
    
    // Make request to LDA API
    const headers = { 
      Accept: "application/json",
      Authorization: `Token ${apiKey}`
    };
    
    const response = await fetch(url, { headers });
    
    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After") || "60";
      return {
        statusCode: 429,
        headers: { 
          "Content-Type": "application/json", 
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Rate limited", retryAfter })
      };
    }
    
    // Get response body
    const data = await response.json();
    
    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(data)
    };
    
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: err.message })
    };
  }
}