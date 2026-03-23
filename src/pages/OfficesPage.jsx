import React, { useState, useMemo } from "react";
import { useFirmData } from "../hooks/useFirmData";
import "../styles/Offices.css";

export default function OfficesPage() {
  const { allOffices: offices, topics, submissions } = useFirmData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterChamber, setFilterChamber] = useState("all");
  const [filterParty, setFilterParty] = useState("all");
  const [filterCommittee, setFilterCommittee] = useState("all");
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [showAIMatch, setShowAIMatch] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");

  // Extract unique committees for filter
  const committees = useMemo(() => {
    const unique = [...new Set(offices.map((o) => o.committee).filter(Boolean))];
    return ["All Committees", ...unique.sort()];
  }, [offices]);

  // Filter offices based on all criteria
  const filteredOffices = useMemo(() => {
    return offices.filter((office) => {
      const matchSearch =
        (office.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (office.state || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchChamber = filterChamber === "all" || office.chamber === filterChamber;
      const matchParty = filterParty === "all" || office.party === filterParty;
      const matchCommittee =
        filterCommittee === "All Committees" || office.committee === filterCommittee;

      return matchSearch && matchChamber && matchParty && matchCommittee;
    });
  }, [offices, searchTerm, filterChamber, filterParty, filterCommittee]);

  // Calculate stats
  const total = offices.length || 1; // avoid division by zero
  const stats = {
    total: offices.length,
    senate: offices.filter((o) => o.chamber === "Senate").length,
    house: offices.filter((o) => o.chamber === "House").length,
    digital: offices.filter((o) => o.adoptedForms).length,
    digitalPercent: Math.round(
      (offices.filter((o) => o.adoptedForms).length / total) * 100
    ),
  };

  // Get submissions for an office
  const getOfficeSubmissions = (officeId) => {
    return submissions.filter((s) => s.officeId === officeId);
  };

  // Get topics submitted to an office
  const getOfficeTopics = (officeId) => {
    const subs = getOfficeSubmissions(officeId);
    return subs.map((sub) => {
      const topic = topics.find((t) => t.id === sub.topicId);
      return { ...topic, submissionId: sub.id, submissionStatus: sub.status };
    });
  };

  // AI match scoring (simulated)
  const getAIMatchedOffices = (topicId) => {
    if (!topicId) return [];
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return [];

    return offices
      .map((office) => {
        const relevanceScore = Math.floor(Math.random() * 40) + 60; // 60-99
        const isTargeted = topic.targetOffices?.includes(office.id);
        return {
          ...office,
          relevanceScore: isTargeted ? Math.min(relevanceScore + 20, 99) : relevanceScore,
          isTargeted,
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  const aiMatchedOffices = getAIMatchedOffices(selectedTopic);

  return (
    <div className="offices-page">
      {/* Header with stats */}
      <div className="offices-header">
        <div className="offices-header__content">
          <h1 className="offices-header__title">Congressional Offices</h1>
          <p className="offices-header__subtitle">Database of {stats.total} members with digital submission capabilities</p>
        </div>
        <div className="offices-stats">
          <div className="stat-box">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Offices</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{stats.senate}</div>
            <div className="stat-label">Senate</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{stats.house}</div>
            <div className="stat-label">House</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{stats.digitalPercent}%</div>
            <div className="stat-label">Digital Forms</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="offices-controls">
        <div className="search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filterChamber}
            onChange={(e) => setFilterChamber(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Chambers</option>
            <option value="Senate">Senate</option>
            <option value="House">House</option>
          </select>

          <select
            value={filterParty}
            onChange={(e) => setFilterParty(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Parties</option>
            <option value="D">Democratic</option>
            <option value="R">Republican</option>
          </select>

          <select
            value={filterCommittee}
            onChange={(e) => setFilterCommittee(e.target.value)}
            className="filter-select"
          >
            {committees.map((comm) => (
              <option key={comm} value={comm}>
                {comm}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn-ai-match"
          onClick={() => setShowAIMatch(!showAIMatch)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm3.5-9c.828 0 1.5-.672 1.5-1.5S16.328 8 15.5 8 14 8.672 14 9.5s.672 1.5 1.5 1.5zm-7 0c.828 0 1.5-.672 1.5-1.5S9.328 8 8.5 8 7 8.672 7 9.5 7.672 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.16-3.5H6.34c.85 2.04 2.83 3.5 5.16 3.5z" />
          </svg>
          AI Match
        </button>
      </div>

      {/* AI Match Selector */}
      {showAIMatch && (
        <div className="ai-match-selector">
          <label className="ai-match-label">Select a topic to find best matching offices:</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="ai-match-select"
          >
            <option value="">Choose a topic...</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}{topic.clientId ? ` (${topic.clientId})` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="offices-container">
        {/* Offices Grid or AI Match Results */}
        <div className="offices-main">
          {showAIMatch && selectedTopic ? (
            <div className="ai-match-results">
              <h3 className="ai-match-title">
                AI-Matched Offices for Selected Topic
              </h3>
              <div className="offices-grid">
                {aiMatchedOffices.map((office) => (
                  <div
                    key={office.id}
                    className={`office-card office-card--ai ${
                      selectedOffice?.id === office.id ? "office-card--selected" : ""
                    }`}
                    onClick={() => setSelectedOffice(office)}
                  >
                    <div className="office-card__header">
                      <div className="office-card__name-badge">
                        <h3 className="office-card__name">{office.name}</h3>
                        <span className={`party-badge party-badge--${office.party}`}>
                          {office.party === "D" ? "D" : "R"}
                        </span>
                      </div>
                      {office.adoptedForms ? (
                        <div className="digital-badge digital-badge--adopted" title="Digital submission portal available">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                          Digital
                        </div>
                      ) : (
                        <div className="digital-badge digital-badge--manual" title="Manual submission required">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                          </svg>
                          Manual
                        </div>
                      )}
                    </div>
                    <div className="office-card__meta">
                      <span className="meta-item">{office.state}</span>
                      <span className="meta-item">{office.chamber}</span>
                      <span className="meta-item">{office.role}</span>
                    </div>
                    <div className="office-card__ai-score">
                      <div className="ai-score-label">Relevance</div>
                      <div className="ai-score-bar">
                        <div
                          className="ai-score-fill"
                          style={{ width: `${office.relevanceScore}%` }}
                        />
                      </div>
                      <div className="ai-score-value">{office.relevanceScore}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="offices-grid">
              {filteredOffices.map((office) => (
                <div
                  key={office.id}
                  className={`office-card ${
                    selectedOffice?.id === office.id ? "office-card--selected" : ""
                  }`}
                  onClick={() => setSelectedOffice(office)}
                >
                  <div className="office-card__header">
                    <div className="office-card__name-badge">
                      <h3 className="office-card__name">{office.name}</h3>
                      <span className={`party-badge party-badge--${office.party}`}>
                        {office.party === "D" ? "D" : "R"}
                      </span>
                    </div>
                    {office.adoptedForms ? (
                      <div className="digital-badge digital-badge--adopted" title="Digital submission portal available">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        Digital
                      </div>
                    ) : (
                      <div className="digital-badge digital-badge--manual" title="Manual submission required">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                        </svg>
                        Manual
                      </div>
                    )}
                  </div>
                  <div className="office-card__meta">
                    <span className="meta-item">{office.state}</span>
                    <span className="meta-item">{office.chamber}</span>
                  </div>
                  <div className="office-card__committee">{office.committee}</div>
                  <div className="office-card__role">{office.role}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedOffice && (
          <div className="office-detail-panel">
            <div className="detail-header">
              <h2>{selectedOffice.name}</h2>
              <button
                className="btn-close"
                onClick={() => setSelectedOffice(null)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="detail-section">
              <h3 className="detail-section__title">Office Information</h3>
              <div className="detail-row">
                <span className="detail-label">Chamber:</span>
                <span className="detail-value">{selectedOffice.chamber}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Party:</span>
                <span className={`detail-value party-badge party-badge--${selectedOffice.party}`}>
                  {selectedOffice.party === "D" ? "Democratic" : "Republican"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">State:</span>
                <span className="detail-value">{selectedOffice.state}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Committee:</span>
                <span className="detail-value">{selectedOffice.committee}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Role:</span>
                <span className="detail-value">{selectedOffice.role}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3 className="detail-section__title">Submission Portal</h3>
              {selectedOffice.adoptedForms ? (
                <>
                  <div className="portal-badge portal-badge--active">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Digital submission forms available
                  </div>
                  {selectedOffice.submissionPortal && (
                    <a
                      href={selectedOffice.submissionPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="portal-link"
                    >
                      Visit Portal
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </>
              ) : (
                <div className="portal-badge portal-badge--manual">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                  </svg>
                  Manual submission required
                </div>
              )}
            </div>

            {getOfficeTopics(selectedOffice.id).length > 0 && (
              <div className="detail-section">
                <h3 className="detail-section__title">Submissions to This Office</h3>
                <div className="submissions-list">
                  {getOfficeTopics(selectedOffice.id).map((submission) => (
                    <div key={submission.submissionId} className="submission-item">
                      <div className="submission-title">{submission.name}</div>
                      <div className="submission-meta">
                        <span className={`status-badge status-badge--${submission.submissionStatus}`}>
                          {submission.submissionStatus}
                        </span>
                        <span className="submission-issue">{submission.issueArea}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!getOfficeTopics(selectedOffice.id).length && (
              <div className="detail-section">
                <p className="empty-state">No submissions to this office yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
