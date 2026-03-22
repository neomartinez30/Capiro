import React, { useState, useMemo } from "react";
import { useFirmData } from "../hooks/useFirmData";
import "../styles/Lobbyists.css";

/* ── GenAI Bio Writer Modal ── */
function GenAIBioModal({ lobbyist, firm, onClose, onApply }) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState("");
  const [tone, setTone] = useState("professional");

  const generate = () => {
    setGenerating(true);
    // Simulate AI generation using LDA context
    setTimeout(() => {
      const bios = {
        professional: `${lobbyist.name} is a registered lobbyist at ${firm?.name || "the firm"}, specializing in ${lobbyist.issueAreas.join(", ")}. ${lobbyist.coveredPosition ? `Previously serving as ${lobbyist.coveredPosition}, ${lobbyist.name.split(" ")[0]} brings deep institutional knowledge and established relationships on Capitol Hill.` : `With expertise spanning ${lobbyist.issueAreas.slice(0, 2).join(" and ")}, ${lobbyist.name.split(" ")[0]} provides strategic counsel on legislative and regulatory matters.`} As a registered advocate under the Lobbying Disclosure Act, ${lobbyist.name.split(" ")[0]} represents clients before Congress and federal agencies on matters including ${lobbyist.issueAreas.slice(0, 2).join(" and ").toLowerCase()} policy.`,
        concise: `${lobbyist.name} — ${lobbyist.issueAreas.join(", ")} lobbyist at ${firm?.name || "the firm"}. ${lobbyist.coveredPosition ? `Former ${lobbyist.coveredPosition.replace("Former ", "")}.` : ""} LDA-registered advocate representing clients before Congress and federal agencies.`,
        detailed: `${lobbyist.name} serves as a registered lobbyist at ${firm?.name || "the firm"}, one of Washington's ${firm?.totalRevenue > 5000000 ? "leading" : "respected"} government affairs practices. ${lobbyist.coveredPosition ? `Before entering the private sector, ${lobbyist.name.split(" ")[0]} served as ${lobbyist.coveredPosition}, where they developed extensive expertise in legislative strategy and stakeholder engagement.` : `${lobbyist.name.split(" ")[0]} has built a practice focused on ${lobbyist.issueAreas.join(", ").toLowerCase()}, providing clients with strategic advice on navigating the federal legislative process.`}\n\nAreas of expertise include ${lobbyist.issueAreas.map(a => a.toLowerCase()).join(", ")}. ${lobbyist.name.split(" ")[0]} is registered under the Lobbying Disclosure Act (LDA) and files quarterly LD-2 reports disclosing all lobbying activities on behalf of clients. ${firm?.ldaRegistrationId ? `The firm's LDA registration ID is ${firm.ldaRegistrationId}.` : ""}`
      };
      setGenerated(bios[tone]);
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="genai-modal" onClick={e => e.stopPropagation()}>
        <div className="genai-modal__header">
          <div>
            <h3>Write Bio with AI</h3>
            <p className="genai-modal__sub">Generate a professional bio using LDA registry data</p>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="genai-modal__context">
          <div className="context-chip">LDA Registration: {firm?.ldaRegistrationId || "—"}</div>
          <div className="context-chip">Covered Position: {lobbyist.coveredPosition || "None"}</div>
          <div className="context-chip">Issues: {lobbyist.issueAreas.join(", ")}</div>
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
            <textarea value={generated} onChange={e => setGenerated(e.target.value)} rows={6} />
            <div className="genai-modal__actions">
              <button className="btn-secondary" onClick={() => { navigator.clipboard.writeText(generated); }}>Copy</button>
              <button className="btn-primary" onClick={() => { onApply(generated); onClose(); }}>Apply to Profile</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Lobbyist Detail Panel (slide-over) ── */
function LobbyistDetailPanel({ lobbyist, firm, clients, topics, submissions, onClose }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [bio, setBio] = useState(lobbyist.bio || "");
  const [showGenAI, setShowGenAI] = useState(false);

  // Lobbyist's clients (through topics they work on based on issue areas)
  const relevantClients = useMemo(() => {
    return clients.filter(c => {
      const clientTopics = topics.filter(t => t.clientId === c.id);
      return clientTopics.some(t => lobbyist.issueAreas.some(area =>
        t.issueArea.toLowerCase().includes(area.toLowerCase()) ||
        area.toLowerCase().includes(t.issueArea.split(" ")[0].toLowerCase())
      ));
    });
  }, [clients, topics, lobbyist]);

  const relevantSubmissions = useMemo(() => {
    const topicIds = new Set(topics.filter(t =>
      lobbyist.issueAreas.some(area =>
        t.issueArea.toLowerCase().includes(area.toLowerCase()) ||
        area.toLowerCase().includes(t.issueArea.split(" ")[0].toLowerCase())
      )
    ).map(t => t.id));
    return submissions.filter(s => topicIds.has(s.topicId));
  }, [topics, submissions, lobbyist]);

  const STATUS_DOT = { active: "#059669", inactive: "#9CA3AF" };
  const initials = lobbyist.name.split(" ").map(n => n[0]).join("");

  return (
    <>
      <div className="detail-overlay" onClick={onClose} />
      <div className="detail-panel">
        <div className="detail-panel__header">
          <button className="detail-panel__close" onClick={onClose}>&times;</button>
          <div className="lobbyist-profile-header">
            <div className="lobbyist-avatar lobbyist-avatar--lg">{initials}</div>
            <div>
              <h2>{lobbyist.name}</h2>
              <p className="lobbyist-meta">{lobbyist.email}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_DOT[lobbyist.status] }} />
                <span style={{ fontSize: 12, color: "var(--text-2)", textTransform: "capitalize" }}>{lobbyist.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Covered Position Badge */}
        {lobbyist.coveredPosition && (
          <div className="covered-position-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
            {lobbyist.coveredPosition}
          </div>
        )}

        {/* Issue Areas */}
        <div className="detail-section">
          <h4>Issue Areas</h4>
          <div className="tag-list">
            {lobbyist.issueAreas.map(area => (
              <span key={area} className="tag tag--issue">{area}</span>
            ))}
          </div>
        </div>

        {/* Bio / Summary with GenAI */}
        <div className="detail-section">
          <div className="section-header-row">
            <h4>Bio / Summary</h4>
            <button className="genai-trigger" onClick={() => setShowGenAI(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Write with AI
            </button>
          </div>
          {bio ? (
            <p className="bio-text">{bio}</p>
          ) : (
            <div className="bio-empty">
              <p>No bio yet.</p>
              <button className="genai-trigger" onClick={() => setShowGenAI(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Generate with AI using LDA data
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          {["profile", "clients", "submissions"].map(tab => (
            <button key={tab} className={`detail-tab${activeTab === tab ? " detail-tab--active" : ""}`} onClick={() => setActiveTab(tab)}>
              {tab === "profile" ? "Details" : tab === "clients" ? `Clients (${relevantClients.length})` : `Submissions (${relevantSubmissions.length})`}
            </button>
          ))}
        </div>

        <div className="detail-tab-content">
          {activeTab === "profile" && (
            <div className="info-grid">
              <div className="info-item"><label>Firm</label><span>{firm?.name || "—"}</span></div>
              <div className="info-item"><label>Email</label><span>{lobbyist.email}</span></div>
              <div className="info-item"><label>LDA Registration</label><span>{firm?.ldaRegistrationId || "—"}</span></div>
              <div className="info-item"><label>Status</label><span style={{ textTransform: "capitalize" }}>{lobbyist.status}</span></div>
              <div className="info-item"><label>Covered Position</label><span>{lobbyist.coveredPosition || "None reported"}</span></div>
              <div className="info-item"><label>Issue Areas</label><span>{lobbyist.issueAreas.join(", ")}</span></div>
            </div>
          )}

          {activeTab === "clients" && (
            <div className="related-list">
              {relevantClients.length === 0 ? (
                <p className="empty-state">No clients matched by issue area.</p>
              ) : relevantClients.map(c => (
                <div key={c.id} className="related-item">
                  <div className="related-item__avatar">{c.avatar}</div>
                  <div className="related-item__info">
                    <strong>{c.name}</strong>
                    <span>{c.industry} &middot; {c.tags.slice(0, 3).join(", ")}</span>
                  </div>
                  <span className={`status-badge status-badge--${c.status}`}>{c.status}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "submissions" && (
            <div className="related-list">
              {relevantSubmissions.length === 0 ? (
                <p className="empty-state">No submissions in this lobbyist's issue areas.</p>
              ) : relevantSubmissions.map(s => (
                <div key={s.id} className="related-item">
                  <div className="related-item__info" style={{ flex: 1 }}>
                    <strong>{s.title}</strong>
                    <span>{s.type.replace("_", " ")} &middot; v{s.version} &middot; {s.wordCount} words</span>
                  </div>
                  <span className={`status-badge status-badge--${s.status}`}>{s.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showGenAI && (
        <GenAIBioModal
          lobbyist={lobbyist}
          firm={firm}
          onClose={() => setShowGenAI(false)}
          onApply={setBio}
        />
      )}
    </>
  );
}

/* ── Main Lobbyists Page ── */
export default function LobbyistsPage() {
  const { firm, lobbyists, clients, topics, submissions } = useFirmData();
  const [selectedLobbyist, setSelectedLobbyist] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return lobbyists.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.issueAreas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (l.coveredPosition || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [lobbyists, searchQuery, statusFilter]);

  const ISSUE_COLORS = {
    "Defense": "#EF4444", "Cybersecurity": "#8B5CF6", "Intelligence": "#6366F1",
    "Trade": "#F59E0B", "Appropriations": "#3B82F6", "Healthcare": "#10B981",
    "Technology": "#8B5CF6", "FDA": "#EC4899", "Energy": "#F97316",
    "Environment": "#059669", "Agriculture": "#84CC16",
  };

  return (
    <div className="lobbyists-page">
      <header className="page-header">
        <div>
          <h1>Lobbyists <span className="header-badge">{lobbyists.length}</span></h1>
          <p className="page-subtitle">Registered lobbyists under your LDA filing</p>
        </div>
        <button className="btn-primary" onClick={() => {}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Lobbyist
        </button>
      </header>

      {/* LDA Context Banner */}
      <div className="lda-context-banner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>Data sourced from LDA registry &middot; Registration: <strong>{firm?.ldaRegistrationId || "—"}</strong> &middot; {lobbyists.filter(l => l.status === "active").length} active lobbyists on file</span>
      </div>

      {/* Controls */}
      <div className="controls-bar">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search lobbyists, issue areas..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="view-toggle">
          <button className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </button>
          <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="lobbyists-grid">
          {filtered.map(lob => {
            const initials = lob.name.split(" ").map(n => n[0]).join("");
            return (
              <div key={lob.id} className="lobbyist-card" onClick={() => setSelectedLobbyist(lob)}>
                <div className="lobbyist-card__top">
                  <div className="lobbyist-avatar">{initials}</div>
                  <span className={`status-dot status-dot--${lob.status}`} />
                </div>
                <h3>{lob.name}</h3>
                {lob.coveredPosition && (
                  <p className="lobbyist-card__position">{lob.coveredPosition}</p>
                )}
                <div className="lobbyist-card__tags">
                  {lob.issueAreas.map(area => (
                    <span key={area} className="tag tag--sm" style={{ borderColor: ISSUE_COLORS[area] || "#6B7280", color: ISSUE_COLORS[area] || "#6B7280" }}>
                      {area}
                    </span>
                  ))}
                </div>
                <div className="lobbyist-card__footer">
                  <span>{lob.email}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="lobbyists-list">
          <div className="list-header">
            <span>Name</span><span>Covered Position</span><span>Issue Areas</span><span>Status</span>
          </div>
          {filtered.map(lob => {
            const initials = lob.name.split(" ").map(n => n[0]).join("");
            return (
              <div key={lob.id} className="list-row" onClick={() => setSelectedLobbyist(lob)}>
                <div className="list-cell" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="lobbyist-avatar lobbyist-avatar--sm">{initials}</div>
                  <div><strong>{lob.name}</strong><br/><span style={{ fontSize: 12, color: "var(--text-3)" }}>{lob.email}</span></div>
                </div>
                <span className="list-cell">{lob.coveredPosition || "—"}</span>
                <div className="list-cell">
                  {lob.issueAreas.map(a => <span key={a} className="tag tag--xs">{a}</span>)}
                </div>
                <span className="list-cell"><span className={`status-badge status-badge--${lob.status}`}>{lob.status}</span></span>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Panel */}
      {selectedLobbyist && (
        <LobbyistDetailPanel
          lobbyist={selectedLobbyist}
          firm={firm}
          clients={clients}
          topics={topics}
          submissions={submissions}
          onClose={() => setSelectedLobbyist(null)}
        />
      )}
    </div>
  );
}
