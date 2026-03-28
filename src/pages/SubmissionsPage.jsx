import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFirmData } from "../hooks/useFirmData";
import "../styles/Submissions.css";

const SUBMISSION_TYPE_LABELS = {
  bill_language: "Bill Language",
  appropriations: "Appropriations",
  report_language: "Report Language",
  white_paper: "White Paper",
};

const SUBMISSION_TYPE_COLORS = {
  bill_language: "#8B5CF6",
  appropriations: "#3B82F6",
  report_language: "#F59E0B",
  white_paper: "#06B6D4",
};

const STATUS_COLORS = {
  draft: "#9CA3AF",
  review: "#D97706",
  submitted: "#3B82F6",
  approved: "#059669",
};

const AIGeneratingPanel = ({ isVisible, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const mockContent = `SEC. XXX. PERMANENT TELEHEALTH FLEXIBILITIES FOR RURAL COMMUNITIES.

(a) FINDINGS.—Congress finds that:
(1) Rural communities face persistent healthcare access challenges
(2) Telehealth has proven effective in expanding access to specialists
(3) Permanent flexibilities would improve healthcare outcomes`;

  useEffect(() => {
    if (!isVisible) {
      setDisplayedText("");
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index < mockContent.length) {
        setDisplayedText(mockContent.substring(0, index + 2));
        index += 2;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="ai-generating">
      <div className="ai-generating__content">
        <div className="ai-generating__header">
          <div className="ai-generating__spinner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2" />
              <path d="M22 12a10 10 0 1112-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="ai-generating__text">Generating draft with Claude AI...</p>
        </div>
        <div className="ai-generating__preview">
          <p>{displayedText}</p>
          {displayedText !== mockContent && <span className="cursor">|</span>}
        </div>
      </div>
    </div>
  );
};

const SubmissionDetailPanel = ({ submission, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerated, setShowGenerated] = useState(false);

  const topic = topics.find(t => t.id === submission.topicId);
  const client = clients.find(c => c.id === topic?.clientId);
  const office = offices.find(o => o.id === submission.officeId);

  const handleGenerateDraft = () => {
    setIsGenerating(true);
  };

  const handleGenerateComplete = () => {
    setIsGenerating(false);
    setShowGenerated(true);
  };

  return (
    <div className="submission-detail">
      <div className="submission-detail__overlay" onClick={onClose} />
      <div className="submission-detail__panel">
        <div className="submission-detail__header">
          <h2 className="submission-detail__title">{submission.title}</h2>
          <button className="submission-detail__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="submission-detail__container">
          <div className="submission-detail__left">
            <div className="editor-mockup">
              <div className="editor-toolbar">
                <button className="editor-btn" title="Bold">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M3 2h5a3 3 0 010 6H3V2zm0 7h6a3 3 0 010 6H3v-6z" />
                  </svg>
                </button>
                <button className="editor-btn" title="Italic">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5 2h8v1H7l2 8h6v1H5l-2-8H1V2z" />
                  </svg>
                </button>
                <button className="editor-btn" title="Underline">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M3 2v7a5 5 0 005 5 5 5 0 005-5V2M2 14h12" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                <div className="editor-divider" />
                <button className="editor-btn" title="List">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 3h12M2 7h12M2 11h12" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
              <div className="editor-content">
                {showGenerated ? (
                  <>
                    <strong>SEC. XXX. PERMANENT TELEHEALTH FLEXIBILITIES FOR RURAL COMMUNITIES.</strong>
                    <p>(a) FINDINGS.—Congress finds that:</p>
                    <p>(1) Rural communities face persistent healthcare access challenges</p>
                    <p>(2) Telehealth has proven effective in expanding access to specialists</p>
                    <p>(3) Permanent flexibilities would improve healthcare outcomes</p>
                    <p style={{ marginTop: "12px", fontSize: "12px", color: "#9CA3AF" }}>
                      [Content continues...]
                    </p>
                  </>
                ) : (
                  <div className="editor-placeholder">
                    <p>Submission content will appear here. Generate a draft to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="submission-detail__right">
            <div className="sidebar-section">
              <h4 className="sidebar-section__title">Metadata</h4>
              <div className="metadata-item">
                <span className="metadata-label">Client</span>
                <span className="metadata-value">{client?.name || "—"}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Topic</span>
                <span className="metadata-value">{topic?.name || "—"}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Office</span>
                <span className="metadata-value">{office?.name || "—"}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Type</span>
                <span className="metadata-badge" style={{ backgroundColor: SUBMISSION_TYPE_COLORS[submission.type] }}>
                  {SUBMISSION_TYPE_LABELS[submission.type]}
                </span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Status</span>
                <span className="metadata-badge" style={{ backgroundColor: STATUS_COLORS[submission.status] }}>
                  {submission.status}
                </span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Word Count</span>
                <span className="metadata-value">{submission.wordCount}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Version</span>
                <span className="metadata-value">v{submission.version}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Last Edited</span>
                <span className="metadata-value">
                  {new Date(submission.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="sidebar-section">
              <h4 className="sidebar-section__title">AI Actions</h4>
              <button
                className="ai-action-btn ai-action-btn--primary"
                onClick={handleGenerateDraft}
                disabled={isGenerating || showGenerated}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1v14M1 8h14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {isGenerating ? "Generating..." : showGenerated ? "Draft Generated" : "Generate Draft"}
              </button>
              <button className="ai-action-btn">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" opacity="0.7">
                  <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm0 2a6 6 0 100 12A6 6 0 008 2z" />
                </svg>
                Critique
              </button>
              <button className="ai-action-btn">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" opacity="0.7">
                  <path d="M8 1a7 7 0 110 14A7 7 0 018 1z" />
                </svg>
                Suggest Edits
              </button>
              <button className="ai-action-btn">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" opacity="0.7">
                  <path d="M2 1h12a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1z" />
                </svg>
                Summarize
              </button>
            </div>
          </div>
        </div>
      </div>

      <AIGeneratingPanel isVisible={isGenerating} onComplete={handleGenerateComplete} />
    </div>
  );
};

export default function SubmissionsPage() {
  const navigate = useNavigate();
  const { submissions, clients, topics, allOffices: offices } = useFirmData();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");

  const filteredSubmissions = submissions.filter(submission => {
    const matchesStatus = !statusFilter || submission.status === statusFilter;
    const matchesType = !typeFilter || submission.type === typeFilter;
    const topic = topics.find(t => t.id === submission.topicId);
    const client = clients.find(c => c.id === topic?.clientId);
    const matchesClient = !clientFilter || client?.id === clientFilter;
    return matchesStatus && matchesType && matchesClient;
  });

  const submissionTypes = [...new Set(submissions.map(s => s.type))];

  return (
    <div className="submissions-page">
      {/* Header */}
      <div className="submissions-header">
        <div className="submissions-header__left">
          <h1 className="submissions-header__title">LobbyFlow</h1>
          <span className="submissions-header__badge">{filteredSubmissions.length}</span>
        </div>
        <button className="btn btn--primary" onClick={() => navigate("/app/submissions/new")}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New Submission
        </button>
      </div>

      {/* Filters */}
      <div className="submissions-filters">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="review">In Review</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
        </select>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          {submissionTypes.map(type => (
            <option key={type} value={type}>
              {SUBMISSION_TYPE_LABELS[type]}
            </option>
          ))}
        </select>

        <select
          value={clientFilter}
          onChange={e => setClientFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Clients</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="submissions-table-container">
        <table className="submissions-table">
          <thead>
            <tr>
              <th className="th-title">Title</th>
              <th className="th-client">Client</th>
              <th className="th-type">Type</th>
              <th className="th-office">Target Office</th>
              <th className="th-status">Status</th>
              <th className="th-updated">Last Updated</th>
              <th className="th-ai">AI</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map(submission => {
              const topic = topics.find(t => t.id === submission.topicId);
              const client = clients.find(c => c.id === topic?.clientId);
              const office = offices.find(o => o.id === submission.officeId);

              return (
                <tr
                  key={submission.id}
                  className="submissions-table__row"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <td className="td-title">
                    <div className="submission-title-cell">
                      <p className="submission-title">{submission.title}</p>
                      <p className="submission-topic">{topic?.name || "—"}</p>
                    </div>
                  </td>
                  <td className="td-client">
                    <span className="submission-client">{client?.name || "—"}</span>
                  </td>
                  <td className="td-type">
                    <span
                      className="type-badge"
                      style={{ backgroundColor: SUBMISSION_TYPE_COLORS[submission.type] }}
                    >
                      {SUBMISSION_TYPE_LABELS[submission.type]}
                    </span>
                  </td>
                  <td className="td-office">
                    <span className="office-cell">{office?.name || "—"}</span>
                  </td>
                  <td className="td-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: STATUS_COLORS[submission.status] }}
                    >
                      {submission.status}
                    </span>
                  </td>
                  <td className="td-updated">
                    <span className="updated-date">
                      {new Date(submission.updatedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="td-ai">
                    {submission.aiGenerated && (
                      <div className="ai-icon" title="Generated with AI">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm0 2a5 5 0 100 10A5 5 0 008 3z" />
                        </svg>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Panel */}
      {selectedSubmission && (
        <SubmissionDetailPanel
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
}
