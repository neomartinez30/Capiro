
// ═══════════════════════════════════════════════════════════════
//  Profile API Service
//  CRUD for lobbyist / firm / client profiles stored in DynamoDB
//  In dev mode, uses local state; in prod, calls API Gateway
// ═══════════════════════════════════════════════════════════════

import AWS_CONFIG from "../config/aws";

const API_BASE = `${AWS_CONFIG.apiGateway.endpoint}/api/profiles`;
const USE_API = false; // Toggle for local dev vs. deployed API

// ── In-memory store for dev ───────────────────────────────────
let localStore = {
  lobbyists: {},
  firms: {},
  clients: {},
};

// ── Generic CRUD ──────────────────────────────────────────────

async function apiRequest(method, path, body) {
  if (!USE_API) {
    return localCrud(method, path, body);
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Profile API error: ${res.status}`);
  return res.json();
}

function localCrud(method, path, body) {
  const segments = path.replace(/^\//, "").split("/");
  const entityType = segments[0];
  const id = segments[1];

  if (method === "GET" && id) {
    return localStore[entityType]?.[id] || null;
  }
  if (method === "GET") {
    return { results: Object.values(localStore[entityType] || {}) };
  }
  if (method === "POST") {
    const newId = `${entityType.toUpperCase()}-${Date.now()}`;
    const record = { ...body, id: newId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    localStore[entityType][newId] = record;
    return record;
  }
  if (method === "PUT") {
    const existing = localStore[entityType]?.[id] || {};
    const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };
    localStore[entityType][id] = updated;
    return updated;
  }
  return null;
}

// ── Lobbyist Profiles ─────────────────────────────────────────

export function listLobbyistProfiles() {
  return apiRequest("GET", "/lobbyists");
}

export function getLobbyistProfile(id) {
  return apiRequest("GET", `/lobbyists/${id}`);
}

export function createLobbyistProfile(data) {
  return apiRequest("POST", "/lobbyists", data);
}

export function updateLobbyistProfile(id, data) {
  return apiRequest("PUT", `/lobbyists/${id}`, data);
}

// ── Firm Profiles ─────────────────────────────────────────────

export function listFirmProfiles() {
  return apiRequest("GET", "/firms");
}

export function getFirmProfile(id) {
  return apiRequest("GET", `/firms/${id}`);
}

export function createFirmProfile(data) {
  return apiRequest("POST", "/firms", data);
}

export function updateFirmProfile(id, data) {
  return apiRequest("PUT", `/firms/${id}`, data);
}

// ── Client Profiles ───────────────────────────────────────────

export function listClientProfiles() {
  return apiRequest("GET", "/clients");
}

export function getClientProfile(id) {
  return apiRequest("GET", `/clients/${id}`);
}

export function createClientProfile(data) {
  return apiRequest("POST", "/clients", data);
}

export function updateClientProfile(id, data) {
  return apiRequest("PUT", `/clients/${id}`, data);
}

// ── Bulk import from LDA data ─────────────────────────────────

export function importLobbyistFromLda(ldaLobbyist, registrant) {
  const profile = mapLdaLobbyistToProfile(ldaLobbyist, registrant);
  return createLobbyistProfile(profile);
}

export function importFirmFromLda(registrant, enrichment = {}) {
  const profile = mapLdaRegistrantToFirmProfile(registrant, enrichment);
  return createFirmProfile(profile);
}

// ── LDA → Profile Mapping ─────────────────────────────────────

export function mapLdaLobbyistToProfile(lobbyist, registrant = {}) {
  return {
    // Identity
    fullName: [lobbyist.first_name, lobbyist.middle_name, lobbyist.last_name].filter(Boolean).join(" "),
    firstName: lobbyist.first_name || "",
    middleName: lobbyist.middle_name || "",
    lastName: lobbyist.last_name || "",
    prefix: lobbyist.prefix_display || "",
    suffix: lobbyist.suffix_display || "",
    nickname: lobbyist.nickname || "",
    displayName: lobbyist.nickname || [lobbyist.first_name, lobbyist.last_name].filter(Boolean).join(" "),
    ldaLobbyistId: lobbyist.id,

    // Status
    status: "active",
    profilePhoto: "",
    bio: "", // placeholder — AI will generate

    // Contact
    officeLocation: "",
    workEmail: "",
    phone: "",
    websiteUrl: "",
    linkedinUrl: "",

    // Employment
    currentFirm: registrant.name || "",
    ldaRegistrantId: registrant.id || null,
    title: "", // placeholder
    employmentType: "", // firm_lobbyist | in_house | sole_proprietor
    startDate: "",
    priorFirms: [], // placeholder
    supervisingPartner: "",

    // Expertise
    policyAreas: [], // populated from filing lobbying_activities
    industryFocus: [], // placeholder
    chamberAgencyFocus: [], // populated from government_entities
    scope: "", // state | federal
    keywords: [], // placeholder
    languages: [],
    geographicCoverage: [],

    // LDA filing links
    senateRegistrantId: registrant.id || null,
    houseId: registrant.house_registrant_id || null,
    linkedLd1Filings: [], // populated later
    linkedLd2Filings: [], // populated later
    linkedLd203Filings: [], // populated later

    // Compliance
    coveredPositions: [], // from lobbying_activities.lobbyists.covered_position
    convictionDisclosures: [], // from filing conviction_disclosures
    foreignEntityRelationships: [], // placeholder
    affiliatedOrganizations: [], // placeholder

    // Filing history
    filingHistory: [],
    amendmentHistory: [],
    lastFilingDate: "",
    contributionReportAssociations: [],

    // Clients & activity
    currentClients: [], // populated from filings
    historicalClients: [], // placeholder
    issuesLobbied: [], // from lobbying_activities
    governmentEntitiesContacted: [], // from lobbying_activities.government_entities

    // Financials
    quarterlyIncomeRanges: [], // placeholder
    quarterlyExpenseRanges: [], // placeholder
    numberOfActiveMatters: 0,
    numberOfFilingsThisYear: 0,
    recencyScore: 0,

    // Internal
    meetingHistory: [], // placeholder
    notes: "", // placeholder
    relationshipMap: [], // placeholder
    stakeholderTags: [], // placeholder
    internalDealOwner: "", // placeholder
    uploadedDocuments: [], // placeholder
    websiteScrapedCapabilities: "", // placeholder — AI will generate
    newsMentions: [], // placeholder — AI will generate
    socialMediaMentions: [], // placeholder — AI will generate
  };
}

export function mapLdaRegistrantToFirmProfile(registrant, enrichment = {}) {
  return {
    // Identity
    name: registrant.name || "",
    ldaRegistrantId: registrant.id,
    houseRegistrantId: registrant.house_registrant_id || null,
    description: registrant.description || "", // placeholder — AI will generate

    // Status
    status: "active",

    // Contact & Address
    address1: registrant.address_1 || "",
    address2: registrant.address_2 || "",
    address3: registrant.address_3 || "",
    address4: registrant.address_4 || "",
    city: registrant.city || "",
    state: registrant.state || "",
    stateDisplay: registrant.state_display || "",
    zip: registrant.zip || "",
    country: registrant.country || "",
    countryDisplay: registrant.country_display || "",
    ppbCountry: registrant.ppb_country || "",
    ppbCountryDisplay: registrant.ppb_country_display || "",
    contactName: registrant.contact_name || "",
    contactPhone: registrant.contact_telephone || "",
    websiteUrl: "",
    linkedinUrl: "",

    // Lobbyists
    lobbyists: enrichment.lobbyists || [],

    // Clients
    currentClients: enrichment.clients || [],
    historicalClients: [],

    // Practice areas
    policyAreas: enrichment.issueAreas || [],
    governmentEntities: enrichment.governmentEntities || [],

    // Filings
    filingHistory: enrichment.filings || [],
    contributions: enrichment.contributions || [],
    lastFilingDate: registrant.dt_updated || "",

    // Internal
    notes: "",
    stakeholderTags: [],
    internalDealOwner: "",
    uploadedDocuments: [],

    ...enrichment.overrides,
  };
}
