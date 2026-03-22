// ═══════════════════════════════════════════════════════════════
// LDA (Lobbying Disclosure Act) Structured Data
// Mirrors Senate LDA API: https://lda.senate.gov/api/
// Tables: registrants, clients, filings, lobbyists, topics
// ═══════════════════════════════════════════════════════════════

// --- Registrant Firms (lobbying firms / in-house teams) ---
export const registrants = [
  {
    id: "reg_001", name: "Capstone Government Affairs",
    address: "1100 Connecticut Ave NW, Suite 1200, Washington, DC 20036",
    description: "Full-service bipartisan government affairs firm specializing in defense, healthcare, and technology policy.",
    website: "https://capstonegov.com", phone: "(202) 555-0147",
    ldaRegistrationId: "301-24-0042", registrationDate: "2018-03-15",
    country: "US", state: "DC", contactName: "Sarah Mitchell",
    totalRevenue: 4850000, activeClients: 12,
  },
  {
    id: "reg_002", name: "Meridian Policy Group",
    address: "700 13th St NW, Suite 600, Washington, DC 20005",
    description: "Boutique policy advisory firm focused on energy, environment, and infrastructure.",
    website: "https://meridianpolicy.com", phone: "(202) 555-0293",
    ldaRegistrationId: "301-22-0118", registrationDate: "2020-06-01",
    country: "US", state: "DC", contactName: "James Park",
    totalRevenue: 2100000, activeClients: 7,
  },
  {
    id: "reg_003", name: "Brownstein Hyatt Farber Schreck",
    address: "1155 F St NW, Suite 1200, Washington, DC 20004",
    description: "National law and lobbying firm with deep government relations expertise across multiple sectors.",
    website: "https://bhfs.com", phone: "(202) 555-0310",
    ldaRegistrationId: "301-19-0087", registrationDate: "2015-01-20",
    country: "US", state: "DC", contactName: "Marc Lampkin",
    totalRevenue: 12400000, activeClients: 45,
  },
  {
    id: "reg_004", name: "Akin Gump Strauss Hauer & Feld",
    address: "2001 K St NW, Washington, DC 20006",
    description: "Global law firm with one of the largest lobbying practices in Washington, DC.",
    website: "https://akingump.com", phone: "(202) 555-0422",
    ldaRegistrationId: "301-18-0023", registrationDate: "2012-04-10",
    country: "US", state: "DC", contactName: "Brian Pomper",
    totalRevenue: 18700000, activeClients: 78,
  },
  {
    id: "reg_005", name: "Holland & Knight",
    address: "800 17th St NW, Suite 1100, Washington, DC 20006",
    description: "Full-service law firm with a robust government affairs and public policy practice.",
    website: "https://hklaw.com", phone: "(202) 555-0188",
    ldaRegistrationId: "301-17-0055", registrationDate: "2014-09-01",
    country: "US", state: "DC", contactName: "Rich Gold",
    totalRevenue: 9800000, activeClients: 52,
  },
  {
    id: "reg_006", name: "Invariant LLC",
    address: "1730 Pennsylvania Ave NW, Suite 900, Washington, DC 20006",
    description: "Bipartisan strategic advisory firm helping clients navigate policy and regulatory challenges.",
    website: "https://invariant.com", phone: "(202) 555-0576",
    ldaRegistrationId: "301-21-0134", registrationDate: "2019-07-15",
    country: "US", state: "DC", contactName: "Heather Podesta",
    totalRevenue: 7600000, activeClients: 31,
  },
  {
    id: "reg_007", name: "BGR Group",
    address: "1300 I St NW, Suite 1000, Washington, DC 20005",
    description: "Leading bipartisan government affairs firm providing advocacy and strategic advisory services.",
    website: "https://bgrdc.com", phone: "(202) 555-0639",
    ldaRegistrationId: "301-16-0091", registrationDate: "2010-03-22",
    country: "US", state: "DC", contactName: "Bob Wood",
    totalRevenue: 8900000, activeClients: 38,
  },
  {
    id: "reg_008", name: "Crossroads Strategies",
    address: "1001 G St NW, Suite 800, Washington, DC 20001",
    description: "Bipartisan government relations and communications firm specializing in healthcare and financial services.",
    website: "https://crossroadsstrategies.com", phone: "(202) 555-0744",
    ldaRegistrationId: "301-20-0067", registrationDate: "2016-11-05",
    country: "US", state: "DC", contactName: "Scott Parven",
    totalRevenue: 5200000, activeClients: 22,
  },
  {
    id: "reg_009", name: "Capitol Counsel",
    address: "900 7th St NW, Suite 700, Washington, DC 20001",
    description: "Government affairs firm providing legislative advocacy and strategic consulting to technology and telecom clients.",
    website: "https://capitolcounsel.com", phone: "(202) 555-0812",
    ldaRegistrationId: "301-23-0156", registrationDate: "2021-02-14",
    country: "US", state: "DC", contactName: "Timothy Berry",
    totalRevenue: 3400000, activeClients: 15,
  },
  {
    id: "reg_010", name: "Alpine Group",
    address: "1341 G St NW, Suite 600, Washington, DC 20005",
    description: "Advocacy and government affairs firm representing technology, defense, and financial services clients.",
    website: "https://alpinegroup.com", phone: "(202) 555-0901",
    ldaRegistrationId: "301-19-0102", registrationDate: "2017-05-30",
    country: "US", state: "DC", contactName: "Steve Hart",
    totalRevenue: 4100000, activeClients: 19,
  },
];

// --- Clients (who the firm represents) ---
export const clients = [
  {
    id: "cli_001", registrantId: "reg_001", name: "Northrop Defense Systems",
    description: "Advanced defense technology and cybersecurity solutions provider.",
    industry: "Defense & Aerospace", country: "US", state: "VA",
    generalDescription: "Defense contractor specializing in autonomous systems, cyber defense platforms, and satellite communications.",
    tags: ["Defense", "Cyber", "Aerospace", "AI/ML"],
    contactName: "Michael Torres", contactEmail: "m.torres@northropdef.com",
    annualSpend: 980000, status: "active", createdAt: "2022-01-15",
    topics: ["top_001", "top_002", "top_003"],
    avatar: "ND",
  },
  {
    id: "cli_002", registrantId: "reg_001", name: "HealthBridge Solutions",
    description: "Digital health platform connecting rural hospitals with specialist networks.",
    industry: "Healthcare Technology", country: "US", state: "TN",
    generalDescription: "Telehealth and health IT company focused on expanding healthcare access in underserved communities.",
    tags: ["Healthcare", "Telehealth", "Rural Access", "AI"],
    contactName: "Dr. Lisa Chen", contactEmail: "l.chen@healthbridge.io",
    annualSpend: 420000, status: "active", createdAt: "2023-03-20",
    topics: ["top_004", "top_005"],
    avatar: "HB",
  },
  {
    id: "cli_003", registrantId: "reg_001", name: "Pacific Clean Energy",
    description: "Utility-scale solar and battery storage developer.",
    industry: "Clean Energy", country: "US", state: "CA",
    generalDescription: "Develops and operates solar farms and grid-scale battery storage facilities across the western United States.",
    tags: ["Energy", "Solar", "Storage", "Climate"],
    contactName: "Raj Patel", contactEmail: "raj@pacificclean.energy",
    annualSpend: 560000, status: "active", createdAt: "2023-08-10",
    topics: ["top_006", "top_007"],
    avatar: "PC",
  },
  {
    id: "cli_004", registrantId: "reg_001", name: "DataVault Technologies",
    description: "Enterprise data sovereignty and privacy compliance platform.",
    industry: "Technology", country: "US", state: "TX",
    generalDescription: "Provides data localization, encryption, and compliance tooling for enterprises subject to GDPR, CCPA, and federal data handling requirements.",
    tags: ["Privacy", "Data", "Compliance", "FedRAMP"],
    contactName: "Amanda Wright", contactEmail: "a.wright@datavault.tech",
    annualSpend: 310000, status: "active", createdAt: "2024-01-05",
    topics: ["top_008"],
    avatar: "DV",
  },
  {
    id: "cli_005", registrantId: "reg_001", name: "Greenfield Agriculture",
    description: "Precision agriculture technology for sustainable farming.",
    industry: "Agriculture & Food", country: "US", state: "IA",
    generalDescription: "AI-driven precision agriculture company helping farmers optimize crop yields while reducing water and pesticide usage.",
    tags: ["Agriculture", "AI", "Sustainability", "Water"],
    contactName: "Tom Baker", contactEmail: "t.baker@greenfieldag.com",
    annualSpend: 180000, status: "active", createdAt: "2024-06-15",
    topics: ["top_009"],
    avatar: "GA",
  },
];

// --- Topics (policy focus areas per client) ---
export const topics = [
  {
    id: "top_001", clientId: "cli_001", name: "NDAA FY26 — Section 1045",
    description: "Autonomous systems procurement authorization and testing requirements.",
    issueArea: "Defense", submissionType: "bill_language",
    fundingAmount: 48000000, desiredOutcome: "Include authorization for expanded autonomous systems testing ranges.",
    status: "drafting", priority: "high",
    targetOffices: ["off_001", "off_002", "off_004"],
  },
  {
    id: "top_002", clientId: "cli_001", name: "Cyber Workforce Development",
    description: "Appropriations request for cyber workforce pipeline programs.",
    issueArea: "Cybersecurity", submissionType: "appropriations",
    fundingAmount: 15000000, desiredOutcome: "Secure $15M for DoD cyber workforce training partnerships.",
    status: "submitted", priority: "high",
    targetOffices: ["off_001", "off_003"],
  },
  {
    id: "top_003", clientId: "cli_001", name: "Export Control Modernization",
    description: "Report language supporting ITAR reform for allied technology sharing.",
    issueArea: "Trade & Export", submissionType: "report_language",
    fundingAmount: null, desiredOutcome: "Include report language directing State Dept to review ITAR Category XII.",
    status: "approved", priority: "medium",
    targetOffices: ["off_002", "off_005"],
  },
  {
    id: "top_004", clientId: "cli_002", name: "Rural Telehealth Expansion Act",
    description: "Support for bipartisan telehealth infrastructure funding.",
    issueArea: "Healthcare", submissionType: "bill_language",
    fundingAmount: 200000000, desiredOutcome: "Co-sponsor language for permanent telehealth flexibilities.",
    status: "drafting", priority: "high",
    targetOffices: ["off_006", "off_007"],
  },
  {
    id: "top_005", clientId: "cli_002", name: "AI in Diagnostics — FDA Pathway",
    description: "White paper on regulatory framework for AI-assisted medical diagnostics.",
    issueArea: "Healthcare Technology", submissionType: "white_paper",
    fundingAmount: null, desiredOutcome: "Establish clear FDA pre-certification pathway for AI diagnostics tools.",
    status: "review", priority: "medium",
    targetOffices: ["off_006"],
  },
  {
    id: "top_006", clientId: "cli_003", name: "ITC Extension — Solar Manufacturing",
    description: "Investment Tax Credit extension for domestic solar panel manufacturing.",
    issueArea: "Energy & Environment", submissionType: "appropriations",
    fundingAmount: null, desiredOutcome: "Extend 30% ITC through 2032 with domestic content bonus.",
    status: "submitted", priority: "high",
    targetOffices: ["off_008", "off_009"],
  },
  {
    id: "top_007", clientId: "cli_003", name: "Grid Storage Resilience Program",
    description: "New program authorization for grid-scale battery deployment.",
    issueArea: "Energy & Environment", submissionType: "bill_language",
    fundingAmount: 500000000, desiredOutcome: "Authorize DOE program for grid resilience battery installations.",
    status: "drafting", priority: "medium",
    targetOffices: ["off_008"],
  },
  {
    id: "top_008", clientId: "cli_004", name: "Federal Data Sovereignty Act",
    description: "Support for data localization requirements in federal contracting.",
    issueArea: "Technology & Privacy", submissionType: "bill_language",
    fundingAmount: null, desiredOutcome: "Include data sovereignty requirements in federal acquisition regulations.",
    status: "drafting", priority: "high",
    targetOffices: ["off_010", "off_003"],
  },
  {
    id: "top_009", clientId: "cli_005", name: "Precision Agriculture Research",
    description: "USDA research funding for AI-driven sustainable farming.",
    issueArea: "Agriculture", submissionType: "appropriations",
    fundingAmount: 25000000, desiredOutcome: "Secure USDA ARS funding for precision agriculture research centers.",
    status: "review", priority: "medium",
    targetOffices: ["off_011"],
  },
];

// --- Submissions (actual documents generated/submitted) ---
export const submissions = [
  {
    id: "sub_001", topicId: "top_001", officeId: "off_001",
    title: "NDAA FY26 Section 1045 — Autonomous Systems Authorization",
    type: "bill_language", status: "draft",
    content: "SEC. 1045. AUTHORIZATION OF APPROPRIATIONS FOR AUTONOMOUS SYSTEMS TESTING.\n\n(a) IN GENERAL.—The Secretary of Defense, acting through the Director of the Defense Advanced Research Projects Agency, is authorized to establish expanded testing ranges for autonomous defense systems...",
    aiGenerated: true, aiModel: "claude-3.5-sonnet",
    version: 3, lastEditedBy: "Jordan Davis",
    createdAt: "2025-02-15T10:30:00Z", updatedAt: "2025-03-10T14:22:00Z",
    wordCount: 1847, approvalStatus: "pending_review",
  },
  {
    id: "sub_002", topicId: "top_002", officeId: "off_001",
    title: "Cyber Workforce Pipeline — Appropriations Request",
    type: "appropriations", status: "submitted",
    content: "REQUEST: $15,000,000 for the Department of Defense Cyber Workforce Development Initiative...",
    aiGenerated: true, aiModel: "claude-3.5-sonnet",
    version: 5, lastEditedBy: "Sarah Mitchell",
    createdAt: "2025-01-20T09:00:00Z", updatedAt: "2025-02-28T16:45:00Z",
    wordCount: 2341, approvalStatus: "approved",
    submittedAt: "2025-03-01T09:00:00Z",
  },
  {
    id: "sub_003", topicId: "top_004", officeId: "off_006",
    title: "Rural Telehealth Expansion — Bill Language",
    type: "bill_language", status: "draft",
    content: "SEC. XXX. PERMANENT TELEHEALTH FLEXIBILITIES FOR RURAL COMMUNITIES.\n\n(a) FINDINGS.—Congress finds that...",
    aiGenerated: true, aiModel: "claude-3.5-sonnet",
    version: 2, lastEditedBy: "Jordan Davis",
    createdAt: "2025-03-05T11:00:00Z", updatedAt: "2025-03-18T13:30:00Z",
    wordCount: 1523, approvalStatus: "pending_review",
  },
  {
    id: "sub_004", topicId: "top_003", officeId: "off_002",
    title: "ITAR Category XII Review — Report Language",
    type: "report_language", status: "approved",
    content: "The Committee directs the Department of State to conduct a comprehensive review of International Traffic in Arms Regulations (ITAR) Category XII...",
    aiGenerated: false, aiModel: null,
    version: 7, lastEditedBy: "Sarah Mitchell",
    createdAt: "2024-11-01T08:00:00Z", updatedAt: "2025-01-15T17:00:00Z",
    wordCount: 896, approvalStatus: "approved",
    submittedAt: "2025-01-20T10:00:00Z",
  },
  {
    id: "sub_005", topicId: "top_006", officeId: "off_008",
    title: "ITC Extension — Solar Manufacturing Appropriations",
    type: "appropriations", status: "submitted",
    content: "REQUEST: Extension of 30% Investment Tax Credit for domestic solar panel manufacturing facilities through fiscal year 2032...",
    aiGenerated: true, aiModel: "claude-3.5-sonnet",
    version: 4, lastEditedBy: "Jordan Davis",
    createdAt: "2025-02-01T10:00:00Z", updatedAt: "2025-03-05T11:30:00Z",
    wordCount: 1678, approvalStatus: "approved",
    submittedAt: "2025-03-06T09:00:00Z",
  },
];

// --- Congressional Offices ---
export const offices = [
  { id: "off_001", name: "Sen. Jack Reed (D-RI)", chamber: "Senate", party: "D", state: "RI", committee: "Armed Services", role: "Chair", submissionPortal: "https://reed.senate.gov/contact", adoptedForms: true },
  { id: "off_002", name: "Sen. Roger Wicker (R-MS)", chamber: "Senate", party: "R", state: "MS", committee: "Armed Services", role: "Ranking Member", submissionPortal: "https://wicker.senate.gov/contact", adoptedForms: true },
  { id: "off_003", name: "Rep. Mike Turner (R-OH)", chamber: "House", party: "R", state: "OH", committee: "Intelligence", role: "Chair", submissionPortal: null, adoptedForms: false },
  { id: "off_004", name: "Rep. Adam Smith (D-WA)", chamber: "House", party: "D", state: "WA", committee: "Armed Services", role: "Ranking Member", submissionPortal: "https://adamsmith.house.gov", adoptedForms: true },
  { id: "off_005", name: "Sen. Bob Menendez (D-NJ)", chamber: "Senate", party: "D", state: "NJ", committee: "Foreign Relations", role: "Member", submissionPortal: null, adoptedForms: false },
  { id: "off_006", name: "Sen. Patty Murray (D-WA)", chamber: "Senate", party: "D", state: "WA", committee: "HELP", role: "Chair", submissionPortal: "https://murray.senate.gov/contact", adoptedForms: true },
  { id: "off_007", name: "Rep. Cathy McMorris Rodgers (R-WA)", chamber: "House", party: "R", state: "WA", committee: "Energy & Commerce", role: "Chair", submissionPortal: null, adoptedForms: false },
  { id: "off_008", name: "Sen. Joe Manchin (D-WV)", chamber: "Senate", party: "D", state: "WV", committee: "Energy & Natural Resources", role: "Chair", submissionPortal: "https://manchin.senate.gov/contact", adoptedForms: true },
  { id: "off_009", name: "Rep. Frank Pallone (D-NJ)", chamber: "House", party: "D", state: "NJ", committee: "Energy & Commerce", role: "Ranking Member", submissionPortal: null, adoptedForms: false },
  { id: "off_010", name: "Sen. Maria Cantwell (D-WA)", chamber: "Senate", party: "D", state: "WA", committee: "Commerce, Science & Transportation", role: "Chair", submissionPortal: "https://cantwell.senate.gov", adoptedForms: true },
  { id: "off_011", name: "Sen. Debbie Stabenow (D-MI)", chamber: "Senate", party: "D", state: "MI", committee: "Agriculture", role: "Chair", submissionPortal: "https://stabenow.senate.gov", adoptedForms: true },
];

// --- Lobbyists (team members registered under LDA) ---
export const lobbyists = [
  { id: "lob_001", registrantId: "reg_001", name: "Jordan Davis", email: "j.davis@capstonegov.com", coveredPosition: "Former Legislative Director, Sen. Reed", issueAreas: ["Defense", "Cybersecurity", "Intelligence"], status: "active" },
  { id: "lob_002", registrantId: "reg_001", name: "Sarah Mitchell", email: "s.mitchell@capstonegov.com", coveredPosition: "Former Chief of Staff, Rep. Smith", issueAreas: ["Defense", "Trade", "Appropriations"], status: "active" },
  { id: "lob_003", registrantId: "reg_001", name: "David Kim", email: "d.kim@capstonegov.com", coveredPosition: "Former HHS Policy Advisor", issueAreas: ["Healthcare", "Technology", "FDA"], status: "active" },
  { id: "lob_004", registrantId: "reg_001", name: "Elena Rodriguez", email: "e.rodriguez@capstonegov.com", coveredPosition: null, issueAreas: ["Energy", "Environment", "Agriculture"], status: "active" },
];

// --- LD-2 Filing Periods ---
export const filingPeriods = [
  { id: "fp_001", type: "LD-2", period: "Q1 2025", dueDate: "2025-04-20", status: "upcoming", daysLeft: 30 },
  { id: "fp_002", type: "LD-2", period: "Q4 2024", dueDate: "2025-01-20", status: "filed", filedDate: "2025-01-18" },
  { id: "fp_003", type: "LD-203", period: "2024 Year-End", dueDate: "2025-01-30", status: "filed", filedDate: "2025-01-28" },
  { id: "fp_004", type: "LD-2", period: "Q2 2025", dueDate: "2025-07-20", status: "upcoming", daysLeft: 121 },
];

// --- Billing Plans (Stripe integration) ---
export const plans = [
  { id: "plan_starter", name: "Starter", price: 299, interval: "month", seats: 3, features: ["5 active clients", "Basic AI drafting", "LD-2 filing tracker", "Email support"] },
  { id: "plan_professional", name: "Professional", price: 799, interval: "month", seats: 10, features: ["25 active clients", "Advanced AI drafting + critique", "Multi-office routing", "Congressional office database", "Priority support"], popular: true },
  { id: "plan_enterprise", name: "Enterprise", price: null, interval: "month", seats: null, features: ["Unlimited clients", "Custom AI prompts", "Form automation", "SSO/SAML", "Dedicated CSM", "SLA guarantee", "API access"] },
];
