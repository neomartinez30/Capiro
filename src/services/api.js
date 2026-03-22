// ═══════════════════════════════════════════════════════════════
// Capiro API Client
// Communicates with the capiro-lda-proxy Lambda (expanded to full CRUD)
// ═══════════════════════════════════════════════════════════════

const API_URL = "https://qzisgoeehkjqvg2vu2qfpm6jki0czheo.lambda-url.us-east-1.on.aws/";

/**
 * Search the LDA registry for firms
 */
export async function searchFirms(query) {
  const res = await fetch(`${API_URL}?action=search&search=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

/**
 * Set up a new firm — stores profile in DynamoDB and pulls
 * clients, lobbyists, and topics from the LDA Senate API.
 */
export async function setupFirm({ firmId, ldaRegistrantId, firmData }) {
  const res = await fetch(`${API_URL}?action=setupFirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firmId, ldaRegistrantId, firmData }),
  });
  if (!res.ok) throw new Error("Setup failed");
  return res.json();
}

/**
 * Fetch all data for a firm from DynamoDB
 * Returns: { firm, clients, lobbyists, topics, submissions, offices, filingPeriods }
 */
export async function getFirmData(firmId) {
  const res = await fetch(`${API_URL}?action=getFirmData&firmId=${encodeURIComponent(firmId)}`);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}

/**
 * Save or update an item in DynamoDB
 * @param {string} firmId
 * @param {string} type - "client" | "lobbyist" | "topic" | "submission" | "office" | "filing"
 * @param {object} data - the item data (must include `id` for updates)
 */
export async function saveItem({ firmId, type, data }) {
  const res = await fetch(`${API_URL}?action=saveItem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firmId, type, data }),
  });
  if (!res.ok) throw new Error("Save failed");
  return res.json();
}

/**
 * Delete an item from DynamoDB
 */
export async function deleteItem({ firmId, type, id }) {
  const res = await fetch(`${API_URL}?action=deleteItem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firmId, type, id }),
  });
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
}
