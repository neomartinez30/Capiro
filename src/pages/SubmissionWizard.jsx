import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFirmData } from "../hooks/useFirmData";
import "../styles/SubmissionWizard.css";

/* ═══════════════════════════════════════════════════════════
   Submission Drafting Pipeline — AI-Driven 3-Phase Flow
   Brief → AI Generate → Review & Route
   The core product experience of Capiro.
   ═══════════════════════════════════════════════════════════ */

// ─── Constants ─────────────────────────────────────────────────
const SUBMISSION_TYPES = [
  { id: "bill_language", label: "Bill Language", desc: "Draft legislative text for inclusion in a bill" },
  { id: "appropriations", label: "Appropriations", desc: "Funding request with program justification" },
  { id: "report_language", label: "Report Language", desc: "Committee report directive or recommendation" },
  { id: "white_paper", label: "White Paper", desc: "Policy position paper for office education" },
];

const DATA_SOURCES = [
  { id: "congress", label: "Congress.gov", icon: "🏛" },
  { id: "senate", label: "Senate.gov", icon: "📜" },
  { id: "usaspending", label: "USASpending.gov", icon: "💰" },
  { id: "sam", label: "SAM.gov", icon: "📋" },
  { id: "ndaa", label: "NDAA Materials", icon: "🛡" },
  { id: "peo", label: "PEO Directory", icon: "⚙" },
  { id: "client", label: "Client Profile", icon: "🏢" },
  { id: "history", label: "Submission History", icon: "📁" },
];

const AI_TASKS = [
  { id: "context", label: "Retrieving client & topic context", duration: 1800 },
  { id: "offices", label: "Analyzing target office preferences", duration: 1400 },
  { id: "history", label: "Scanning analogous past submissions", duration: 2000 },
  { id: "sources", label: "Pulling relevant legislative data", duration: 2200 },
  { id: "plan", label: "Building structured drafting plan", duration: 1200 },
  { id: "draft", label: "Generating submission draft", duration: 3500 },
  { id: "critique", label: "Running style & policy critique", duration: 1800 },
  { id: "redlines", label: "Producing redline suggestions", duration: 1000 },
];

// ─── Phase 1: Brief ────────────────────────────────────────────
function BriefPhase({ data, onChange, clients, topics, allOffices, onGenerate }) {
  const selectedClient = clients.find(c => c.id === data.clientId);
  const clientTopics = topics.filter(t => t.clientId === data.clientId);
  const selectedTopic = clientTopics.find(t => t.id === data.topicId);

  // Auto-fill offices from topic
  useEffect(() => {
    if (selectedTopic?.targetOffices && data.offices.length === 0) {
      onChange({ offices: selectedTopic.targetOffices });
    }
  }, [selectedTopic]);

  // Auto-fill submission type from topic
  useEffect(() => {
    if (selectedTopic?.submissionType && !data.type) {
      onChange({ type: selectedTopic.submissionType });
    }
  }, [selectedTopic]);

  const toggleOffice = (officeId) => {
    const next = data.offices.includes(officeId)
      ? data.offices.filter(id => id !== officeId)
      : [...data.offices, officeId];
    onChange({ offices: next });
  };

  const canGenerate = data.clientId && data.topicId && data.type && data.offices.length > 0;

  return (
    <div className="sw-brief">
      <div className="sw-brief__header">
        <h2 className="sw-brief__title">New Submission</h2>
        <p className="sw-brief__subtitle">
          Tell AI the basics — it handles the research, drafting, and critique.
        </p>
      </div>

      <div className="sw-brief__grid">
        {/* Client */}
        <div className="sw-field">
          <label className="sw-field__label">Client</label>
          <select
            className="sw-field__select"
            value={data.clientId}
            onChange={e => onChange({ clientId: e.target.value, topicId: "", offices: [] })}
          >
            <option value="">Select a client...</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div className="sw-field">
          <label className="sw-field__label">Topic</label>
          <select
            className="sw-field__select"
            value={data.topicId}
            onChange={e => onChange({ topicId: e.target.value })}
            disabled={!data.clientId}
          >
            <option value="">Select a topic...</option>
            {clientTopics.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          {selectedTopic && (
            <p className="sw-field__hint">{selectedTopic.description}</p>
          )}
        </div>

        {/* Submission Type */}
        <div className="sw-field sw-field--full">
          <label className="sw-field__label">Submission Type</label>
          <div className="sw-type-grid">
            {SUBMISSION_TYPES.map(st => (
              <button
                key={st.id}
                className={`sw-type-card${data.type === st.id ? " sw-type-card--active" : ""}`}
                onClick={() => onChange({ type: st.id })}
              >
                <span className="sw-type-card__label">{st.label}</span>
                <span className="sw-type-card__desc">{st.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Funding Ask (conditional) */}
        {(data.type === "appropriations") && (
          <div className="sw-field">
            <label className="sw-field__label">Funding Ask</label>
            <input
              className="sw-field__input"
              type="text"
              placeholder="e.g. $15,000,000"
              value={data.fundingAsk}
              onChange={e => onChange({ fundingAsk: e.target.value })}
            />
          </div>
        )}

        {/* Additional Context */}
        <div className="sw-field sw-field--full">
          <label className="sw-field__label">
            Additional Context <span className="sw-field__optional">optional</span>
          </label>
          <textarea
            className="sw-field__textarea"
            placeholder="Any specific angles, talking points, or constraints for the AI to consider..."
            rows={3}
            value={data.additionalContext}
            onChange={e => onChange({ additionalContext: e.target.value })}
          />
        </div>

        {/* Target Offices */}
        <div className="sw-field sw-field--full">
          <label className="sw-field__label">
            Target Offices
            {selectedTopic?.targetOffices && (
              <span className="sw-field__autofill">Auto-selected from topic</span>
            )}
          </label>
          <div className="sw-offices-list">
            {allOffices.map(office => (
              <label
                key={office.id}
                className={`sw-office-chip${data.offices.includes(office.id) ? " sw-office-chip--active" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={data.offices.includes(office.id)}
                  onChange={() => toggleOffice(office.id)}
                  className="sw-office-chip__input"
                />
                <span className="sw-office-chip__party" data-party={office.party}>
                  {office.party}
                </span>
                <span className="sw-office-chip__name">{office.name}</span>
                <span className="sw-office-chip__committee">{office.committee}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="sw-brief__actions">
        <button
          className="sw-btn sw-btn--primary sw-btn--lg"
          disabled={!canGenerate}
          onClick={onGenerate}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Generate with AI
        </button>
        <p className="sw-brief__actions-hint">
          AI will research, draft, and critique — then present for your review.
        </p>
      </div>
    </div>
  );
}

// ─── Phase 2: AI Working ───────────────────────────────────────
function AIWorkingPhase({ brief, clients, topics, allOffices, onComplete }) {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(0);
  const [sourcesUsed, setSourcesUsed] = useState([]);
  const [streamedText, setStreamedText] = useState("");
  const streamRef = useRef(null);

  const selectedClient = clients.find(c => c.id === brief.clientId);
  const selectedTopic = topics.find(t => t.id === brief.topicId);

  // Simulated AI pipeline
  useEffect(() => {
    let cancelled = false;
    let taskIdx = 0;

    const runNext = () => {
      if (cancelled || taskIdx >= AI_TASKS.length) return;
      setCurrentTask(taskIdx);

      // Add data sources as they become relevant
      if (taskIdx === 0) setSourcesUsed(s => [...new Set([...s, "client", "history"])]);
      if (taskIdx === 1) setSourcesUsed(s => [...new Set([...s, "senate", "congress"])]);
      if (taskIdx === 2) setSourcesUsed(s => [...new Set([...s, "history"])]);
      if (taskIdx === 3) setSourcesUsed(s => [...new Set([...s, "usaspending", "ndaa", "sam"])]);
      if (taskIdx === 5) setSourcesUsed(s => [...new Set([...s, "peo"])]);

      const duration = AI_TASKS[taskIdx].duration;
      setTimeout(() => {
        if (cancelled) return;
        setCompletedTasks(prev => [...prev, AI_TASKS[taskIdx].id]);
        taskIdx++;

        if (taskIdx >= AI_TASKS.length) {
          streamDraft();
        } else {
          runNext();
        }
      }, duration);
    };

    const streamDraft = () => {
      const draftLines = generateMockDraft(selectedTopic, selectedClient, brief.type);
      let charIdx = 0;
      streamRef.current = setInterval(() => {
        if (cancelled) { clearInterval(streamRef.current); return; }
        if (charIdx < draftLines.length) {
          setStreamedText(draftLines.substring(0, charIdx + 3));
          charIdx += 3;
        } else {
          clearInterval(streamRef.current);
          setTimeout(() => { if (!cancelled) onComplete(draftLines); }, 800);
        }
      }, 15);
    };

    runNext();
    return () => { cancelled = true; if (streamRef.current) clearInterval(streamRef.current); };
  }, []);

  const progress = (completedTasks.length / AI_TASKS.length) * 100;
  const isStreaming = completedTasks.length === AI_TASKS.length;

  return (
    <div className="sw-working">
      <div className="sw-working__header">
        <div className="sw-working__spinner" />
        <h2 className="sw-working__title">
          {isStreaming ? "Writing draft..." : "AI is working"}
        </h2>
        <p className="sw-working__subtitle">
          {selectedTopic?.name} — {selectedClient?.name}
        </p>
      </div>

      {/* Progress */}
      <div className="sw-working__progress">
        <div className="sw-working__bar">
          <div className="sw-working__bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Task List */}
      <div className="sw-working__tasks">
        {AI_TASKS.map((task, i) => {
          const isComplete = completedTasks.includes(task.id);
          const isCurrent = currentTask === i && !isComplete;
          return (
            <div
              key={task.id}
              className={`sw-task${isComplete ? " sw-task--done" : ""}${isCurrent ? " sw-task--active" : ""}`}
            >
              <div className="sw-task__icon">
                {isComplete ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : isCurrent ? (
                  <div className="sw-task__spinner" />
                ) : (
                  <div className="sw-task__dot" />
                )}
              </div>
              <span className="sw-task__label">{task.label}</span>
            </div>
          );
        })}
      </div>

      {/* Data sources being used */}
      <div className="sw-working__sources">
        <span className="sw-working__sources-label">Sources accessed</span>
        <div className="sw-working__sources-list">
          {DATA_SOURCES.filter(ds => sourcesUsed.includes(ds.id)).map(ds => (
            <span key={ds.id} className="sw-source-tag">
              <span>{ds.icon}</span> {ds.label}
            </span>
          ))}
        </div>
      </div>

      {/* Streaming draft preview */}
      {isStreaming && (
        <div className="sw-working__stream">
          <div className="sw-working__stream-header">Draft Preview</div>
          <pre className="sw-working__stream-content">
            {streamedText}<span className="sw-cursor">|</span>
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Phase 3: Review & Route ───────────────────────────────────
function ReviewPhase({ draft, brief, clients, topics, allOffices, onBack, onSubmit }) {
  const [editedDraft, setEditedDraft] = useState(draft);
  const [activeTab, setActiveTab] = useState("draft");
  const [deliveryMethods, setDeliveryMethods] = useState({});
  const [checklist, setChecklist] = useState({
    accuracy: false, tone: false, compliance: false, reviewed: false,
  });

  const selectedClient = clients.find(c => c.id === brief.clientId);
  const selectedTopic = topics.find(t => t.id === brief.topicId);
  const selectedOffices = allOffices.filter(o => brief.offices.includes(o.id));

  // Initialize delivery methods
  useEffect(() => {
    const methods = {};
    selectedOffices.forEach(o => {
      methods[o.id] = o.submissionPortal ? "portal" : o.adoptedForms ? "inbox" : "email";
    });
    setDeliveryMethods(methods);
  }, []);

  const critique = generateMockCritique();
  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <div className="sw-review">
      {/* Header */}
      <div className="sw-review__header">
        <div className="sw-review__header-left">
          <button className="sw-btn sw-btn--ghost" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Start Over
          </button>
          <div>
            <h2 className="sw-review__title">{selectedTopic?.name}</h2>
            <p className="sw-review__meta">
              {selectedClient?.name} · {SUBMISSION_TYPES.find(t => t.id === brief.type)?.label} · {selectedOffices.length} office{selectedOffices.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="sw-review__header-right">
          <div className="sw-review__score">
            <span className="sw-review__score-value">87</span>
            <span className="sw-review__score-label">AI Score</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sw-review__tabs">
        {[
          { id: "draft", label: "Draft" },
          { id: "critique", label: "AI Critique" },
          { id: "route", label: "Route & Submit" },
        ].map(tab => (
          <button
            key={tab.id}
            className={`sw-review__tab${activeTab === tab.id ? " sw-review__tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id === "critique" && (
              <span className="sw-review__tab-badge">{critique.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="sw-review__body">
        {activeTab === "draft" && (
          <div className="sw-review__draft">
            <div className="sw-review__draft-toolbar">
              <span className="sw-review__draft-info">
                {editedDraft.split(/\s+/).length} words · v1 · AI-generated
              </span>
              <div className="sw-review__draft-actions">
                <button className="sw-btn sw-btn--sm" onClick={() => setEditedDraft(draft)}>
                  Reset to Original
                </button>
              </div>
            </div>
            <textarea
              className="sw-review__editor"
              value={editedDraft}
              onChange={e => setEditedDraft(e.target.value)}
              spellCheck
            />
          </div>
        )}

        {activeTab === "critique" && (
          <div className="sw-review__critique">
            <div className="sw-critique-summary">
              <div className="sw-critique-summary__score">
                <div className="sw-critique-ring">
                  <svg viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="var(--signal-blue)" strokeWidth="3"
                      strokeDasharray="87, 100" strokeLinecap="round"
                    />
                  </svg>
                  <span className="sw-critique-ring__value">87</span>
                </div>
                <p className="sw-critique-summary__label">Compliance Score</p>
              </div>
              <div className="sw-critique-summary__breakdown">
                <div className="sw-critique-stat">
                  <span className="sw-critique-stat__count sw-critique-stat--info">2</span>
                  <span>Suggestions</span>
                </div>
                <div className="sw-critique-stat">
                  <span className="sw-critique-stat__count sw-critique-stat--warn">1</span>
                  <span>Warning</span>
                </div>
                <div className="sw-critique-stat">
                  <span className="sw-critique-stat__count sw-critique-stat--ok">3</span>
                  <span>Passed</span>
                </div>
              </div>
            </div>
            <div className="sw-critique-items">
              {critique.map((item, i) => (
                <div key={i} className={`sw-critique-item sw-critique-item--${item.severity}`}>
                  <div className="sw-critique-item__header">
                    <span className={`sw-critique-item__badge sw-critique-item__badge--${item.severity}`}>
                      {item.severity}
                    </span>
                    <span className="sw-critique-item__category">{item.category}</span>
                  </div>
                  <p className="sw-critique-item__text">{item.text}</p>
                  {item.suggestion && (
                    <p className="sw-critique-item__suggestion">
                      <strong>Suggestion:</strong> {item.suggestion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "route" && (
          <div className="sw-review__route">
            {/* Pre-submission Checklist */}
            <div className="sw-checklist">
              <h3 className="sw-checklist__title">Pre-Submission Checklist</h3>
              {[
                { key: "accuracy", label: "Content accuracy verified" },
                { key: "tone", label: "Tone appropriate for target offices" },
                { key: "compliance", label: "LDA compliance confirmed" },
                { key: "reviewed", label: "Senior team member reviewed" },
              ].map(item => (
                <label key={item.key} className="sw-checklist__item">
                  <input
                    type="checkbox"
                    checked={checklist[item.key]}
                    onChange={() => setChecklist(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className="sw-checklist__hidden"
                  />
                  <span className={`sw-checklist__check${checklist[item.key] ? " sw-checklist__check--done" : ""}`}>
                    {checklist[item.key] && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                    )}
                  </span>
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            {/* Office Routing */}
            <div className="sw-routing">
              <h3 className="sw-routing__title">Delivery Routing</h3>
              {selectedOffices.map(office => (
                <div key={office.id} className="sw-routing__office">
                  <div className="sw-routing__office-info">
                    <span className="sw-routing__party" data-party={office.party}>{office.party}</span>
                    <div>
                      <p className="sw-routing__name">{office.name}</p>
                      <p className="sw-routing__committee">{office.committee}</p>
                    </div>
                  </div>
                  <select
                    className="sw-field__select sw-routing__method"
                    value={deliveryMethods[office.id] || "email"}
                    onChange={e => setDeliveryMethods(prev => ({ ...prev, [office.id]: e.target.value }))}
                  >
                    {office.submissionPortal && <option value="portal">AI Portal Agent</option>}
                    {office.adoptedForms && <option value="inbox">Capiro Inbox</option>}
                    <option value="email">PDF via Email</option>
                    <option value="manual">Manual Delivery</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="sw-routing__actions">
              <button
                className="sw-btn sw-btn--primary sw-btn--lg"
                disabled={!allChecked}
                onClick={onSubmit}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Approve &amp; Route to {selectedOffices.length} Office{selectedOffices.length !== 1 ? "s" : ""}
              </button>
              {!allChecked && (
                <p className="sw-routing__hint">Complete the checklist above to enable submission.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Success Screen ────────────────────────────────────────────
function SuccessPhase({ brief, allOffices }) {
  const navigate = useNavigate();
  const selectedOffices = allOffices.filter(o => brief.offices.includes(o.id));

  return (
    <div className="sw-success">
      <div className="sw-success__icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h2 className="sw-success__title">Submission Routed</h2>
      <p className="sw-success__text">
        Your submission has been approved and routed to {selectedOffices.length} congressional office{selectedOffices.length !== 1 ? "s" : ""}.
        Delivery status will update in your submissions dashboard.
      </p>
      <div className="sw-success__offices">
        {selectedOffices.map(o => (
          <span key={o.id} className="sw-success__office-tag">{o.name}</span>
        ))}
      </div>
      <button
        className="sw-btn sw-btn--primary"
        onClick={() => navigate("/app/submissions")}
      >
        Back to Submissions
      </button>
    </div>
  );
}

// ─── Mock Data Generators ──────────────────────────────────────
function generateMockDraft(topic, client, type) {
  if (type === "bill_language") {
    return `SEC. XXX. ${(topic?.name || "AUTHORIZATION").toUpperCase()}.

(a) FINDINGS.—Congress finds the following:
  (1) ${client?.name || "The client"} has demonstrated critical capabilities in ${topic?.issueArea || "the relevant area"}.
  (2) Current legislative frameworks do not adequately address ${topic?.description || "the stated policy objective"}.
  (3) Modernization of existing programs would enhance national competitiveness and security.

(b) SENSE OF CONGRESS.—It is the sense of Congress that—
  (1) the Federal Government should prioritize investment in ${topic?.issueArea?.toLowerCase() || "this area"};
  (2) public-private partnerships are essential to achieving the objectives described in subsection (a).

(c) AUTHORIZATION OF APPROPRIATIONS.—
  (1) IN GENERAL.—There is authorized to be appropriated ${topic?.fundingAmount ? "$" + (topic.fundingAmount / 1000000) + ",000,000" : "such sums as may be necessary"} for fiscal year 2027 to carry out this section.
  (2) AVAILABILITY.—Amounts appropriated pursuant to paragraph (1) shall remain available until expended.

(d) REPORT.—Not later than 180 days after the date of enactment of this Act, the Secretary shall submit to the appropriate congressional committees a report on implementation progress.`;
  }

  if (type === "appropriations") {
    return `APPROPRIATIONS REQUEST
Program: ${topic?.name || "Program Name"}
Client: ${client?.name || "Client"}
Amount: ${topic?.fundingAmount ? "$" + (topic.fundingAmount / 1000000).toFixed(0) + " million" : "TBD"}

JUSTIFICATION:
${topic?.description || "Program description and justification."}

The requested funding would support ${topic?.desiredOutcome || "the stated policy objectives"} and advance the priorities outlined in the relevant authorization legislation.

PROGRAM BACKGROUND:
${client?.name || "The organization"} has been a leader in ${topic?.issueArea?.toLowerCase() || "this area"} for over a decade. This request aligns with bipartisan priorities identified by relevant authorizing committees.

IMPACT STATEMENT:
Funding at the requested level would directly support workforce development, infrastructure modernization, and operational readiness in ${topic?.issueArea?.toLowerCase() || "the area"}.`;
  }

  return `POLICY POSITION: ${topic?.name || "Topic"}

EXECUTIVE SUMMARY
${topic?.description || "Policy position summary."}

BACKGROUND
${client?.name || "The organization"} recommends action on ${topic?.name || "this matter"} to ${topic?.desiredOutcome || "achieve the stated objectives"}.

RECOMMENDATION
Congress should act to ensure continued progress in ${topic?.issueArea?.toLowerCase() || "this area"} through targeted legislative and appropriations measures.`;
}

function generateMockCritique() {
  return [
    {
      severity: "suggestion",
      category: "Style",
      text: "Consider using more specific program references in subsection (c) to strengthen the authorization basis.",
      suggestion: "Reference the specific program element number or existing authorization.",
    },
    {
      severity: "warning",
      category: "Compliance",
      text: "Funding amount should be cross-referenced with current appropriations levels to ensure consistency.",
      suggestion: "Verify against USASpending.gov data for the relevant program.",
    },
    {
      severity: "suggestion",
      category: "Tone",
      text: "The findings section could be strengthened with more specific data points from the client profile.",
      suggestion: "Include 2-3 quantitative metrics that demonstrate program impact.",
    },
    {
      severity: "pass",
      category: "Format",
      text: "Document follows standard legislative drafting conventions.",
    },
    {
      severity: "pass",
      category: "LDA Compliance",
      text: "No lobbying disclosure issues identified.",
    },
    {
      severity: "pass",
      category: "Office Alignment",
      text: "Language is consistent with target office priorities and committee jurisdiction.",
    },
  ];
}

// ─── Main Component ────────────────────────────────────────────
export default function SubmissionWizard() {
  const navigate = useNavigate();
  const { clients, topics, allOffices } = useFirmData();
  const [phase, setPhase] = useState("brief");
  const [generatedDraft, setGeneratedDraft] = useState("");

  const [brief, setBrief] = useState({
    clientId: "",
    topicId: "",
    type: "",
    fundingAsk: "",
    additionalContext: "",
    offices: [],
  });

  const handleBriefChange = useCallback((updates) => {
    setBrief(prev => ({ ...prev, ...updates }));
  }, []);

  const handleGenerate = () => setPhase("working");

  const handleDraftComplete = (draft) => {
    setGeneratedDraft(draft);
    setPhase("review");
  };

  const handleSubmit = () => setPhase("success");

  const handleStartOver = () => {
    setPhase("brief");
    setGeneratedDraft("");
    setBrief({ clientId: "", topicId: "", type: "", fundingAsk: "", additionalContext: "", offices: [] });
  };

  return (
    <div className="sw">
      {/* Phase indicator */}
      <div className="sw__phases">
        {[
          { id: "brief", label: "Brief", num: "1" },
          { id: "working", label: "AI Generate", num: "2" },
          { id: "review", label: "Review & Route", num: "3" },
        ].map((p, i) => {
          const phases = ["brief", "working", "review", "success"];
          const currentIdx = phases.indexOf(phase);
          const phaseIdx = phases.indexOf(p.id);
          const isActive = phase === p.id || (phase === "success" && p.id === "review");
          const isDone = currentIdx > phaseIdx;
          return (
            <React.Fragment key={p.id}>
              {i > 0 && <div className={`sw__phase-line${isDone ? " sw__phase-line--done" : ""}`} />}
              <div className={`sw__phase${isActive ? " sw__phase--active" : ""}${isDone ? " sw__phase--done" : ""}`}>
                <span className="sw__phase-num">
                  {isDone ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : p.num}
                </span>
                <span className="sw__phase-label">{p.label}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Phase content */}
      <div className="sw__content">
        {phase === "brief" && (
          <BriefPhase
            data={brief}
            onChange={handleBriefChange}
            clients={clients}
            topics={topics}
            allOffices={allOffices}
            onGenerate={handleGenerate}
          />
        )}
        {phase === "working" && (
          <AIWorkingPhase
            brief={brief}
            clients={clients}
            topics={topics}
            allOffices={allOffices}
            onComplete={handleDraftComplete}
          />
        )}
        {phase === "review" && (
          <ReviewPhase
            draft={generatedDraft}
            brief={brief}
            clients={clients}
            topics={topics}
            allOffices={allOffices}
            onBack={handleStartOver}
            onSubmit={handleSubmit}
          />
        )}
        {phase === "success" && (
          <SuccessPhase brief={brief} allOffices={allOffices} />
        )}
      </div>
    </div>
  );
}
