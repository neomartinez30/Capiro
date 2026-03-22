// ═══════════════════════════════════════════════════════════════
// Senator CDS / Appropriations Request Form Templates
// Based on actual Congressionally Directed Spending form structures
// Each senator has unique fields, deadlines, and submission methods
// ═══════════════════════════════════════════════════════════════

export const senators = [
  {
    id: "sen_schumer", name: "Sen. Chuck Schumer", state: "NY", party: "D",
    committee: "Majority Leader", chamber: "Senate",
    formUrl: "https://www.schumer.senate.gov/services/community-funding",
    deadline: "2026-03-22", deadlineLabel: "FY2027 CDS",
    submissionMethod: "web_form",
    photoUrl: null,
  },
  {
    id: "sen_gillibrand", name: "Sen. Kirsten Gillibrand", state: "NY", party: "D",
    committee: "Armed Services", chamber: "Senate",
    formUrl: "https://www.gillibrand.senate.gov/community-project-funding",
    deadline: "2026-03-28", deadlineLabel: "FY2027 CDS",
    submissionMethod: "web_form",
  },
  {
    id: "sen_padilla", name: "Sen. Alex Padilla", state: "CA", party: "D",
    committee: "Judiciary", chamber: "Senate",
    formUrl: "https://www.padilla.senate.gov/community-project-funding",
    deadline: "2026-03-13", deadlineLabel: "FY2027 CDS",
    submissionMethod: "web_form",
  },
  {
    id: "sen_feinstein_successor", name: "Sen. Adam Schiff", state: "CA", party: "D",
    committee: "Judiciary", chamber: "Senate",
    formUrl: "https://www.schiff.senate.gov/cds",
    deadline: "2026-03-20", deadlineLabel: "FY2027 CDS",
    submissionMethod: "web_form",
  },
  {
    id: "sen_murray", name: "Sen. Patty Murray", state: "WA", party: "D",
    committee: "Appropriations", chamber: "Senate",
    formUrl: "https://www.murray.senate.gov/funding-requests",
    deadline: "2026-04-01", deadlineLabel: "FY2027 CDS",
    submissionMethod: "web_form",
  },
  {
    id: "sen_reed", name: "Sen. Jack Reed", state: "RI", party: "D",
    committee: "Armed Services", chamber: "Senate",
    formUrl: "https://www.reed.senate.gov/community-project-funding",
    deadline: "2026-03-31", deadlineLabel: "FY2027 CDS",
    submissionMethod: "pdf_upload",
  },
  {
    id: "sen_wicker", name: "Sen. Roger Wicker", state: "MS", party: "R",
    committee: "Armed Services", chamber: "Senate",
    formUrl: "https://www.wicker.senate.gov/appropriations-requests",
    deadline: "2026-04-05", deadlineLabel: "FY2027 CDS",
    submissionMethod: "email",
  },
  {
    id: "sen_collins", name: "Sen. Susan Collins", state: "ME", party: "R",
    committee: "Appropriations", chamber: "Senate",
    formUrl: "https://www.collins.senate.gov/community-project-funding",
    deadline: "2026-03-25", deadlineLabel: "FY2027 CDS",
    submissionMethod: "web_form",
  },
  {
    id: "sen_manchin", name: "Sen. Joe Manchin", state: "WV", party: "D",
    committee: "Energy & Natural Resources", chamber: "Senate",
    formUrl: "https://www.manchin.senate.gov/funding",
    deadline: "2026-03-30", deadlineLabel: "FY2027 CDS",
    submissionMethod: "web_form",
  },
  {
    id: "sen_cantwell", name: "Sen. Maria Cantwell", state: "WA", party: "D",
    committee: "Commerce, Science & Transportation", chamber: "Senate",
    formUrl: "https://www.cantwell.senate.gov/community-funding",
    deadline: "2026-04-02", deadlineLabel: "FY2027 CDS",
    submissionMethod: "web_form",
  },
];

// Common field definitions (shared across ~70-80% of senator forms)
const COMMON_FIELDS = [
  { id: "org_name", label: "Organization / Entity Name", type: "text", required: true, category: "org", charLimit: null },
  { id: "org_address", label: "Organization Address", type: "text", required: true, category: "org", charLimit: null },
  { id: "org_ein", label: "EIN / Tax ID", type: "text", required: true, category: "org", charLimit: 10, helpText: "Federal Employer Identification Number" },
  { id: "contact_name", label: "Point of Contact — Full Name", type: "text", required: true, category: "org" },
  { id: "contact_email", label: "Point of Contact — Email", type: "email", required: true, category: "org" },
  { id: "contact_phone", label: "Point of Contact — Phone", type: "tel", required: true, category: "org" },
  { id: "project_title", label: "Project Title", type: "text", required: true, category: "project", charLimit: 150 },
  { id: "project_description", label: "Project Description / Narrative", type: "textarea", required: true, category: "narrative", charLimit: 2000 },
  { id: "funding_amount", label: "Requested Funding Amount ($)", type: "number", required: true, category: "funding" },
  { id: "appropriations_bill", label: "Appropriations Bill", type: "select", required: true, category: "funding",
    options: [
      "Agriculture", "Commerce-Justice-Science", "Defense", "Energy-Water",
      "Financial Services", "Homeland Security", "Interior-Environment",
      "Labor-HHS-Education", "Legislative Branch", "Military Construction-VA",
      "State-Foreign Operations", "Transportation-HUD",
    ],
  },
  { id: "appropriations_account", label: "Appropriations Account / Program", type: "text", required: true, category: "funding", helpText: "Specific account or program within the bill" },
  { id: "congressional_district", label: "Congressional District", type: "text", required: true, category: "project" },
  { id: "community_benefit", label: "Community Benefit / Impact Statement", type: "textarea", required: true, category: "narrative", charLimit: 1500 },
  { id: "federal_match", label: "Federal Matching Funds ($)", type: "number", required: false, category: "funding" },
  { id: "state_match", label: "State / Local Matching Funds ($)", type: "number", required: false, category: "funding" },
  { id: "private_match", label: "Private Matching Funds ($)", type: "number", required: false, category: "funding" },
  { id: "prior_federal_funding", label: "Prior Federal Funding for This Project", type: "textarea", required: false, category: "funding", charLimit: 500, helpText: "List any previous federal grants or earmarks" },
  { id: "cert_no_financial_interest", label: "Certification: No Financial Interest", type: "checkbox", required: true, category: "certification", helpText: "I certify that neither I nor my immediate family have a financial interest in this project" },
  { id: "cert_lobbying_compliance", label: "Certification: Lobbying Disclosure Compliance", type: "checkbox", required: true, category: "certification", helpText: "I certify this request complies with all lobbying disclosure requirements" },
];

// Senator-specific field overrides and additions
const SENATOR_FIELD_OVERRIDES = {
  sen_schumer: {
    overrides: {
      project_description: { charLimit: 1500, label: "Project Description (1,500 characters max)" },
      community_benefit: { charLimit: 1000, label: "Community Impact Statement (1,000 characters max)" },
    },
    additions: [
      { id: "priority_ranking", label: "Priority Ranking (if submitting multiple requests)", type: "number", required: false, category: "project", helpText: "Rank this request relative to your other submissions (1 = highest)" },
      { id: "project_timeline", label: "Anticipated Project Timeline", type: "text", required: true, category: "project" },
      { id: "jobs_created", label: "Estimated Jobs Created or Sustained", type: "number", required: false, category: "project" },
    ],
  },
  sen_gillibrand: {
    overrides: {
      project_description: { charLimit: 2000, label: "Detailed Project Narrative (2,000 characters max)" },
    },
    additions: [
      { id: "equity_impact", label: "Equity & Underserved Community Impact", type: "textarea", required: true, category: "narrative", charLimit: 800, helpText: "Describe how this project serves historically underserved communities" },
      { id: "environmental_impact", label: "Environmental Impact Assessment", type: "textarea", required: false, category: "narrative", charLimit: 500 },
      { id: "letters_of_support", label: "Letters of Support (upload)", type: "file", required: true, category: "attachment", helpText: "PDF format, max 10MB total" },
    ],
  },
  sen_padilla: {
    overrides: {
      project_description: { charLimit: 1200, label: "Project Summary (1,200 characters max)" },
    },
    additions: [
      { id: "ca_district", label: "California State Senate / Assembly District", type: "text", required: true, category: "project" },
      { id: "disadvantaged_community", label: "Located in Disadvantaged Community?", type: "select", required: true, category: "project", options: ["Yes", "No", "Partially"] },
      { id: "climate_resilience", label: "Climate Resilience & Sustainability Impact", type: "textarea", required: false, category: "narrative", charLimit: 600 },
      { id: "budget_breakdown", label: "Detailed Budget Breakdown (upload)", type: "file", required: true, category: "attachment" },
    ],
  },
  sen_murray: {
    overrides: {
      project_description: { charLimit: 2500, label: "Comprehensive Project Description (2,500 characters max)" },
      community_benefit: { charLimit: 2000, label: "Community Impact & Need (2,000 characters max)" },
    },
    additions: [
      { id: "wa_county", label: "Washington County", type: "text", required: true, category: "project" },
      { id: "tribal_impact", label: "Tribal Nation Impact (if applicable)", type: "textarea", required: false, category: "narrative", charLimit: 500 },
      { id: "project_readiness", label: "Project Readiness & Shovel-Ready Status", type: "select", required: true, category: "project", options: ["Ready to begin immediately", "Within 6 months", "Within 12 months", "Longer timeline"] },
    ],
  },
  sen_reed: {
    overrides: {},
    additions: [
      { id: "ri_municipality", label: "Rhode Island Municipality", type: "text", required: true, category: "project" },
      { id: "entity_type", label: "Entity Type", type: "select", required: true, category: "org", options: ["Municipality", "Non-Profit (501c3)", "State Agency", "Tribal Government", "Special District", "Other"] },
      { id: "project_map", label: "Project Location Map (upload)", type: "file", required: false, category: "attachment" },
    ],
  },
  sen_wicker: {
    overrides: {
      project_description: { charLimit: 1800 },
    },
    additions: [
      { id: "ms_county", label: "Mississippi County", type: "text", required: true, category: "project" },
      { id: "rural_designation", label: "Rural Area Designation", type: "select", required: false, category: "project", options: ["Urban", "Suburban", "Rural", "Tribal"] },
      { id: "economic_impact", label: "Economic Impact Estimate", type: "textarea", required: true, category: "narrative", charLimit: 800 },
    ],
  },
  sen_collins: {
    overrides: {
      community_benefit: { charLimit: 1200, label: "Community Need & Benefit (1,200 chars)" },
    },
    additions: [
      { id: "me_county", label: "Maine County", type: "text", required: true, category: "project" },
      { id: "bipartisan_support", label: "Evidence of Bipartisan / Community Support", type: "textarea", required: false, category: "narrative", charLimit: 600 },
      { id: "sustainability_plan", label: "Long-Term Sustainability Plan", type: "textarea", required: true, category: "narrative", charLimit: 800, helpText: "How will this project sustain itself after federal funding ends?" },
    ],
  },
  sen_manchin: {
    overrides: {},
    additions: [
      { id: "wv_county", label: "West Virginia County", type: "text", required: true, category: "project" },
      { id: "workforce_impact", label: "Workforce Development Impact", type: "textarea", required: false, category: "narrative", charLimit: 600 },
      { id: "infrastructure_type", label: "Infrastructure Category", type: "select", required: false, category: "project", options: ["Water/Sewer", "Broadband", "Roads/Bridges", "Energy", "Healthcare Facility", "Education Facility", "Public Safety", "Other"] },
    ],
  },
  sen_cantwell: {
    overrides: {
      project_description: { charLimit: 2000 },
    },
    additions: [
      { id: "wa_county_cantwell", label: "Washington County", type: "text", required: true, category: "project" },
      { id: "innovation_impact", label: "Innovation & Technology Impact", type: "textarea", required: false, category: "narrative", charLimit: 600 },
      { id: "clean_energy_alignment", label: "Clean Energy & Climate Alignment", type: "textarea", required: false, category: "narrative", charLimit: 500 },
    ],
  },
  sen_feinstein_successor: {
    overrides: {
      project_description: { charLimit: 1500 },
    },
    additions: [
      { id: "ca_county", label: "California County", type: "text", required: true, category: "project" },
      { id: "housing_impact", label: "Housing & Homelessness Impact (if applicable)", type: "textarea", required: false, category: "narrative", charLimit: 500 },
      { id: "public_safety_impact", label: "Public Safety Impact (if applicable)", type: "textarea", required: false, category: "narrative", charLimit: 500 },
    ],
  },
};

/**
 * Build the complete field list for a senator, merging common + overrides + additions
 */
export function getSenatorFields(senatorId) {
  const config = SENATOR_FIELD_OVERRIDES[senatorId] || { overrides: {}, additions: [] };

  const merged = COMMON_FIELDS.map((field) => {
    const override = config.overrides[field.id];
    return override ? { ...field, ...override } : { ...field };
  });

  return [...merged, ...(config.additions || [])];
}

/**
 * Get common fields (shared across all senators)
 */
export function getCommonFields() {
  return [...COMMON_FIELDS];
}

/**
 * Get senator-specific fields only (additions beyond common)
 */
export function getSenatorSpecificFields(senatorId) {
  const config = SENATOR_FIELD_OVERRIDES[senatorId] || { additions: [] };
  return config.additions || [];
}

/**
 * Compute field overlap between multiple senators
 */
export function getFieldOverlap(senatorIds) {
  const allFieldSets = senatorIds.map((id) => getSenatorFields(id));
  const commonIds = new Set(COMMON_FIELDS.map((f) => f.id));

  const uniqueBySenator = {};
  senatorIds.forEach((id, i) => {
    uniqueBySenator[id] = allFieldSets[i].filter((f) => !commonIds.has(f.id));
  });

  return {
    commonFieldCount: COMMON_FIELDS.length,
    totalUniqueFields: Object.values(uniqueBySenator).reduce((s, a) => s + a.length, 0),
    uniqueBySenator,
  };
}

export default senators;
