import React, { useState, useMemo, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import {
  MEMBERS, CRS_TOPICS, RECENT_SEARCHES, searchMembersByTopic, searchMembersByName, getMemberById,
} from "../data/congressData";
import Icon from "../components/dashboard/Icons";
import "../styles/Research.css";

const ITEMS_PER_PAGE = 24;
const STATES = [...new Set(MEMBERS.map(m => m.state))].sort();
const COMMITTEES = [...new Set(MEMBERS.flatMap(m => m.committees))].sort();

export default function StakeholderDirectoryPage({ onSelectMember }) {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState("topic"); // "topic" | "name"
  const [chamber, setChamber] = useState("All");
  const [party, setParty] = useState("All");
  const [stateFilter, setStateFilter] = useState("");
  const [committeeFilter, setCommitteeFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [groupMembers, setGroupMembers] = useState(new Set());
  const [showExplainer, setShowExplainer] = useState(false);
  const [activeSearch, setActiveSearch] = useState("Public participation and lobbying");

  // Perform search
  const searchResults = useMemo(() => {
    let results;
    if (searchMode === "topic") {
      results = activeSearch ? searchMembersByTopic(activeSearch) : MEMBERS;
    } else {
      results = query ? searchMembersByName(query) : MEMBERS;
    }
    return results;
  }, [activeSearch, query, searchMode]);

  // Apply filters
  const filteredResults = useMemo(() => {
    let r = [...searchResults];

    if (chamber !== "All") r = r.filter(m => m.chamber === chamber);
    if (party !== "All") r = r.filter(m => m.party === party);
    if (stateFilter) r = r.filter(m => m.state === stateFilter);
    if (committeeFilter) r = r.filter(m => m.committees.some(c => c.includes(committeeFilter)));
    if (nameFilter) r = r.filter(m => m.name.toLowerCase().includes(nameFilter.toLowerCase()));

    // Sort
    r.sort((a, b) => sortDir === "desc" ? b.activityScore - a.activityScore : a.activityScore - b.activityScore);

    return r;
  }, [searchResults, chamber, party, stateFilter, committeeFilter, nameFilter, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const paginatedResults = filteredResults.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE + 1;
  const endIdx = Math.min(page * ITEMS_PER_PAGE, filteredResults.length);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      if (searchMode === "topic" && query) {
        setActiveSearch(query);
      }
      setPage(1);
    }
  };

  const handleRecentSearch = (term) => {
    setSearchMode("topic");
    setQuery(term);
    setActiveSearch(term);
    setPage(1);
  };

  const toggleGroup = (id, e) => {
    e.stopPropagation();
    setGroupMembers(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getInitials = (name) => name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <div className="research-layout">
      {/* ── Left Sidebar ── */}
      <div className="research-sidebar">
        {/* Filters */}
        <div className="rs-section">
          <div className="rs-section__title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
            Filters
          </div>

          <div className="rs-filter-group">
            <div className="rs-filter-label">Party</div>
            <div className="rs-chip-group">
              {["All", "D", "R"].map(p => (
                <button key={p} className={`rs-chip ${party === p ? "rs-chip--active" : ""}`} onClick={() => { setParty(p); setPage(1); }}>
                  {p === "All" ? "All" : p === "D" ? "Democrat" : "Republican"}
                </button>
              ))}
            </div>
          </div>

          <div className="rs-filter-group">
            <div className="rs-filter-label">Chamber</div>
            <div className="rs-chip-group">
              {["All", "Senate", "House"].map(c => (
                <button key={c} className={`rs-chip ${chamber === c ? "rs-chip--active" : ""}`} onClick={() => { setChamber(c); setPage(1); }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="rs-filter-group">
            <div className="rs-filter-label">Committee</div>
            <select className="rs-select" value={committeeFilter} onChange={e => { setCommitteeFilter(e.target.value); setPage(1); }}>
              <option value="">All Committees</option>
              {COMMITTEES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="rs-filter-group">
            <div className="rs-filter-label">State</div>
            <select className="rs-select" value={stateFilter} onChange={e => { setStateFilter(e.target.value); setPage(1); }}>
              <option value="">All States</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="rs-filter-group">
            <div className="rs-filter-label">Specific Member</div>
            <div className="rs-member-input">
              <input
                type="text"
                placeholder="Type name"
                value={nameFilter}
                onChange={e => { setNameFilter(e.target.value); setPage(1); }}
              />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
          </div>
        </div>

        {/* Recent Searches */}
        <div className="rs-section" style={{ flex: 1 }}>
          <div className="rs-section__title">
            <Icon name="search" size={14} />
            Most Recent Searches
          </div>
          {RECENT_SEARCHES.map(rs => (
            <div key={rs.id} className="rs-recent-item" onClick={() => handleRecentSearch(rs.term)}>
              <div className="rs-recent-term">
                {rs.term}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"/></svg>
              </div>
              <div className="rs-recent-meta">Last run by {rs.user}, {rs.date}</div>
              <div className="rs-recent-avatars">
                {rs.topMembers.slice(0, 5).map(mid => {
                  const m = getMemberById(mid);
                  return m ? (
                    <div key={mid} className="rs-avatar-circle" title={m.name}>
                      {getInitials(m.name)}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="research-main">
        {/* Search bar */}
        <div className="research-search">
          <Icon name="search" size={18} color="var(--text-3)" />
          <input
            type="text"
            placeholder={searchMode === "topic" ? "Search by CRS topic (e.g., Defense spending, Artificial intelligence)..." : "Search by member name..."}
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              if (searchMode === "name") setPage(1);
            }}
            onKeyDown={handleSearch}
          />
          <div className="search-mode-toggle">
            <button className={`search-mode-btn ${searchMode === "topic" ? "search-mode-btn--active" : ""}`} onClick={() => setSearchMode("topic")}>Topic</button>
            <button className={`search-mode-btn ${searchMode === "name" ? "search-mode-btn--active" : ""}`} onClick={() => setSearchMode("name")}>Name</button>
          </div>
          <a className="glossary-link" href="https://crsreports.congress.gov" target="_blank" rel="noreferrer">
            CRS Glossary
          </a>
        </div>

        {/* Topic suggestions */}
        {searchMode === "topic" && query && (
          <div style={{ marginBottom: "var(--sp-3)", display: "flex", flexWrap: "wrap", gap: 4 }}>
            {CRS_TOPICS.filter(t => t.toLowerCase().includes(query.toLowerCase())).slice(0, 8).map(t => (
              <button key={t} className="rs-chip" onClick={() => { setQuery(t); setActiveSearch(t); setPage(1); }}>
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Congress notice + explainer */}
        <div className="congress-notice">
          <strong>Note:</strong> All results represent the <em>current Congress</em> (119th Congress, 2025-2027).
        </div>

        <div className="score-explainer" onClick={() => setShowExplainer(!showExplainer)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          What is an Activity Score?
          {showExplainer && (
            <span style={{ display: "block", fontWeight: 400, marginTop: 6, fontSize: 11, color: "var(--text-2)", lineHeight: 1.5 }}>
              Activity Scores (0-100) measure how strongly a member is associated with a topic, based on bill sponsorship, co-sponsorship, committee hearings, floor statements, press releases, and social media signals. Scores are dynamic and update daily.
            </span>
          )}
        </div>

        {/* Results header */}
        <div className="results-header">
          <div>
            <div className="results-count">
              {startIdx}–{endIdx} of {filteredResults.length} results for "{activeSearch || "All Members"}"
            </div>
          </div>
          <div className="results-sort">
            <label>Sort by:</label>
            <select value={sortDir} onChange={e => setSortDir(e.target.value)}>
              <option value="desc">highest to lowest</option>
              <option value="asc">lowest to highest</option>
            </select>
          </div>
        </div>

        {/* Member cards grid */}
        <div className="member-grid">
          {paginatedResults.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              activeTopic={activeSearch}
              inGroup={groupMembers.has(member.id)}
              onToggleGroup={(e) => toggleGroup(member.id, e)}
              groupSize={groupMembers.size}
              onClick={() => onSelectMember?.(member.id, activeSearch)}
            />
          ))}
        </div>

        {paginatedResults.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-3)" }}>
            <p style={{ fontSize: 16, marginBottom: 8 }}>No members found</p>
            <p style={{ fontSize: 13 }}>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="pagination__btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} className={`pagination__btn ${page === p ? "pagination__btn--active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            {totalPages > 5 && <span style={{ color: "var(--text-3)", fontSize: 12 }}>...</span>}
            <button className="pagination__btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Member Card Component ── */
function MemberCard({ member, activeTopic, inGroup, onToggleGroup, groupSize, onClick }) {
  const getInitials = (name) => name.split(" ").map(n => n[0]).join("").slice(0, 2);

  // Get topic-specific score if searching by topic
  const topicScore = activeTopic
    ? member.relatedTopics.find(t => t.topic.toLowerCase().includes(activeTopic.toLowerCase()))?.score || member.activityScore
    : member.activityScore;

  return (
    <div className="member-card" onClick={onClick}>
      <div className="member-card__header">
        <div className="member-card__avatar">{getInitials(member.name)}</div>
        <div className="member-card__info">
          <div className="member-card__title-row">
            {member.title === "Senator" ? "Senator" : "House Rep."}
          </div>
          <div className="member-card__name">
            {member.title === "Senator" ? "Sen." : "Rep."} {member.name}
          </div>
        </div>
        <div className={`member-card__party member-card__party--${member.party}`}>
          {member.party}
          <span style={{ position: "absolute", bottom: -14, right: 0, fontSize: 9, color: "var(--text-3)", fontWeight: 500 }}>
            {member.state}{member.district ? `-${member.district}` : ""}
          </span>
        </div>
      </div>

      <div className="activity-score-section">
        <span className="activity-score-label">Activity Score</span>
        <span className="activity-score-value">{topicScore}</span>
      </div>
      <div className="activity-score-bar">
        <div className="activity-score-bar__fill" style={{ width: `${topicScore}%` }} />
      </div>

      <div className="member-card__service">
        <span><strong>Service</strong></span>
        <span>Serving in {member.chamber} since {member.serviceStart} | Up for re-election in {member.reElection}</span>
      </div>

      <div className="member-card__chart-label">Activity Score History</div>
      <ResponsiveContainer width="100%" height={60}>
        <LineChart data={member.scoreHistory} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} hide />
          <Tooltip
            contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid var(--border)" }}
            formatter={(val) => [`${val}`, "Score"]}
          />
          <Line type="monotone" dataKey="score" stroke="#059669" strokeWidth={2} dot={{ r: 3, fill: "#059669" }} />
        </LineChart>
      </ResponsiveContainer>

      <div className="member-card__footer">
        <button className="add-to-group" onClick={onToggleGroup}>
          <div className={`add-to-group__checkbox ${inGroup ? "add-to-group__checkbox--active" : ""}`}>
            {inGroup && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
            )}
          </div>
          Add to group
        </button>
        <div className="group-count">
          {inGroup ? 1 : 0}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
        </div>
      </div>
    </div>
  );
}
