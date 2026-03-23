// ═══════════════════════════════════════════════════════════════
// Capiro API Client — Production
// All data flows through the capiro-lda-proxy Lambda → DynamoDB
// ═══════════════════════════════════════════════════════════════

const API_URL =
  "https://qzisgoeehkjqvg2vu2qfpm6jki0czheo.lambda-url.us-east-1.on.aws/";

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let msg = `API error ${res.status}`;
    try {
      const json = JSON.parse(text);
      msg = json.error || msg;
    } catch {
      if (text) msg = text;
    }
    throw new Error(msg);
  }

  return res.json();
}

/**
 * Search the LDA registry for firms (via Senate LDA API)
 */
export async function searchFirms(query) {
  return request(
    `${API_URL}?action=search&search=${encodeURIComponent(query)}`
  );
}

/**
 * Set up a new firm — stores profile in DynamoDB and pulls
 * clients, lobbyists, and topics from the LDA Senate API.
 */
export async function setupFirm({ firmId, ldaRegistrantId, firmData }) {
  return request(`${API_URL}?action=setupFirm`, {
    method: "POST",
    body: JSON.stringify({ firmId, ldaRegistrantId, firmData }),
  });
}

/**
 * Fetch all data for a firm from DynamoDB
 * Returns: { firm, clients, lobbyists, topics, submissions, offices, filingPeriods }
 */
export async function getFirmData(firmId) {
  return request(
    `${API_URL}?action=getFirmData&firmId=${encodeURIComponent(firmId)}`
  );
}

/**
 * Get congressional offices (from DynamoDB, seeded from Congress.gov)
 */
export async function getOffices() {
  return request(`${API_URL}?action=getOffices`);
}

/**
 * Get filing period schedule (dynamically computed)
 */
export async function getFilingPeriods() {
  return request(`${API_URL}?action=getFilingPeriods`);
}

/**
 * Save or update an item in DynamoDB
 */
export async function saveItem({ firmId, type, data }) {
  return request(`${API_URL}?action=saveItem`, {
    method: "POST",
    body: JSON.stringify({ firmId, type, data }),
  });
}

/**
 * Delete an item from DynamoDB
 */
export async function deleteItem({ firmId, type, id }) {
  return request(`${API_URL}?action=deleteItem`, {
    method: "POST",
    body: JSON.stringify({ firmId, type, id }),
  });
}
