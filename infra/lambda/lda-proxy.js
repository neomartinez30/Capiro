// ═══════════════════════════════════════════════════════════════
//  Lambda: capiro-lda-proxy
//  Proxies requests to lda.gov API with rate limiting + caching
// ═══════════════════════════════════════════════════════════════

const https = require('https');
const url = require('url');

const LDA_BASE = "https://lda.gov/api/v1";
const LDA_KEY = "b114aa166dd465fea5789480156f5efeada7d2d3";

function makeHttpsRequest(targetUrl, headers) {
  return new Promise((resolve, reject) => {
    const urlObj = new url.URL(targetUrl);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        ...headers,
        'User-Agent': 'aws-lambda'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function handler(event) {
  try {
    console.log('Received event:', JSON.stringify(event));
    
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
    
    const targetUrl = `${LDA_BASE}${ldaPath}${queryString}`;
    console.log('Target URL:', targetUrl);
    
    // Make request to LDA API
    const headers = { 
      'Accept': 'application/json',
      'Authorization': `Token ${LDA_KEY}`
    };
    
    const response = await makeHttpsRequest(targetUrl, headers);
    console.log('LDA Response status:', response.status);
    
    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers['retry-after'] || '60';
      return {
        statusCode: 429,
        headers: { 
          "Content-Type": "application/json", 
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Rate limited", retryAfter })
      };
    }
    
    let body;
    try {
      body = JSON.parse(response.body);
    } catch (e) {
      body = response.body;
    }
    
    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(body)
    };
    
  } catch (err) {
    console.error('Error:', err);
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

module.exports = { handler };