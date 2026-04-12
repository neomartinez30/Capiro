import React, { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { getMemberById, getPeerRanking } from "../data/congressData";
import "../styles/Research.css";

export default function MemberProfilePage({ memberId, activeTopic, onBack }) {
  const member = getMemberById(memberId);
  const [selectedTopic, setSelectedTopic] = useState(activeTopic || member?.relatedTopics?.[0]?.topic || "");

  if (!member) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--text-3)" }}>
        <p>Member not found</p>
        <button className="back-btn" onClick={onBack}>Back to directory</button>
      </div>
    );
  }

  const currentTopicScore = member.relatedTopics.find(t => t.topic === selectedTopic)?.score || member.activityScore;
  const peerRanking = useMemo(() => getPeerRanking(selectedTopic), [selectedTopic]);
  const memberRank = peerRanking.findIndex(m => m.id === member.id) + 1;

  const getInitials = (name) => name.split(" ").map(n => n[0]).join("").slice(0, 2);

  // Determine score status text
  const getStatusText = (score) => {
    if (score >= 80) return "very active";
    if (score >= 50) return "active";
    if (score >= 20) return "moderately active";
    return "not active";
  };

  return (
    <div className="profile-layout">
      {/* ── Left: Topic Navigation ── */}
      <div className="profile-sidebar">
        <div className="rs-section">
          <div className="rs-section__title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Current Search
          </div>
        </div>
        {member.relatedTopics.map(t => (
          <div
            key={t.topic}
            className={`profile-topic-item ${selectedTopic === t.topic ? "profile-topic-item--active" : ""}`}
            onClick={() => setSelectedTopic(t.topic)}
          >
            <div className="profile-topic-score-circle">{t.score}</div>
            <div className="profile-topic-name">{t.topic}</div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.4, flexShrink: 0 }}><polyline points="9,18 15,12 9,6"/></svg>
          </div>
        ))}

        {/* Related Activity */}
        <div className="rs-section">
          <div className="rs-section__title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Related Activity
          </div>
          {member.relatedTopics.slice(0, 5).map(t => (
            <div key={t.topic} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 0", borderBottom: "1px solid var(--border)", cursor: "pointer",
            }} onClick={() => setSelectedTopic(t.topic)}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: "var(--bg-soft)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "var(--text)", flexShrink: 0,
              }}>{t.score}</div>
              <span style={{ fontSize: 12, color: "var(--text-2)", flex: 1 }}>{t.topic}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><polyline points="9,18 15,12 9,6"/></svg>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="profile-main">
        {/* Back + Hero */}
        <button className="back-btn" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6"/></svg>
          Back to directory
        </button>

        <div className="profile-hero" style={{ borderRadius: "var(--radius-lg)", marginBottom: "var(--sp-6)" }}>
          <div className="profile-hero__avatar">{getInitials(member.name)}</div>
          <div>
            <div className="profile-hero__name">
              {member.title === "Senator" ? "Senator" : "Representative"} {member.name} + {selectedTopic}
            </div>
            <div className="profile-hero__subtitle">
              ({member.party}) {member.state}{member.district ? `-${member.district}` : ""} | {member.chamber}
            </div>
          </div>
          <div className="profile-hero__actions">
            <button className="profile-hero__btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="11" x2="19" y2="17"/><line x1="16" y1="14" x2="22" y2="14"/></svg>
              Add to Champion Group
            </button>
            <button className="profile-hero__btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              See in Congressional Directory
            </button>
          </div>
        </div>

        {/* Activity Score Section */}
        <div className="profile-score-section">
          <div className="profile-score-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
            Activity Score
            <span style={{ marginLeft: "auto", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 12, color: "var(--signal-blue)", cursor: "pointer" }}>
              What is an Activity Score? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "middle" }}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
          </div>

          <div className="profile-score-ring">
            <ScoreRing score={currentTopicScore} />
            <div className="score-ring__description">
              <p>
                <strong>{member.title === "Senator" ? "Sen." : "Rep."} {member.name}</strong> activity score for <strong>{selectedTopic}</strong> is <strong>{currentTopicScore}</strong>.
                This score shows that {member.name} is <strong>{getStatusText(currentTopicScore)}</strong> in your topic of interest. This score is dynamic and updates daily based on an individual's activity.
              </p>
            </div>
          </div>

          {/* Control badges */}
          <div className="control-badges">
            <div className="control-badge">
              <div className="control-dot control-dot--R" />
              Republicans control the <strong style={{ marginLeft: 4 }}>House</strong>
            </div>
            <div className="control-badge">
              <div className="control-dot control-dot--R" />
              Republicans control the <strong style={{ marginLeft: 4 }}>Senate</strong>
            </div>
          </div>

          {/* Score trend metrics */}
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: "var(--sp-3)" }}>
            How has this <strong>activity score</strong> evolved over time?
          </div>
          <div className="score-metrics">
            <div className="score-metric">
              <div className="score-metric__value">
                {member.scoreChange?.lastMonth || 0}
                {member.scoreChange?.lastMonth > 0 && <span className="arrow-up">+</span>}
              </div>
              <div className="score-metric__label">Over last month</div>
            </div>
            <div className="score-metric">
              <div className="score-metric__value">
                {member.scoreChange?.last12Months > 0 && <span className="arrow-up" style={{ fontSize: 14 }}>&#9650;</span>}
                {member.scoreChange?.last12Months}
              </div>
              <div className="score-metric__label">Over last 12 months</div>
            </div>
            <div className="score-metric">
              <div className="score-metric__value">{member.scoreChange?.avg12Months}</div>
              <div className="score-metric__label">Average 12 month score</div>
            </div>
          </div>

          {/* 12-month chart */}
          <div className="chart-section">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={member.scoreHistory12.current} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid var(--border)" }} />
                <Line
                  type="monotone" dataKey="score" stroke="#059669" strokeWidth={2}
                  dot={{ r: 4, fill: "#059669", strokeWidth: 2, stroke: "#fff" }}
                  name="2026"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <div className="chart-legend__item">
                <div className="chart-legend__dot" style={{ background: "rgba(220,38,38,0.3)" }} />
                2025
              </div>
              <div className="chart-legend__item">
                <div className="chart-legend__dot" style={{ background: "#059669" }} />
                2026
              </div>
            </div>
          </div>
        </div>

        {/* ── Key Positions & Committees ── */}
        <div className="info-section">
          <div className="info-section__title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
            Key Positions & Committees
          </div>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-card__label">Key Positions</div>
              <div className="info-card__value">
                {member.keyPositions.map((p, i) => (
                  <div key={i} style={{ marginBottom: 4 }}>{p}</div>
                ))}
              </div>
            </div>
            <div className="info-card">
              <div className="info-card__label">Committee Assignments</div>
              <div className="info-card__value">
                {member.committees.map((c, i) => (
                  <div key={i} style={{ marginBottom: 4 }}>{c}</div>
                ))}
              </div>
            </div>
            <div className="info-card">
              <div className="info-card__label">Service</div>
              <div className="info-card__value">Serving in {member.chamber} since {member.serviceStart}</div>
            </div>
            <div className="info-card">
              <div className="info-card__label">Re-Election</div>
              <div className="info-card__value">Up for re-election in {member.reElection}</div>
            </div>
          </div>
        </div>

        {/* ── Recent Legislative Actions ── */}
        <div className="info-section">
          <div className="info-section__title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
            Recent Legislative Actions
          </div>
          {member.recentActions.length > 0 ? (
            member.recentActions.map((action, i) => (
              <div key={i} className="timeline-item">
                <div className={`timeline-dot timeline-dot--${action.type}`} />
                <div className="timeline-content">
                  <div className="timeline-date">{action.date}</div>
                  <div className="timeline-text">{action.action}</div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: 12, color: "var(--text-3)", padding: "8px 0" }}>No recent actions recorded for this period.</p>
          )}
        </div>

        {/* ── Staff Contacts ── */}
        <div className="info-section">
          <div className="info-section__title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            Staff Contacts
          </div>
          {member.staffContacts.map((staff, i) => (
            <div key={i} className="staff-card">
              <div className="staff-card__avatar">{getInitials(staff.name)}</div>
              <div className="staff-card__info">
                <div className="staff-card__name">{staff.name}</div>
                <div className="staff-card__role">{staff.role} — {staff.focus}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Engagement History ── */}
        <div className="info-section">
          <div className="info-section__title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
            Engagement History (Your Firm)
          </div>
          {member.engagementHistory.length > 0 ? (
            member.engagementHistory.map((eh, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" style={{ background: "var(--accent-warm)" }} />
                <div className="timeline-content">
                  <div className="timeline-date">{eh.date}</div>
                  <div className="timeline-text">{eh.note}</div>
                  <div style={{ fontSize: 11, color: eh.outcome === "Supportive" ? "var(--success)" : eh.outcome === "Interested" ? "var(--signal-blue)" : "var(--text-3)", fontWeight: 600, marginTop: 2 }}>
                    Outcome: {eh.outcome}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: "16px 0", textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 8 }}>No engagement history with this office yet.</p>
              <button style={{
                padding: "7px 16px", borderRadius: "var(--radius-md)", background: "var(--signal-blue)",
                color: "#fff", border: "none", fontSize: 12, fontWeight: 500, fontFamily: "var(--font-system)", cursor: "pointer",
              }}>
                Schedule First Meeting
              </button>
            </div>
          )}
        </div>

        {/* ── Capiro Intelligence Brief ── */}
        <div className="info-section">
          <div style={{
            background: "linear-gradient(135deg, #fff 0%, rgba(232,239,255,0.3) 100%)",
            border: "1px solid rgba(58,111,247,0.15)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--sp-5)",
          }}>
            <div className="info-section__title" style={{ marginBottom: "var(--sp-3)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--signal-blue)" strokeWidth="2"><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/></svg>
              Capiro Intelligence Brief
            </div>
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, marginBottom: "var(--sp-3)" }}>
              <strong style={{ color: "var(--text)" }}>{member.title === "Senator" ? "Sen." : "Rep."} {member.name}</strong> represents a{" "}
              {member.activityScore >= 50 ? "high-value" : member.activityScore >= 20 ? "moderate-value" : "lower-priority"} target for {selectedTopic}-related engagement.
              {member.keyPositions.length > 0 && (
                <> Their position as <strong style={{ color: "var(--text)" }}>{member.keyPositions[0]}</strong> gives them {member.chamber === "Senate" ? "significant influence" : "direct authority"} over relevant authorization and appropriations decisions.</>
              )}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, marginBottom: "var(--sp-3)" }}>
              {member.recentActions.length > 0 ? (
                <>Recent activity pattern suggests <strong style={{ color: "var(--text)" }}>{member.recentActions[0].type === "bill" || member.recentActions[0].type === "cosponsor" ? "active legislative engagement" : "oversight and monitoring interest"}</strong> in this topic area. The {member.scoreChange?.last12Months > 15 ? "upward trajectory" : "current level"} of the activity score indicates {member.scoreChange?.last12Months > 15 ? "growing prioritization" : "sustained but not increasing attention"}.</>
              ) : (
                <>Activity data for this member is limited in the current period. Consider scheduling an introductory briefing to gauge interest and receptiveness.</>
              )}
            </p>
            <div style={{ display: "flex", gap: "var(--sp-2)" }}>
              <button style={{
                padding: "7px 16px", borderRadius: "var(--radius-md)", background: "var(--signal-blue)",
                color: "#fff", border: "none", fontSize: 12, fontWeight: 500, fontFamily: "var(--font-system)", cursor: "pointer",
              }}>
                Generate Full Brief
              </button>
              <button style={{
                padding: "7px 16px", borderRadius: "var(--radius-md)", background: "transparent",
                color: "var(--signal-blue)", border: "1px solid rgba(58,111,247,0.3)", fontSize: 12, fontWeight: 500, fontFamily: "var(--font-system)", cursor: "pointer",
              }}>
                Add to Research Queue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Peer Rankings ── */}
      <div className="profile-ranking">
        <div className="ranking-header">
          <div className="ranking-header__title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: 4 }}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Peer Rankings
          </div>
          <div className="ranking-header__topic">
            See how others rank in <strong>{selectedTopic}</strong>
          </div>
          {memberRank > 0 && (
            <div className="ranking-highlight">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6-6 6 6"/><path d="M12 3v18"/></svg>
              {member.title === "Senator" ? "Sen." : "Rep."} {member.name} is #{memberRank} in {selectedTopic} ranking
            </div>
          )}
        </div>

        <div style={{ padding: "8px 16px" }}>
          <select className="rs-select" defaultValue="highest">
            <option value="highest">Highest Ranked</option>
            <option value="lowest">Lowest Ranked</option>
          </select>
        </div>

        <div className="ranking-list">
          {peerRanking.slice(0, 10).map((peer, idx) => (
            <div
              key={peer.id}
              className="ranking-item"
              style={peer.id === member.id ? { background: "var(--signal-soft)" } : {}}
              onClick={() => peer.id !== member.id && onBack?.()}
            >
              <div className="ranking-item__rank">{idx + 1}</div>
              <div className="ranking-item__avatar">{getInitials(peer.name)}</div>
              <div className="ranking-item__info">
                <div className="ranking-item__name">
                  {peer.title === "Senator" ? "Sen." : "Rep."} {peer.name}
                </div>
                <div className="ranking-item__meta">
                  ({peer.party}) {peer.state}
                </div>
              </div>
              <div className="ranking-item__score">{peer.topicScore}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Score Ring SVG ── */
function ScoreRing({ score, size = 100 }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 60 ? "#059669" : score >= 30 ? "#D97706" : "#9CA3AF";

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--bg-soft)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="score-ring__value">{score}</div>
    </div>
  );
}
