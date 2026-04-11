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
 * Search the LDA registry for firms (via Senate LDA API directly)
 * Uses registrant_name param for actual filtering
 */
export async function searchFirms(query) {
  const SENATE_API = "https://lda.senate.gov/api/v1/registrants/";
  const res = await fetch(
    `${SENATE_API}?registrant_name=${encodeURIComponent(query)}&page_size=25`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) throw new Error(`Senate LDA API error ${res.status}`);
  const data = await res.json();
  return {
    count: data.count,
    results: (data.results || []).map((r) => ({
      id: String(r.id),
      name: r.name,
      address: [r.address_1, r.city, r.state, r.zip].filter(Boolean).join(", "),
      description: r.description || "",
      contactName: r.contact_name || "",
      phone: r.contact_telephone || "",
      ldaRegistrationId: String(r.id),
      registrationDate: r.dt_updated || "",
    })),
  };
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

/**
 * Save user profile to DynamoDB (maps email → firm)
 */
export async function saveUserProfile({ email, userId, firmId, firmName, name, role, onboardingData }) {
  return request(`${API_URL}?action=saveUserProfile`, {
    method: "POST",
    body: JSON.stringify({ email, userId, firmId, firmName, name, role, onboardingData }),
  });
}

/**
 * Get user profile from DynamoDB by email
 */
export async function getUserProfile(email) {
  return request(
    `${API_URL}?action=getUserProfile&email=${encodeURIComponent(email)}`
  );
}

// ═══════════════════════════════════════════════════════════════
// Bedrock Agent API — CDS Form Submission
// Uses a separate backend (FastAPI + Bedrock) for agentic workflows
// ═══════════════════════════════════════════════════════════════

const AGENT_API_URL = import.meta.env.VITE_AGENT_API_URL || "http://localhost:8000";

/**
 * Start a new agent session for CDS form filling
 */
export async function startAgentSession({ client, topic, senators, documents, whitePaper }) {
  return request(`${AGENT_API_URL}/api/agent/start`, {
    method: "POST",
    body: JSON.stringify({ client, topic, senators, documents, whitePaper }),
  });
}

/**
 * Send a message to an active agent session
 */
export async function sendAgentMessage({ session_id, message }) {
  return request(`${AGENT_API_URL}/api/agent/message`, {
    method: "POST",
    body: JSON.stringify({ session_id, message }),
  });
}

/**
 * Get current form data from an agent session
 */
export async function getAgentFormData(sessionId) {
  return request(`${AGENT_API_URL}/api/agent/${encodeURIComponent(sessionId)}/form`);
}

/**
 * Generate a white paper draft using the Bedrock agent
 */
export async function generateWhitePaper({ client, topic, documents }) {
  return request(`${AGENT_API_URL}/api/agent/whitepaper`, {
    method: "POST",
    body: JSON.stringify({ client, topic, documents }),
  });
}
