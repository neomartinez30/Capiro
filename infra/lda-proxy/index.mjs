import https from 'https';

const LDA_BASE = 'https://lda.senate.gov/api/v1/registrants/';
const ALLOWED_ORIGINS = ['https://capiro.ai', 'https://www.capiro.ai', 'http://localhost:5173'];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve({ raw: data }); }
      });
    }).on('error', reject);
  });
}

export const handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const headers = corsHeaders(origin);

  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const search = event.queryStringParameters?.search || '';
  if (!search || search.length < 2) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Search query must be at least 2 characters' }) };
  }

  try {
    const url = `${LDA_BASE}?search=${encodeURIComponent(search)}&format=json`;
    const data = await fetchJSON(url);

    const results = (data.results || []).slice(0, 20).map(r => ({
      id: r.id ? String(r.id) : null,
      name: r.name || '',
      address: [r.address_1, r.address_2, r.city, r.state, r.zip].filter(Boolean).join(', '),
      description: r.description || '',
      country: r.country || '',
      state: r.state || '',
      registrantDt: r.dt_updated || '',
      contactName: r.contact_name || '',
      phone: r.contact_telephone || '',
      ldaRegistrationId: r.registrant_id ? String(r.registrant_id) : (r.id ? String(r.id) : ''),
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ count: data.count || results.length, results }),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: 'Failed to reach LDA API', detail: err.message }),
    };
  }
};
