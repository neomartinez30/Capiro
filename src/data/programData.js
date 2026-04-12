// ═══════════════════════════════════════════════════════════════
// PE Research for Program Offices — Mock Data
// Program Elements, budget history, program managers, and office intel
// ═══════════════════════════════════════════════════════════════

export const PROGRAM_ELEMENTS = [
  {
    id: "pe_0604856F", peNumber: "0604856F", name: "Operationally Responsive Space",
    service: "Air Force", account: "RDT&E, Air Force",
    appropriation: "3600 — Research, Development, Test & Evaluation, Air Force",
    status: "active", classification: "Unclassified",
    description: "Development and demonstration of responsive space capabilities including rapid satellite deployment, modular spacecraft, and launch-on-demand systems for national security space missions.",
    budgetHistory: [
      { fy: "FY2023", requested: 312.4, enacted: 345.8, delta: 33.4 },
      { fy: "FY2024", requested: 358.1, enacted: 372.0, delta: 13.9 },
      { fy: "FY2025", requested: 390.5, enacted: 415.2, delta: 24.7 },
      { fy: "FY2026", requested: 428.0, enacted: null, delta: null },
      { fy: "FY2027", requested: 465.3, enacted: null, delta: null },
    ],
    signal: "healthy_growth",
    signalLabel: "Healthy — Consistent above-request enactments suggest strong congressional support. Plus-up opportunity realistic.",
    programManager: { name: "Col. Rebecca Torres", office: "Space Rapid Capabilities Office", phone: "(719) 556-XXXX", lastContact: "2026-02-15" },
    relatedPEs: ["pe_0604857F", "pe_0305913F"],
    keywords: ["space", "launch", "satellite", "rapid response", "national security space"],
    committees: ["SASC — Strategic Forces", "HASC — Strategic Forces", "SAC-D", "HAC-D"],
  },
  {
    id: "pe_0603851A", peNumber: "0603851A", name: "Directed Energy — Advanced Development",
    service: "Army", account: "RDT&E, Army",
    appropriation: "2040 — Research, Development, Test & Evaluation, Army",
    status: "active", classification: "Unclassified",
    description: "Advanced development of high-energy laser (HEL) and high-power microwave (HPM) weapons for ground-based air defense, counter-UAS, and force protection applications.",
    budgetHistory: [
      { fy: "FY2023", requested: 189.2, enacted: 215.6, delta: 26.4 },
      { fy: "FY2024", requested: 234.8, enacted: 256.1, delta: 21.3 },
      { fy: "FY2025", requested: 278.3, enacted: 310.5, delta: 32.2 },
      { fy: "FY2026", requested: 325.0, enacted: null, delta: null },
      { fy: "FY2027", requested: 368.7, enacted: null, delta: null },
    ],
    signal: "strong_growth",
    signalLabel: "Strong Growth — Consistent plus-ups and rising baseline indicate high priority. Excellent plus-up opportunity.",
    programManager: { name: "BG James Morton", office: "Rapid Capabilities & Critical Technologies Office", phone: "(256) 842-XXXX", lastContact: "2026-03-08" },
    relatedPEs: ["pe_0604851A", "pe_0604858F"],
    keywords: ["directed energy", "laser", "HEL", "microwave", "HPM", "counter-UAS", "C-UAS"],
    committees: ["SASC — Emerging Threats", "HASC — Tactical Air & Land Forces", "SAC-D", "HAC-D"],
  },
  {
    id: "pe_0604201N", peNumber: "0604201N", name: "Submarine Combat Systems — Advanced Development",
    service: "Navy", account: "RDT&E, Navy",
    appropriation: "1319 — Research, Development, Test & Evaluation, Navy",
    status: "active", classification: "Unclassified/FOUO",
    description: "Advanced development of submarine combat system hardware and software including sonar processing, torpedo fire control, and integrated warfare systems for Virginia-class and Columbia-class submarines.",
    budgetHistory: [
      { fy: "FY2023", requested: 456.7, enacted: 478.2, delta: 21.5 },
      { fy: "FY2024", requested: 489.3, enacted: 502.8, delta: 13.5 },
      { fy: "FY2025", requested: 512.0, enacted: 498.6, delta: -13.4 },
      { fy: "FY2026", requested: 534.1, enacted: null, delta: null },
      { fy: "FY2027", requested: 558.9, enacted: null, delta: null },
    ],
    signal: "mixed",
    signalLabel: "Mixed — FY2025 below-request enactment may signal concern. Approach with targeted justification.",
    programManager: { name: "CAPT Michael Chen", office: "PEO Submarines (PMS 425)", phone: "(202) 781-XXXX", lastContact: "2025-12-02" },
    relatedPEs: ["pe_0604562N", "pe_0207161N"],
    keywords: ["submarine", "combat system", "sonar", "torpedo", "Virginia-class", "Columbia-class"],
    committees: ["SASC — Seapower", "HASC — Seapower", "SAC-D", "HAC-D"],
  },
  {
    id: "pe_0603461E", peNumber: "0603461E", name: "Hypersonic Defense — Advanced Technology",
    service: "DARPA", account: "RDT&E, Defense-Wide",
    appropriation: "0400 — Research, Development, Test & Evaluation, Defense-Wide",
    status: "active", classification: "Unclassified",
    description: "Advanced technology development for hypersonic weapon systems including boost-glide vehicles, air-breathing hypersonic missiles, and associated thermal protection and guidance technologies.",
    budgetHistory: [
      { fy: "FY2023", requested: 876.4, enacted: 912.0, delta: 35.6 },
      { fy: "FY2024", requested: 945.2, enacted: 988.7, delta: 43.5 },
      { fy: "FY2025", requested: 1024.0, enacted: 1089.3, delta: 65.3 },
      { fy: "FY2026", requested: 1102.5, enacted: null, delta: null },
      { fy: "FY2027", requested: 1185.0, enacted: null, delta: null },
    ],
    signal: "top_priority",
    signalLabel: "Top Priority — Large and growing plus-ups across all years. Congress views this as critical. Strong plus-up candidate.",
    programManager: { name: "Dr. Michael White", office: "OUSD(R&E) — Hypersonics", phone: "(703) 571-XXXX", lastContact: "2026-01-20" },
    relatedPEs: ["pe_0604500A", "pe_0604501N", "pe_0604502F"],
    keywords: ["hypersonic", "boost-glide", "ARRW", "LRHW", "scramjet", "thermal protection"],
    committees: ["SASC — Strategic Forces", "HASC — Strategic Forces", "SAC-D", "HAC-D"],
  },
  {
    id: "pe_0604117F", peNumber: "0604117F", name: "Next Generation Air Dominance (NGAD)",
    service: "Air Force", account: "RDT&E, Air Force",
    appropriation: "3600 — Research, Development, Test & Evaluation, Air Force",
    status: "active", classification: "Unclassified/Classified elements",
    description: "Development of next-generation air dominance family of systems including crewed and uncrewed platforms, advanced sensors, and networked combat capabilities.",
    budgetHistory: [
      { fy: "FY2023", requested: 1567.0, enacted: 1612.4, delta: 45.4 },
      { fy: "FY2024", requested: 1834.2, enacted: 1798.0, delta: -36.2 },
      { fy: "FY2025", requested: 2105.0, enacted: 2045.8, delta: -59.2 },
      { fy: "FY2026", requested: 1450.0, enacted: null, delta: null },
      { fy: "FY2027", requested: 1280.0, enacted: null, delta: null },
    ],
    signal: "declining",
    signalLabel: "Declining — Below-request marks in FY24-25 and declining budget request suggest program restructuring. Caution advised.",
    programManager: { name: "Brig Gen Dale White (ret.)", office: "PEO Fighters & Advanced Aircraft", phone: "(937) 255-XXXX", lastContact: "2025-09-15" },
    relatedPEs: ["pe_0604800F", "pe_0207133F"],
    keywords: ["NGAD", "6th gen fighter", "CCA", "collaborative combat aircraft", "air dominance"],
    committees: ["SASC — Airland", "HASC — Tactical Air & Land Forces", "SAC-D", "HAC-D"],
  },
  {
    id: "pe_0603832A", peNumber: "0603832A", name: "Autonomous Systems — Advanced Development",
    service: "Army", account: "RDT&E, Army",
    appropriation: "2040 — Research, Development, Test & Evaluation, Army",
    status: "active", classification: "Unclassified",
    description: "Development and integration of autonomous and semi-autonomous ground and aerial platforms including robotic combat vehicles, autonomous logistics, and human-machine teaming technologies.",
    budgetHistory: [
      { fy: "FY2023", requested: 145.6, enacted: 178.2, delta: 32.6 },
      { fy: "FY2024", requested: 198.4, enacted: 232.5, delta: 34.1 },
      { fy: "FY2025", requested: 265.0, enacted: 298.8, delta: 33.8 },
      { fy: "FY2026", requested: 315.2, enacted: null, delta: null },
      { fy: "FY2027", requested: 372.0, enacted: null, delta: null },
    ],
    signal: "strong_growth",
    signalLabel: "Strong Growth — Consistent ~$33M plus-ups signal strong bipartisan support. Excellent candidate for additional plus-up.",
    programManager: { name: "Col. Sarah Phillips", office: "Combat Capabilities Development Command (DEVCOM)", phone: "(410) 278-XXXX", lastContact: "2026-03-22" },
    relatedPEs: ["pe_0604832A", "pe_0603005A"],
    keywords: ["autonomous", "robotic", "UGV", "RCV", "human-machine teaming", "logistics"],
    committees: ["SASC — Emerging Threats", "HASC — Tactical Air & Land Forces", "SAC-D", "HAC-D"],
  },
  {
    id: "pe_0305913F", peNumber: "0305913F", name: "Space Situational Awareness — Operations",
    service: "Space Force", account: "RDT&E, Space Force",
    appropriation: "3620 — Research, Development, Test & Evaluation, Space Force",
    status: "active", classification: "Unclassified",
    description: "Development and sustainment of space domain awareness sensors, command and control systems, and data fusion capabilities for tracking objects in the space environment.",
    budgetHistory: [
      { fy: "FY2023", requested: 223.1, enacted: 245.8, delta: 22.7 },
      { fy: "FY2024", requested: 256.4, enacted: 268.2, delta: 11.8 },
      { fy: "FY2025", requested: 289.0, enacted: 302.5, delta: 13.5 },
      { fy: "FY2026", requested: 318.6, enacted: null, delta: null },
      { fy: "FY2027", requested: 345.2, enacted: null, delta: null },
    ],
    signal: "healthy_growth",
    signalLabel: "Healthy — Steady growth with moderate plus-ups. Well-supported program element.",
    programManager: { name: "Col. David Park", office: "Space Systems Command — SSA Division", phone: "(310) 653-XXXX", lastContact: "2026-02-28" },
    relatedPEs: ["pe_0604856F", "pe_0304260F"],
    keywords: ["SDA", "space domain awareness", "space tracking", "orbital debris", "SSA"],
    committees: ["SASC — Strategic Forces", "HASC — Strategic Forces", "SAC-D", "HAC-D"],
  },
  {
    id: "pe_0604384BP", peNumber: "0604384BP", name: "Quantum Computing — Applied Research",
    service: "Defense-Wide", account: "RDT&E, Defense-Wide",
    appropriation: "0400 — Research, Development, Test & Evaluation, Defense-Wide",
    status: "active", classification: "Unclassified",
    description: "Applied research in quantum information science including quantum computing hardware, algorithms for defense applications, quantum networking, and post-quantum cryptography.",
    budgetHistory: [
      { fy: "FY2023", requested: 98.5, enacted: 132.0, delta: 33.5 },
      { fy: "FY2024", requested: 145.2, enacted: 178.6, delta: 33.4 },
      { fy: "FY2025", requested: 189.0, enacted: 224.3, delta: 35.3 },
      { fy: "FY2026", requested: 235.0, enacted: null, delta: null },
      { fy: "FY2027", requested: 278.4, enacted: null, delta: null },
    ],
    signal: "strong_growth",
    signalLabel: "Strong Growth — Congress consistently adding ~$33M above request. Strategic technology priority with bipartisan backing.",
    programManager: { name: "Dr. Paul Shortell", office: "OUSD(R&E) — Quantum Science", phone: "(703) 697-XXXX", lastContact: "2026-01-10" },
    relatedPEs: ["pe_0601101E", "pe_0602716E"],
    keywords: ["quantum", "computing", "QIS", "post-quantum", "cryptography", "quantum networking"],
    committees: ["SASC — Emerging Threats", "HASC — Cyber & IT", "SAC-D", "HAC-D"],
  },
];

// Signal color mapping
export const SIGNAL_COLORS = {
  top_priority: { bg: "#ECFDF5", text: "#059669", label: "Top Priority" },
  strong_growth: { bg: "#EFF6FF", text: "#2563EB", label: "Strong Growth" },
  healthy_growth: { bg: "#F0FDF4", text: "#16A34A", label: "Healthy" },
  mixed: { bg: "#FFFBEB", text: "#D97706", label: "Mixed Signals" },
  declining: { bg: "#FEF2F2", text: "#DC2626", label: "Declining" },
  underfunded: { bg: "#FEF2F2", text: "#DC2626", label: "Underfunded" },
};

// Helper: search PEs
export function searchProgramElements(query) {
  if (!query) return PROGRAM_ELEMENTS;
  const lower = query.toLowerCase();
  return PROGRAM_ELEMENTS.filter(pe =>
    pe.peNumber.toLowerCase().includes(lower) ||
    pe.name.toLowerCase().includes(lower) ||
    pe.keywords.some(k => k.toLowerCase().includes(lower)) ||
    pe.service.toLowerCase().includes(lower)
  );
}

// Helper: get PE by ID
export function getPEById(id) {
  return PROGRAM_ELEMENTS.find(pe => pe.id === id) || null;
}

export default PROGRAM_ELEMENTS;
