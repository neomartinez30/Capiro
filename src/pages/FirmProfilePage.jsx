import React, { useState, useMemo } from "react";
import { useFirmData } from "../hooks/useFirmData";
import "../styles/FirmProfile.css";

/* ── GenAI Firm Bio Modal ── */
function GenAIFirmBioModal({ firm, lobbyists, clients, onClose, onApply }) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState("");
  const [tone, setTone] = useState("professional");

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const activeCount = clients.filter(c => c.status === "active").length;
      const industries = [...new Set(clients.map(c => c.industry))];
      const coveredPositions = lobbyists.filter(l => l.coveredPosition).map(l => l.coveredPosition);
      const revenue = firm.totalRevenue ? `$${(firm.totalRevenue / 1000000).toFixed(1)}M` : "undisclosed";

      const bios = {
        professional: `${firm.name} is a registered lobbying firm based in Washington, D.C., specializing in ${industries.slice(0, 3).join(", ").toLowerCase()} policy advocacy. With ${activeCount} active clients and ${revenue} in annual lobbying revenue, the firm provides comprehensive government affairs services including legislative strategy, regulatory advocacy, and coalition building.\n\nThe team of ${lobbyists.length} registered lobbyists${coveredPositions.length > 0 ? `, including former congressional staff (${coveredPositions.slice(0, 2).join("; ")})` : ""}, brings deep institutional knowledge of the federal legislative process. Registered under the Lobbying Disclosure Act (LDA ID: ${firm.ldaRegistrationId}), ${firm.name} files quarterly LD-2 disclosure reports for all client engagements.`,

        concise: `${firm.name} — Washington, D.C. government affairs firm. ${activeCount} active clients across ${industries.join(", ").toLowerCase()}. ${lobbyists.length} registered lobbyists. LDA Registration: ${firm.ldaRegistrationId}. Annual revenue: ${revenue}.`,

        detailed: `${firm.name} is a ${firm.totalRevenue > 10000000 ? "major" : firm.totalRevenue > 5000000 ? "leading" : "growing"} government affairs firm headquartered at ${firm.address}. Founded and registered under the Lobbying Disclosure Act since ${firm.registrationDate?.split("-")[0] || "inception"} (Registration ID: ${firm.ldaRegistrationId}), the firm has established itself as a trusted advocate for clients across ${industries.join(", ").toLowerCase()} sectors.\n\n**Client Portfolio:** The firm currently represents ${activeCount} active clients generating ${revenue} in annual lobbying revenue. Key industries served include ${industries.slice(0, 3).join(", ")}.\n\n**Team:** ${firm.name} employs ${lobbyists.length} registered lobbyists, ${coveredPositions.length > 0 ? `${coveredPositions.length} of whom hold covered positions from prior government service: ${coveredPositions.join("; ")}` : "bringing diverse policy expertise to client engagements"}.\n\n**Compliance:** All lobbying activities are disclosed in quarterly LD-2 filings with the Secretary of the Senate and Clerk of the House. The firm maintains strict compliance with all LDA requirements including LD-203 contribution reports.`
      };
      setGenerated(bios[tone]);
      setGenerating(false);
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="genai-modal" onClick={e => e.stopPropagation()}>
        <div className="genai-modal__header">
          <div>
            <h3>Write Firm Bio with AI</h3>
            <p className="genai-modal__sub">Auto-generated from LDA registry + client data</p>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="genai-modal__context">
          <div className="context-chip">LDA ID: {firm.ldaRegistrationId}</div>
          <div className="context-chip">{clients.length} clients</div>
          <div className="context-chip">{lobbyists.length} lobbyists</div>
          <div className="context-chip">Since {firm.registrationDate?.split("-")[0]}</div>
        </div>

        <div className="genai-modal__controls">
          <label>Tone</label>
          <div className="tone-options">
            {["professional", "concise", "detailed"].map(t => (
              <button key={t} className={`tone-btn${tone === t ? " tone-btn--active" : ""}`} onClick={() => setTone(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <button className="genai-btn" onClick={generate} disabled={generating}>
            {generating ? (
              <><span className="spinner" /> Generating...</>
            ) : (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Generate Bio</>
            )}
          </button>
        </div>

        {generated && (
          <div className="genai-modal__result">
            <label>Generated Bio</label>
            <textarea value={generated} onChange={e => setGenerated(e.target.value)} rows={8} />
            <div className="genai-modal__actions">
              <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(generated)}>Copy</button>
              <button className="btn-primary" onClick={() => { onApply(generated); onClose(); }}>Apply to Profile</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Firm Profile Page ── */
export default function FirmProfilePage() {
  const { firm, lobbyists, clients, topics, submissions, filingPeriods, kpis } = useFirmData();
  const [firmBio, setFirmBio] = useState(firm?.description || "");
  const [showGenAI, setShowGenAI] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const industries = useMemo(() => {
    const counts = {};
    clients.forEach(c => { counts[c.industry] = (counts[c.industry] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [clients]);

  const revenue = firm?.totalRevenue ? `$${(firm.totalRevenue / 1000000).toFixed(1)}M` : "—";
  const coveredCount = lobbyists.filter(l => l.coveredPosition).length;

  if (!firm) return <div className="firm-profile"><p>No firm data available.</p></div>;

  const INDUSTRY_COLORS = {
    "Defense & Aerospace": "#EF4444", "Healthcare Technology": "#3B82F6",
    "Clean Energy": "#10B981", "Technology": "#8B5CF6", "Agriculture & Food": "#F59E0B",
  };

  return (
    <div className="firm-profile">
      {/* Hero Section */}
      <div className="firm-hero">
        <div className="firm-hero__content">
          <div className="firm-logo">{firm.name.split(" ").map(w => w[0]).join("").slice(0, 3)}</div>
          <div className="firm-hero__info">
            <h1>{firm.name}</h1>
            <p className="firm-meta">{firm.address}</p>
            <div className="firm-hero__badges">
              <span className="lda-badge">LDA: {firm.ldaRegistrationId}</span>
              <span className="lda-badge">Since {firm.registrationDate?.split("-")[0]}</span>
              <a href={firm.website} target="_blank" rel="noopener noreferrer" className="firm-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                {firm.website?.replace("https://", "")}
              </a>
            </div>
          </div>
        </div>
        <div className="firm-hero__stats">
          <div className="stat-box">
            <span className="stat-box__value">{kpis.activeClients}</span>
            <span className="stat-box__label">Active Clients</span>
          </div>
          <div className="stat-box">
            <span className="stat-box__value">{lobbyists.length}</span>
            <span className="stat-box__label">Lobbyists</span>
          </div>
          <div className="stat-box">
            <span className="stat-box__value">{revenue}</span>
            <span className="stat-box__label">Annual Revenue</span>
          </div>
          <div className="stat-box">
            <span className="stat-box__value">{coveredCount}</span>
            <span className="stat-box__label">Covered Positions</span>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="section-tabs">
        {["overview", "team", "clients", "filings"].map(sec => (
          <button key={sec} className={`section-tab${activeSection === sec ? " section-tab--active" : ""}`} onClick={() => setActiveSection(sec)}>
            {sec.charAt(0).toUpperCase() + sec.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === "overview" && (
        <div className="firm-section">
          {/* Bio / Summary with GenAI */}
          <div className="firm-card">
            <div className="section-header-row">
              <h3>Firm Bio / Summary</h3>
              <button className="genai-trigger" onClick={() => setShowGenAI(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Write with AI
              </button>
            </div>
            {firmBio ? (
              <p className="bio-text">{firmBio}</p>
            ) : (
              <div className="bio-empty">
                <p>No firm bio yet. Generate one using your LDA registration data and client portfolio.</p>
                <button className="genai-trigger" onClick={() => setShowGenAI(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  Generate with AI using LDA data
                </button>
              </div>
            )}
          </div>

          {/* Contact & Registration */}
          <div className="firm-card-grid">
            <div className="firm-card">
              <h3>Contact Information</h3>
              <div className="info-grid">
                <div className="info-item"><label>Primary Contact</label><span>{firm.contactName}</span></div>
                <div className="info-item"><label>Phone</label><span>{firm.phone}</span></div>
                <div className="info-item"><label>Address</label><span>{firm.address}</span></div>
                <div className="info-item"><label>Website</label><span>{firm.website}</span></div>
              </div>
            </div>
            <div className="firm-card">
              <h3>LDA Registration</h3>
              <div className="info-grid">
                <div className="info-item"><label>Registration ID</label><span className="mono">{firm.ldaRegistrationId}</span></div>
                <div className="info-item"><label>Registration Date</label><span>{firm.registrationDate}</span></div>
                <div className="info-item"><label>Country / State</label><span>{firm.country} / {firm.state}</span></div>
                <div className="info-item"><label>Filing Status</label><span className="status-badge status-badge--active">Current</span></div>
              </div>
            </div>
          </div>

          {/* Industry Breakdown */}
          <div className="firm-card">
            <h3>Client Industries</h3>
            <div className="industry-bars">
              {industries.map(([industry, count]) => (
                <div key={industry} className="industry-bar">
                  <div className="industry-bar__label">
                    <span style={{ color: INDUSTRY_COLORS[industry] || "#6B7280" }}>{industry}</span>
                    <span>{count} client{count > 1 ? "s" : ""}</span>
                  </div>
                  <div className="industry-bar__track">
                    <div className="industry-bar__fill" style={{
                      width: `${(count / clients.length) * 100}%`,
                      background: INDUSTRY_COLORS[industry] || "#6B7280"
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Section */}
      {activeSection === "team" && (
        <div className="firm-section">
          <div className="team-grid">
            {lobbyists.map(lob => {
              const initials = lob.name.split(" ").map(n => n[0]).join("");
              return (
                <div key={lob.id} className="team-card">
                  <div className="team-card__header">
                    <div className="lobbyist-avatar">{initials}</div>
                    <span className={`status-dot status-dot--${lob.status}`} />
                  </div>
                  <h4>{lob.name}</h4>
                  {lob.coveredPosition && <p className="team-card__position">{lob.coveredPosition}</p>}
                  <p className="team-card__email">{lob.email}</p>
                  <div className="team-card__tags">
                    {lob.issueAreas.map(a => <span key={a} className="tag tag--xs">{a}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Clients Section */}
      {activeSection === "clients" && (
        <div className="firm-section">
          <div className="clients-table">
            <div className="table-header">
              <span>Client</span><span>Industry</span><span>Annual Spend</span><span>Topics</span><span>Status</span>
            </div>
            {clients.map(c => {
              const clientTopics = topics.filter(t => t.clientId === c.id);
              return (
                <div key={c.id} className="table-row">
                  <div className="table-cell" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="client-avatar" style={{ background: INDUSTRY_COLORS[c.industry] || "#6B7280" }}>{c.avatar}</div>
                    <div><strong>{c.name}</strong><br/><span style={{ fontSize: 12, color: "var(--text-3)" }}>{c.description}</span></div>
                  </div>
                  <span className="table-cell">{c.industry}</span>
                  <span className="table-cell">${(c.annualSpend / 1000).toFixed(0)}K</span>
                  <span className="table-cell">{clientTopics.length}</span>
                  <span className="table-cell"><span className={`status-badge status-badge--${c.status}`}>{c.status}</span></span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filings Section */}
      {activeSection === "filings" && (
        <div className="firm-section">
          <div className="filings-list">
            {filingPeriods.map(fp => (
              <div key={fp.id} className={`filing-card filing-card--${fp.status}`}>
                <div className="filing-card__type">{fp.type}</div>
                <h4>{fp.period}</h4>
                <div className="filing-card__meta">
                  <span>Due: {fp.dueDate}</span>
                  {fp.status === "filed" && <span>Filed: {fp.filedDate}</span>}
                  {fp.status === "upcoming" && <span className="days-left">{fp.daysLeft} days left</span>}
                </div>
                <span className={`status-badge status-badge--${fp.status === "filed" ? "approved" : "draft"}`}>
                  {fp.status === "filed" ? "Filed" : "Upcoming"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GenAI Modal */}
      {showGenAI && (
        <GenAIFirmBioModal
          firm={firm}
          lobbyists={lobbyists}
          clients={clients}
          onClose={() => setShowGenAI(false)}
          onApply={setFirmBio}
        />
      )}
    </div>
  );
}
