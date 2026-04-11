import React, { useState } from "react";
import StakeholderDirectoryPage from "./StakeholderDirectoryPage";
import MemberProfilePage from "./MemberProfilePage";
import PEResearchPage from "./PEResearchPage";
import "../styles/Research.css";

const INTEL_TABS = [
  {
    id: "stakeholders",
    label: "Stakeholder Research",
    sublabel: "Congress (House / Senate)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    id: "pe-research",
    label: "PE Research",
    sublabel: "Program Offices",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>
        <path d="M6 8h.01"/><path d="M10 8h8"/>
        <path d="M6 12h.01"/><path d="M10 12h8"/>
      </svg>
    ),
  },
  {
    id: "budget-analysis",
    label: "Budget Analysis",
    sublabel: "Coming Soon",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    disabled: true,
  },
  {
    id: "data-sources",
    label: "Data Sources",
    sublabel: "SAM.gov, USASpending, FPDS",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    disabled: true,
  },
  {
    id: "pm-directory",
    label: "PM Directory",
    sublabel: "Program Manager Contacts",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        <circle cx="12" cy="10" r="2"/><path d="M15 14a3 3 0 00-6 0"/>
      </svg>
    ),
    disabled: true,
  },
];

export default function IntelligenceHubPage() {
  const [activeTab, setActiveTab] = useState("stakeholders");
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTopic, setActiveTopic] = useState("");

  const handleSelectMember = (memberId, topic) => {
    setSelectedMember(memberId);
    setActiveTopic(topic || "");
  };

  const handleBackToDirectory = () => {
    setSelectedMember(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)", margin: "calc(-1 * var(--sp-6))", width: "calc(100% + 2 * var(--sp-6))", maxWidth: "calc(100% + 2 * var(--sp-6))", boxSizing: "border-box", overflow: "hidden" }}>
      {/* Intelligence Hub Top Bar */}
      <div style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        padding: "0 var(--sp-6)",
        display: "flex",
        alignItems: "center",
        gap: 0,
        flexShrink: 0,
        boxShadow: "var(--shadow)",
        zIndex: 4,
      }}>
        {/* Hub Title */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--sp-2)",
          paddingRight: "var(--sp-6)",
          borderRight: "1px solid var(--border)",
          height: 48,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--signal-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/>
          </svg>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em" }}>
            Intelligence Hub
          </span>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", height: 48, overflow: "hidden" }}>
          {INTEL_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                if (!tab.disabled) {
                  setActiveTab(tab.id);
                  setSelectedMember(null);
                }
              }}
              disabled={tab.disabled}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 20px",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === tab.id ? "2px solid var(--signal-blue)" : "2px solid transparent",
                cursor: tab.disabled ? "not-allowed" : "pointer",
                fontFamily: "var(--font-system)",
                transition: "all 0.15s",
                opacity: tab.disabled ? 0.4 : 1,
                position: "relative",
              }}
            >
              <span style={{ color: activeTab === tab.id ? "var(--signal-blue)" : "var(--text-3)" }}>
                {tab.icon}
              </span>
              <div style={{ textAlign: "left" }}>
                <div style={{
                  fontSize: 12,
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  color: activeTab === tab.id ? "var(--signal-blue)" : "var(--text)",
                  lineHeight: 1.2,
                }}>
                  {tab.label}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-3)", lineHeight: 1.2 }}>
                  {tab.sublabel}
                </div>
              </div>
              {tab.disabled && (
                <span style={{
                  fontSize: 8,
                  padding: "1px 6px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--bg-soft)",
                  color: "var(--text-3)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}>Soon</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="intel-hub-content" style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
        {activeTab === "stakeholders" && !selectedMember && (
          <StakeholderDirectoryPage onSelectMember={handleSelectMember} />
        )}
        {activeTab === "stakeholders" && selectedMember && (
          <MemberProfilePage
            memberId={selectedMember}
            activeTopic={activeTopic}
            onBack={handleBackToDirectory}
          />
        )}
        {activeTab === "pe-research" && (
          <div style={{ height: "100%", overflow: "auto", padding: "var(--sp-6)" }}>
            <PEResearchPage />
          </div>
        )}
        {activeTab === "budget-analysis" && (
          <div style={{ height: "100%", overflow: "auto", padding: "var(--sp-6)" }}>
            <ComingSoon title="Budget Analysis" desc="Automated budget trend analysis with plain-language signals across PE numbers, appropriations accounts, and service branches." />
          </div>
        )}
        {activeTab === "data-sources" && (
          <div style={{ height: "100%", overflow: "auto", padding: "var(--sp-6)" }}>
            <ComingSoon title="Data Sources" desc="Unified access to SAM.gov, USASpending.gov, FPDS, DoD comptroller budget justification books, and congress.gov — all in one place." />
          </div>
        )}
        {activeTab === "pm-directory" && (
          <div style={{ height: "100%", overflow: "auto", padding: "var(--sp-6)" }}>
            <ComingSoon title="PM Directory" desc="Internal directory mapping PE numbers to program manager contacts, built from real engagement data across all Capiro users." />
          </div>
        )}
      </div>
    </div>
  );
}

function ComingSoon({ title, desc }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      height: "60vh", textAlign: "center", maxWidth: 500, margin: "0 auto",
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%", background: "var(--signal-soft)",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--sp-4)",
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--signal-blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/>
        </svg>
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>{title}</h2>
      <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6, marginBottom: "var(--sp-6)" }}>{desc}</p>
      <div style={{
        padding: "8px 16px", borderRadius: "var(--radius-full)", background: "var(--bg-soft)",
        fontSize: 12, color: "var(--text-3)", fontWeight: 500,
      }}>
        Coming in a future release
      </div>
    </div>
  );
}
