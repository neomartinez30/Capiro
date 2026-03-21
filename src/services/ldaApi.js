// ═══════════════════════════════════════════════════════════════
//  LDA.gov API Service Layer
//  Calls the lda.gov REST API (or the capiro-lda-proxy Lambda)
//  Endpoints: registrants, lobbyists, clients, filings, contributions
//  Ref: https://lda.gov/api/v1/
// ═══════════════════════════════════════════════════════════════

import AWS_CONFIG from "../config/aws";

// In production, route through our API Gateway proxy to handle auth + rate limits.
// For development / direct access, call lda.gov directly (unauthenticated, 15 req/min).
const USE_PROXY = false;
const LDA_DIRECT_BASE = "https://lda.gov/api/v1";
const PROXY_BASE = `${AWS_CONFIG.apiGateway.endpoint}/api/lda`;

function getBase() {
  return USE_PROXY ? PROXY_BASE : LDA_DIRECT_BASE;
}

function buildUrl(path, params = {}) {
  const url = new URL(`${getBase()}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, v);
    }
  });
  return url.toString();
}

async function fetchLda(path, params = {}) {
  const url = buildUrl(path, params);
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (res.status === 429) {
    const retryAfter = res.headers.get("Retry-After");
    throw new Error(`Rate limited. Retry after ${retryAfter}s`);
  }
  if (!res.ok) {
    throw new Error(`LDA API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// ── Registrants (Firms) ───────────────────────────────────────

export async function searchRegistrants({ name, id, state, country, page = 1, pageSize = 25 } = {}) {
  return fetchLda("/registrants/", {
    registrant_name: name,
    id,
    state,
    country,
    page,
    page_size: pageSize,
  });
}

export async function getRegistrant(id) {
  return fetchLda(`/registrants/${id}/`);
}

// ── Lobbyists ─────────────────────────────────────────────────

export async function searchLobbyists({ name, registrantId, registrantName, id, page = 1, pageSize = 25 } = {}) {
  return fetchLda("/lobbyists/", {
    lobbyist_name: name,
    registrant_id: registrantId,
    registrant_name: registrantName,
    id,
    page,
    page_size: pageSize,
  });
}

export async function getLobbyist(id) {
  return fetchLda(`/lobbyists/${id}/`);
}

// ── Clients ───────────────────────────────────────────────────

export async function searchClients({ name, registrantId, registrantName, state, country, page = 1, pageSize = 25 } = {}) {
  return fetchLda("/clients/", {
    client_name: name,
    registrant_id: registrantId,
    registrant_name: registrantName,
    state,
    country,
    page,
    page_size: pageSize,
  });
}

export async function getClient(id) {
  return fetchLda(`/clients/${id}/`);
}

// ── Filings ───────────────────────────────────────────────────

export async function searchFilings({
  registrantId,
  registrantName,
  clientName,
  filingYear,
  filingPeriod,
  filingType,
  filingUuid,
  page = 1,
  pageSize = 25,
} = {}) {
  return fetchLda("/filings/", {
    registrant_id: registrantId,
    registrant_name: registrantName,
    client_name: clientName,
    filing_year: filingYear,
    filing_period: filingPeriod,
    filing_type: filingType,
    filing_uuid: filingUuid,
    page,
    page_size: pageSize,
  });
}

export async function getFiling(uuid) {
  return fetchLda(`/filings/`, { filing_uuid: uuid });
}

// ── Contribution Reports (LD-203) ─────────────────────────────

export async function searchContributions({
  registrantId,
  registrantName,
  lobbyistName,
  filingYear,
  filingPeriod,
  page = 1,
  pageSize = 25,
} = {}) {
  return fetchLda("/contributions/", {
    registrant_id: registrantId,
    registrant_name: registrantName,
    lobbyist_name: lobbyistName,
    filing_year: filingYear,
    filing_period: filingPeriod,
    page,
    page_size: pageSize,
  });
}

// ── Constants ─────────────────────────────────────────────────

export async function getFilingTypes() {
  return fetchLda("/constants/filing/filingtypes/");
}

export async function getLobbyingIssues() {
  return fetchLda("/constants/filing/lobbyingactivityissues/");
}

export async function getGovernmentEntities() {
  return fetchLda("/constants/filing/governmententities/");
}

export async function getStates() {
  return fetchLda("/constants/general/states/");
}

export async function getCountries() {
  return fetchLda("/constants/general/countries/");
}

// ── Composite: Build full firm profile from LDA data ──────────

export async function fetchFirmProfile(registrantId) {
  const [registrant, filings, lobbyists, contributions] = await Promise.all([
    getRegistrant(registrantId),
    searchFilings({ registrantId, filingYear: new Date().getFullYear(), pageSize: 25 }).catch(() => ({ results: [] })),
    searchLobbyists({ registrantId, pageSize: 25 }).catch(() => ({ results: [] })),
    searchContributions({ registrantId, filingYear: new Date().getFullYear(), pageSize: 25 }).catch(() => ({ results: [] })),
  ]);

  // Extract unique clients from filings
  const clientMap = new Map();
  (filings.results || []).forEach((f) => {
    if (f.client?.id) clientMap.set(f.client.id, f.client);
  });

  // Extract unique issue areas
  const issueSet = new Set();
  (filings.results || []).forEach((f) => {
    (f.lobbying_activities || []).forEach((a) => {
      if (a.general_issue_code_display) issueSet.add(a.general_issue_code_display);
    });
  });

  // Extract government entities contacted
  const entitySet = new Set();
  (filings.results || []).forEach((f) => {
    (f.lobbying_activities || []).forEach((a) => {
      (a.government_entities || []).forEach((ge) => {
        if (ge.name) entitySet.add(ge.name);
      });
    });
  });

  return {
    registrant,
    lobbyists: lobbyists.results || [],
    filings: filings.results || [],
    contributions: contributions.results || [],
    clients: Array.from(clientMap.values()),
    issueAreas: Array.from(issueSet),
    governmentEntities: Array.from(entitySet),
  };
}
