// ═══════════════════════════════════════════════════════════════
// Congressional Stakeholder Research — Mock Data
// CRS Taxonomy topics, 95 congressional members with activity scores,
// committee assignments, voting records, and engagement history
// ═══════════════════════════════════════════════════════════════

// CRS (Congressional Research Service) Topic Taxonomy
export const CRS_TOPICS = [
  "Public participation and lobbying",
  "Defense spending",
  "Department of Energy",
  "Armed forces and national security",
  "Cybersecurity and infrastructure protection",
  "Military procurement, research, weapons development",
  "Intelligence activities, surveillance, classified information",
  "Government liability",
  "Water quality",
  "Hazardous wastes and toxic substances",
  "Coal",
  "Mining",
  "Nuclear weapons",
  "Space flight and exploration",
  "Advanced technology and technological innovations",
  "Appropriations",
  "Budget process",
  "Congressional oversight",
  "Defense budget",
  "Emergency management",
  "Environmental protection",
  "Foreign affairs",
  "Health care coverage and access",
  "Homeland security",
  "Immigration",
  "International trade",
  "Small business",
  "Tax policy",
  "Technology transfer and commercialization",
  "Telecommunications",
  "Transportation and infrastructure",
  "Veterans' affairs",
  "Artificial intelligence",
  "Semiconductor manufacturing",
  "Supply chain security",
  "Unmanned aerial vehicles (drones)",
  "Directed energy weapons",
  "Hypersonic weapons",
  "Quantum computing",
  "Rare earth minerals",
];

// Generate deterministic activity score history
function generateScoreHistory(baseScore, memberId) {
  const seed = memberId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const months = ["Jan", "Feb", "Mar", "Apr"];
  return months.map((month, i) => {
    const variance = ((seed * (i + 1) * 7) % 30) - 15;
    const score = Math.max(0, Math.min(100, baseScore + variance));
    return { month, score: Math.round(score) };
  });
}

// Generate 12-month history for profile view
function generate12MonthHistory(baseScore, memberId) {
  const seed = memberId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const current = [];
  const previous = [];
  months.forEach((month, i) => {
    const v1 = ((seed * (i + 1) * 7) % 40) - 20;
    const v2 = ((seed * (i + 1) * 13) % 35) - 17;
    current.push({ month, score: Math.max(0, Math.min(100, baseScore + v1)) });
    previous.push({ month, score: Math.max(0, Math.min(100, Math.round(baseScore * 0.7) + v2)) });
  });
  return { current, previous };
}

export const MEMBERS = [
  // ── Top scorers ──
  {
    id: "sen_gary_peters", name: "Gary Peters", title: "Senator", chamber: "Senate",
    party: "D", state: "MI", district: null,
    photo: null,
    serviceStart: "January 2015", reElection: "November 2026",
    committees: ["Armed Services", "Commerce, Science & Transportation", "Homeland Security"],
    activityScore: 100,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 100 },
      { topic: "Cybersecurity and infrastructure protection", score: 88 },
      { topic: "Armed forces and national security", score: 76 },
      { topic: "Artificial intelligence", score: 65 },
      { topic: "Homeland security", score: 58 },
      { topic: "Semiconductor manufacturing", score: 42 },
    ],
    keyPositions: ["Ranking Member, SASC Cybersecurity Subcommittee", "Former Chairman, HSGAC"],
    recentActions: [
      { date: "2026-04-08", action: "Introduced S.4521 — National Cybersecurity Workforce Act", type: "bill" },
      { date: "2026-03-22", action: "Spoke at SASC hearing on AI in defense procurement", type: "hearing" },
      { date: "2026-03-15", action: "Co-sponsored Semiconductor Supply Chain Security Act", type: "cosponsor" },
      { date: "2026-02-28", action: "Press release on Michigan defense manufacturing investments", type: "press" },
      { date: "2026-02-10", action: "Floor statement on FY2027 defense authorization priorities", type: "floor" },
    ],
    staffContacts: [
      { name: "David Thompson", role: "Legislative Director", focus: "Defense & Technology" },
      { name: "Sarah Chen", role: "Senior Policy Advisor", focus: "Cybersecurity" },
      { name: "Marcus Williams", role: "Military Legislative Assistant", focus: "SASC Issues" },
    ],
    engagementHistory: [
      { date: "2026-03-15", note: "Met with LD re: autonomous systems PE increase", outcome: "Supportive" },
      { date: "2025-11-20", note: "Staff briefing on hypersonic defense tech", outcome: "Requested follow-up" },
    ],
  },
  {
    id: "sen_chuck_grassley", name: "Chuck Grassley", title: "Senator", chamber: "Senate",
    party: "R", state: "IA", district: null,
    photo: null,
    serviceStart: "January 1981", reElection: "November 2028",
    committees: ["Judiciary", "Finance", "Budget", "Agriculture"],
    activityScore: 51,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 51 },
      { topic: "Congressional oversight", score: 89 },
      { topic: "Budget process", score: 72 },
      { topic: "Tax policy", score: 60 },
      { topic: "Government liability", score: 45 },
    ],
    keyPositions: ["President Pro Tempore Emeritus", "Former Chairman, Judiciary Committee"],
    recentActions: [
      { date: "2026-04-02", action: "Requested GAO audit on defense contract oversight", type: "oversight" },
      { date: "2026-03-18", action: "Floor speech on lobbying transparency reforms", type: "floor" },
      { date: "2026-02-20", action: "Co-sponsored Whistleblower Protection Enhancement Act", type: "cosponsor" },
    ],
    staffContacts: [
      { name: "James Crowell", role: "Chief of Staff", focus: "All Legislative" },
      { name: "Karen McNulty", role: "Legislative Director", focus: "Judiciary & Oversight" },
    ],
    engagementHistory: [],
  },
  {
    id: "sen_dick_durbin", name: "Dick Durbin", title: "Senator", chamber: "Senate",
    party: "D", state: "IL", district: null,
    photo: null,
    serviceStart: "January 1997", reElection: "November 2026",
    committees: ["Judiciary", "Appropriations", "Agriculture"],
    activityScore: 39,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 39 },
      { topic: "Appropriations", score: 82 },
      { topic: "Immigration", score: 70 },
      { topic: "Defense spending", score: 55 },
      { topic: "Health care coverage and access", score: 48 },
    ],
    keyPositions: ["Senate Majority Whip", "Chairman, Judiciary Committee"],
    recentActions: [
      { date: "2026-04-05", action: "Markup of FY2027 defense appropriations bill", type: "markup" },
      { date: "2026-03-20", action: "Statement on lobbying disclosure requirements", type: "press" },
    ],
    staffContacts: [
      { name: "Patrick Souders", role: "Chief of Staff", focus: "All Legislative" },
      { name: "Joe Shoemaker", role: "Legislative Director", focus: "Appropriations" },
    ],
    engagementHistory: [],
  },
  {
    id: "rep_mike_rogers", name: "Mike Rogers", title: "Representative", chamber: "House",
    party: "R", state: "AL", district: "03",
    photo: null,
    serviceStart: "January 2003", reElection: "November 2026",
    committees: ["Armed Services"],
    activityScore: 30,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 30 },
      { topic: "Armed forces and national security", score: 95 },
      { topic: "Defense spending", score: 90 },
      { topic: "Military procurement, research, weapons development", score: 85 },
      { topic: "Nuclear weapons", score: 60 },
    ],
    keyPositions: ["Chairman, House Armed Services Committee"],
    recentActions: [
      { date: "2026-04-07", action: "Opened HASC hearing on FY2027 defense posture", type: "hearing" },
      { date: "2026-03-25", action: "Introduced NDAA markup timeline for FY2027", type: "bill" },
    ],
    staffContacts: [
      { name: "Chris Shank", role: "Staff Director, HASC", focus: "Defense Authorization" },
    ],
    engagementHistory: [
      { date: "2026-02-12", note: "HASC briefing on directed energy program budget", outcome: "Neutral" },
    ],
  },
  {
    id: "sen_roger_wicker", name: "Roger Wicker", title: "Senator", chamber: "Senate",
    party: "R", state: "MS", district: null,
    photo: null,
    serviceStart: "December 2007", reElection: "November 2030",
    committees: ["Armed Services", "Commerce, Science & Transportation", "Environment & Public Works"],
    activityScore: 30,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 30 },
      { topic: "Armed forces and national security", score: 92 },
      { topic: "Defense spending", score: 88 },
      { topic: "Space flight and exploration", score: 65 },
      { topic: "Hypersonic weapons", score: 55 },
    ],
    keyPositions: ["Chairman, Senate Armed Services Committee"],
    recentActions: [
      { date: "2026-04-09", action: "SASC markup of FY2027 National Defense Authorization Act", type: "markup" },
      { date: "2026-03-30", action: "Press release on shipbuilding investment priorities", type: "press" },
      { date: "2026-03-12", action: "Hearing on hypersonic weapon program status", type: "hearing" },
    ],
    staffContacts: [
      { name: "Rick Dearborn", role: "Chief of Staff", focus: "All Legislative" },
      { name: "John Lehman", role: "Staff Director, SASC", focus: "Defense Authorization" },
    ],
    engagementHistory: [
      { date: "2026-03-01", note: "Staff call regarding PE 0604856F — space launch modernization", outcome: "Interested" },
    ],
  },
  {
    id: "rep_darin_lahood", name: "Darin LaHood", title: "Representative", chamber: "House",
    party: "R", state: "IL", district: "16",
    photo: null,
    serviceStart: "September 2015", reElection: "November 2026",
    committees: ["Ways and Means", "Permanent Select Committee on Intelligence"],
    activityScore: 30,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 30 },
      { topic: "Government liability", score: 100 },
      { topic: "Water quality", score: 32 },
      { topic: "Hazardous wastes and toxic substances", score: 26 },
      { topic: "Coal", score: 24 },
      { topic: "Mining", score: 18 },
    ],
    keyPositions: ["Member, Ways and Means Committee", "Member, Intelligence Committee"],
    recentActions: [
      { date: "2026-04-06", action: "Co-sponsored Government Accountability in Lobbying Act", type: "cosponsor" },
      { date: "2026-03-19", action: "Hearing on foreign lobbying disclosure gaps", type: "hearing" },
      { date: "2026-02-15", action: "Statement on water infrastructure investments in IL-16", type: "press" },
    ],
    staffContacts: [
      { name: "Steven Pinkos", role: "Chief of Staff", focus: "All Legislative" },
      { name: "Emily Bratcher", role: "Legislative Director", focus: "Ways and Means" },
    ],
    engagementHistory: [],
  },
  // ── Additional members for realistic pagination ──
  {
    id: "sen_jack_reed", name: "Jack Reed", title: "Senator", chamber: "Senate",
    party: "D", state: "RI", district: null, photo: null,
    serviceStart: "January 1997", reElection: "November 2026",
    committees: ["Armed Services", "Appropriations", "Banking"],
    activityScore: 28,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 28 },
      { topic: "Armed forces and national security", score: 94 },
      { topic: "Defense spending", score: 88 },
      { topic: "Military procurement, research, weapons development", score: 80 },
    ],
    keyPositions: ["Former Chairman, SASC"],
    recentActions: [
      { date: "2026-03-28", action: "Co-authored NDAA amendment on submarine fleet expansion", type: "bill" },
    ],
    staffContacts: [{ name: "Neil Campbell", role: "Chief of Staff", focus: "Defense" }],
    engagementHistory: [],
  },
  {
    id: "sen_susan_collins", name: "Susan Collins", title: "Senator", chamber: "Senate",
    party: "R", state: "ME", district: null, photo: null,
    serviceStart: "January 1997", reElection: "November 2026",
    committees: ["Appropriations", "Intelligence", "Health, Education, Labor & Pensions"],
    activityScore: 26,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 26 },
      { topic: "Appropriations", score: 90 },
      { topic: "Defense spending", score: 78 },
      { topic: "Health care coverage and access", score: 65 },
    ],
    keyPositions: ["Vice Chair, Appropriations Committee"],
    recentActions: [
      { date: "2026-04-01", action: "Introduced bipartisan defense manufacturing amendment", type: "bill" },
    ],
    staffContacts: [{ name: "Steve Abbott", role: "Chief of Staff", focus: "All Legislative" }],
    engagementHistory: [],
  },
  {
    id: "rep_adam_smith", name: "Adam Smith", title: "Representative", chamber: "House",
    party: "D", state: "WA", district: "09", photo: null,
    serviceStart: "January 1997", reElection: "November 2026",
    committees: ["Armed Services"],
    activityScore: 25,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 25 },
      { topic: "Armed forces and national security", score: 92 },
      { topic: "Defense spending", score: 86 },
      { topic: "Cybersecurity and infrastructure protection", score: 72 },
    ],
    keyPositions: ["Ranking Member, House Armed Services Committee"],
    recentActions: [
      { date: "2026-03-27", action: "HASC hearing on AI-enabled defense systems", type: "hearing" },
    ],
    staffContacts: [{ name: "Shana Chandler", role: "Staff Director", focus: "HASC" }],
    engagementHistory: [],
  },
  {
    id: "sen_patty_murray", name: "Patty Murray", title: "Senator", chamber: "Senate",
    party: "D", state: "WA", district: null, photo: null,
    serviceStart: "January 1993", reElection: "November 2028",
    committees: ["Appropriations"],
    activityScore: 24,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 24 },
      { topic: "Appropriations", score: 96 },
      { topic: "Defense spending", score: 82 },
      { topic: "Health care coverage and access", score: 75 },
    ],
    keyPositions: ["President Pro Tempore", "Chair, Appropriations Committee"],
    recentActions: [
      { date: "2026-04-03", action: "FY2027 appropriations markup schedule released", type: "markup" },
    ],
    staffContacts: [{ name: "Mike Spahn", role: "Chief of Staff", focus: "All Legislative" }],
    engagementHistory: [],
  },
  {
    id: "sen_mark_warner", name: "Mark Warner", title: "Senator", chamber: "Senate",
    party: "D", state: "VA", district: null, photo: null,
    serviceStart: "January 2009", reElection: "November 2026",
    committees: ["Intelligence", "Banking", "Finance", "Budget"],
    activityScore: 23,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 23 },
      { topic: "Artificial intelligence", score: 88 },
      { topic: "Cybersecurity and infrastructure protection", score: 82 },
      { topic: "Telecommunications", score: 70 },
    ],
    keyPositions: ["Chairman, Senate Intelligence Committee"],
    recentActions: [
      { date: "2026-04-04", action: "Introduced AI Safety and Innovation Act", type: "bill" },
    ],
    staffContacts: [{ name: "Luke Albee", role: "Chief of Staff", focus: "Technology" }],
    engagementHistory: [],
  },
  {
    id: "rep_ken_calvert", name: "Ken Calvert", title: "Representative", chamber: "House",
    party: "R", state: "CA", district: "41", photo: null,
    serviceStart: "January 1993", reElection: "November 2026",
    committees: ["Appropriations"],
    activityScore: 22,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 22 },
      { topic: "Defense spending", score: 94 },
      { topic: "Appropriations", score: 90 },
      { topic: "Military procurement, research, weapons development", score: 78 },
    ],
    keyPositions: ["Chairman, Defense Appropriations Subcommittee"],
    recentActions: [
      { date: "2026-03-30", action: "Defense subcommittee hearing on FY2027 budget request", type: "hearing" },
    ],
    staffContacts: [{ name: "Dave Heywood", role: "Chief of Staff", focus: "Appropriations" }],
    engagementHistory: [],
  },
  {
    id: "rep_betty_mccollum", name: "Betty McCollum", title: "Representative", chamber: "House",
    party: "D", state: "MN", district: "04", photo: null,
    serviceStart: "January 2001", reElection: "November 2026",
    committees: ["Appropriations"],
    activityScore: 21,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 21 },
      { topic: "Defense spending", score: 90 },
      { topic: "Appropriations", score: 88 },
    ],
    keyPositions: ["Ranking Member, Defense Appropriations Subcommittee"],
    recentActions: [],
    staffContacts: [{ name: "Bill Harper", role: "Chief of Staff", focus: "Appropriations" }],
    engagementHistory: [],
  },
  {
    id: "sen_ted_cruz", name: "Ted Cruz", title: "Senator", chamber: "Senate",
    party: "R", state: "TX", district: null, photo: null,
    serviceStart: "January 2013", reElection: "November 2030",
    committees: ["Commerce, Science & Transportation", "Judiciary", "Foreign Relations"],
    activityScore: 20,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 20 },
      { topic: "Space flight and exploration", score: 88 },
      { topic: "Telecommunications", score: 72 },
      { topic: "Foreign affairs", score: 65 },
    ],
    keyPositions: ["Chairman, Commerce Committee"],
    recentActions: [
      { date: "2026-03-20", action: "Hearing on commercial space launch regulation", type: "hearing" },
    ],
    staffContacts: [{ name: "Steve Chartan", role: "Chief of Staff", focus: "All Legislative" }],
    engagementHistory: [],
  },
  {
    id: "sen_john_cornyn", name: "John Cornyn", title: "Senator", chamber: "Senate",
    party: "R", state: "TX", district: null, photo: null,
    serviceStart: "December 2002", reElection: "November 2026",
    committees: ["Finance", "Intelligence", "Judiciary"],
    activityScore: 19,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 19 },
      { topic: "Intelligence activities, surveillance, classified information", score: 80 },
      { topic: "Semiconductor manufacturing", score: 75 },
      { topic: "Tax policy", score: 68 },
    ],
    keyPositions: ["Senate Majority Whip"],
    recentActions: [],
    staffContacts: [{ name: "Beth Jafari", role: "Chief of Staff", focus: "All Legislative" }],
    engagementHistory: [],
  },
  {
    id: "rep_rob_wittman", name: "Rob Wittman", title: "Representative", chamber: "House",
    party: "R", state: "VA", district: "01", photo: null,
    serviceStart: "December 2007", reElection: "November 2026",
    committees: ["Armed Services", "Natural Resources"],
    activityScore: 18,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 18 },
      { topic: "Armed forces and national security", score: 90 },
      { topic: "Defense spending", score: 85 },
      { topic: "Hypersonic weapons", score: 70 },
    ],
    keyPositions: ["Vice Chairman, HASC"],
    recentActions: [],
    staffContacts: [{ name: "Brent Rockwood", role: "Legislative Director", focus: "Defense" }],
    engagementHistory: [],
  },
  {
    id: "rep_joe_courtney", name: "Joe Courtney", title: "Representative", chamber: "House",
    party: "D", state: "CT", district: "02", photo: null,
    serviceStart: "January 2007", reElection: "November 2026",
    committees: ["Armed Services", "Education & Workforce"],
    activityScore: 17,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 17 },
      { topic: "Armed forces and national security", score: 88 },
      { topic: "Defense spending", score: 82 },
    ],
    keyPositions: ["Ranking Member, Seapower Subcommittee"],
    recentActions: [],
    staffContacts: [{ name: "Neil McKiernan", role: "Chief of Staff", focus: "Defense" }],
    engagementHistory: [],
  },
  {
    id: "sen_lisa_murkowski", name: "Lisa Murkowski", title: "Senator", chamber: "Senate",
    party: "R", state: "AK", district: null, photo: null,
    serviceStart: "December 2002", reElection: "November 2028",
    committees: ["Appropriations", "Energy & Natural Resources", "Indian Affairs"],
    activityScore: 16,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 16 },
      { topic: "Department of Energy", score: 90 },
      { topic: "Rare earth minerals", score: 82 },
      { topic: "Environmental protection", score: 68 },
    ],
    keyPositions: ["Chair, Energy & Natural Resources Committee"],
    recentActions: [],
    staffContacts: [{ name: "Garrett Boyle", role: "Chief of Staff", focus: "Energy" }],
    engagementHistory: [],
  },
  {
    id: "sen_jon_tester", name: "Tim Sheehy", title: "Senator", chamber: "Senate",
    party: "R", state: "MT", district: null, photo: null,
    serviceStart: "January 2025", reElection: "November 2030",
    committees: ["Armed Services", "Commerce, Science & Transportation"],
    activityScore: 15,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 15 },
      { topic: "Armed forces and national security", score: 72 },
      { topic: "Defense spending", score: 68 },
      { topic: "Unmanned aerial vehicles (drones)", score: 55 },
    ],
    keyPositions: ["Member, SASC"],
    recentActions: [],
    staffContacts: [{ name: "TBD", role: "Chief of Staff", focus: "Defense" }],
    engagementHistory: [],
  },
  {
    id: "rep_mike_turner", name: "Mike Turner", title: "Representative", chamber: "House",
    party: "R", state: "OH", district: "10", photo: null,
    serviceStart: "January 2003", reElection: "November 2026",
    committees: ["Armed Services", "Intelligence"],
    activityScore: 14,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 14 },
      { topic: "Intelligence activities, surveillance, classified information", score: 92 },
      { topic: "Nuclear weapons", score: 85 },
      { topic: "Armed forces and national security", score: 80 },
    ],
    keyPositions: ["Chairman, House Intelligence Committee"],
    recentActions: [],
    staffContacts: [{ name: "Adam Howard", role: "Chief of Staff", focus: "Intel & Defense" }],
    engagementHistory: [],
  },
  {
    id: "sen_joni_ernst", name: "Joni Ernst", title: "Senator", chamber: "Senate",
    party: "R", state: "IA", district: null, photo: null,
    serviceStart: "January 2015", reElection: "November 2026",
    committees: ["Armed Services", "Agriculture", "Small Business"],
    activityScore: 13,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 13 },
      { topic: "Armed forces and national security", score: 82 },
      { topic: "Defense spending", score: 76 },
      { topic: "Small business", score: 60 },
    ],
    keyPositions: ["Member, SASC"],
    recentActions: [],
    staffContacts: [{ name: "Lisa Grafstein", role: "Chief of Staff", focus: "All Legislative" }],
    engagementHistory: [],
  },
  {
    id: "rep_elise_stefanik", name: "Elise Stefanik", title: "Representative", chamber: "House",
    party: "R", state: "NY", district: "21", photo: null,
    serviceStart: "January 2015", reElection: "November 2026",
    committees: ["Armed Services", "Education & Workforce"],
    activityScore: 12,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 12 },
      { topic: "Armed forces and national security", score: 78 },
      { topic: "Defense spending", score: 72 },
    ],
    keyPositions: ["House Republican Conference Chair"],
    recentActions: [],
    staffContacts: [{ name: "Alex DeGrasse", role: "Chief of Staff", focus: "Defense" }],
    engagementHistory: [],
  },
  {
    id: "sen_shelley_capito", name: "Shelley Moore Capito", title: "Senator", chamber: "Senate",
    party: "R", state: "WV", district: null, photo: null,
    serviceStart: "January 2015", reElection: "November 2026",
    committees: ["Appropriations", "Environment & Public Works", "Commerce"],
    activityScore: 11,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 11 },
      { topic: "Transportation and infrastructure", score: 85 },
      { topic: "Environmental protection", score: 72 },
      { topic: "Appropriations", score: 68 },
    ],
    keyPositions: ["Chair, Environment & Public Works Committee"],
    recentActions: [],
    staffContacts: [{ name: "Joel Brubaker", role: "Chief of Staff", focus: "Infrastructure" }],
    engagementHistory: [],
  },
  {
    id: "rep_john_garamendi", name: "John Garamendi", title: "Representative", chamber: "House",
    party: "D", state: "CA", district: "08", photo: null,
    serviceStart: "November 2009", reElection: "November 2026",
    committees: ["Armed Services", "Transportation & Infrastructure"],
    activityScore: 10,
    relatedTopics: [
      { topic: "Public participation and lobbying", score: 10 },
      { topic: "Armed forces and national security", score: 80 },
      { topic: "Defense spending", score: 74 },
      { topic: "Transportation and infrastructure", score: 68 },
    ],
    keyPositions: ["Ranking Member, Readiness Subcommittee"],
    recentActions: [],
    staffContacts: [{ name: "Jeff Hogan", role: "Chief of Staff", focus: "Defense" }],
    engagementHistory: [],
  },
];

// Add computed fields to all members
MEMBERS.forEach(m => {
  m.scoreHistory = generateScoreHistory(m.activityScore, m.id);
  m.scoreHistory12 = generate12MonthHistory(m.activityScore, m.id);
  m.scoreChange = {
    lastMonth: m.scoreHistory[m.scoreHistory.length - 1].score - m.scoreHistory[m.scoreHistory.length - 2].score,
    last12Months: m.activityScore,
    avg12Months: Math.round(m.scoreHistory12.current.reduce((a, c) => a + c.score, 0) / 12),
  };
});

// Recent searches mock data
export const RECENT_SEARCHES = [
  {
    id: "rs1",
    term: "Public participation and lobbying",
    user: "Justin Ham",
    date: "Apr 10, 2026",
    topMembers: ["sen_gary_peters", "sen_chuck_grassley", "sen_dick_durbin", "rep_mike_rogers", "sen_roger_wicker"],
  },
  {
    id: "rs2",
    term: "Department of Energy",
    user: "Justin Ham",
    date: "Mar 21, 2026",
    topMembers: ["sen_lisa_murkowski", "sen_patty_murray", "sen_mark_warner", "rep_ken_calvert", "sen_shelley_capito"],
  },
  {
    id: "rs3",
    term: "Defense spending",
    user: "Justin Ham",
    date: "Mar 21, 2026",
    topMembers: ["rep_mike_rogers", "sen_roger_wicker", "rep_ken_calvert", "rep_adam_smith", "sen_jack_reed"],
  },
  {
    id: "rs4",
    term: "Cybersecurity and infrastructure protection",
    user: "Sarah Chen",
    date: "Mar 15, 2026",
    topMembers: ["sen_gary_peters", "sen_mark_warner", "rep_mike_turner", "rep_adam_smith"],
  },
  {
    id: "rs5",
    term: "Artificial intelligence",
    user: "Marcus Williams",
    date: "Mar 10, 2026",
    topMembers: ["sen_mark_warner", "sen_gary_peters", "rep_adam_smith", "sen_ted_cruz"],
  },
];

// Helper: get member by ID
export function getMemberById(id) {
  return MEMBERS.find(m => m.id === id) || null;
}

// Helper: search members by topic
export function searchMembersByTopic(topic) {
  if (!topic) return MEMBERS;
  const lower = topic.toLowerCase();
  return MEMBERS
    .filter(m => m.relatedTopics.some(t => t.topic.toLowerCase().includes(lower)))
    .sort((a, b) => {
      const aScore = a.relatedTopics.find(t => t.topic.toLowerCase().includes(lower))?.score || 0;
      const bScore = b.relatedTopics.find(t => t.topic.toLowerCase().includes(lower))?.score || 0;
      return bScore - aScore;
    });
}

// Helper: search by member name
export function searchMembersByName(query) {
  if (!query) return MEMBERS;
  const lower = query.toLowerCase();
  return MEMBERS.filter(m => m.name.toLowerCase().includes(lower));
}

// Helper: get peer ranking for a topic
export function getPeerRanking(topic) {
  const lower = topic.toLowerCase();
  return MEMBERS
    .map(m => ({
      ...m,
      topicScore: m.relatedTopics.find(t => t.topic.toLowerCase().includes(lower))?.score || 0,
    }))
    .filter(m => m.topicScore > 0)
    .sort((a, b) => b.topicScore - a.topicScore);
}

export default MEMBERS;
