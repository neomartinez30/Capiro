import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFirmData } from "../hooks/useFirmData";
import senators, { getSenatorFields, getSenatorSpecificFields } from "../data/senatorForms";
import * as api from "../services/api";
import "../styles/SubmissionWizard.css";

/* ═══════════════════════════════════════════════════════════════
   CDS Submission Wizard — 8-Stage Agentic Workflow

   1. Select Client       → Pick from LDA-synced clients
   2. Upload Documents    → Supporting docs about the client
   3. Select Topic        → Choose policy topic for submission
   4. White Paper         → Collaborative AI-assisted white paper
   5. Select Offices      → Pick senator offices, download NDAA form
   6. Fill Form           → Agentic form-filling with Bedrock Claude
   7. Add Language        → Insert white paper "language" into form
   8. Review & Submit     → Final review by user
   ═══════════════════════════════════════════════════════════════ */

const STAGES = [
  { id: 1, key: "client",    label: "Select Client",    short: "Client" },
  { id: 2, key: "docs",      label: "Upload Documents", short: "Docs" },
  { id: 3, key: "topic",     label: "Select Topic",     short: "Topic" },
  { id: 4, key: "paper",     label: "White Paper",      short: "Paper" },
  { id: 5, key: "offices",   label: "Select Offices",   short: "Offices" },
  { id: 6, key: "fill",      label: "Fill Form",        short: "Fill" },
  { id: 7, key: "language",  label: "Add Language",      short: "Language" },
  { id: 8, key: "review",    label: "Review & Submit",   short: "Review" },
];

const FILE_TYPES = [
  { ext: "pdf", label: "PDF" },
  { ext: "pptx", label: "PowerPoint" },
  { ext: "docx", label: "Word" },
  { ext: "xlsx", label: "Excel" },
  { ext: "csv", label: "CSV" },
  { ext: "txt", label: "Text" },
];

// ═══════════════════════════════════════════════════════════════
// Stage 1: SELECT CLIENT
// ═══════════════════════════════════════════════════════════════
function SelectClientStage({ clients, selectedClient, onSelectClient, onNext }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.clientId?.toString().includes(q)
    );
  }, [clients, search]);

  return (
    <div className="sw-stage">
      <div className="sw-stage__header">
        <h2>Select Client</h2>
        <p>Choose the client you are submitting a CDS request on behalf of.</p>
      </div>

      <div className="sw-field">
        <input
          className="sw-field__input"
          type="text"
          placeholder="Search clients by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="sw-empty">
          <p>No clients found. Add clients from the Entities page first.</p>
        </div>
      ) : (
        <div className="sw-client-list">
          {filtered.map((client) => (
            <button
              key={client.id || client.clientId}
              className={`sw-client-card${selectedClient?.id === client.id ? " sw-client-card--selected" : ""}`}
              onClick={() => onSelectClient(client)}
            >
              <div className="sw-client-card__info">
                <strong>{client.name}</strong>
                {client.industry && (
                  <span className="sw-client-card__industry">{client.industry}</span>
                )}
                {client.state && (
                  <span className="sw-client-card__meta">{client.state}</span>
                )}
              </div>
              <div className="sw-client-card__check">
                {selectedClient?.id === client.id && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="sw-stage__nav">
        <span />
        <button
          className="sw-btn sw-btn--primary"
          disabled={!selectedClient}
          onClick={onNext}
        >
          Continue with {selectedClient?.name || "Client"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Stage 2: UPLOAD DOCUMENTS
// ═══════════════════════════════════════════════════════════════
function UploadDocumentsStage({ uploadedFiles, onUpdateFiles, onNext, onBack }) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map((f) => ({
      id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      size: f.size,
      type: f.type,
      ext: f.name.split(".").pop().toLowerCase(),
      file: f,
    }));
    onUpdateFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (id) => {
    onUpdateFiles(uploadedFiles.filter((f) => f.id !== id));
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="sw-stage">
      <div className="sw-stage__header">
        <h2>Upload Supporting Documents</h2>
        <p>
          Upload documents about your client — project briefs, budgets, prior submissions,
          letters of support, or any relevant materials.
        </p>
      </div>

      <div
        className={`sw-dropzone${dragOver ? " sw-dropzone--active" : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <div className="sw-dropzone__icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <p className="sw-dropzone__text">Drop files here or click to browse</p>
        <p className="sw-dropzone__hint">PDF, Word, Excel, PowerPoint, CSV, or Text</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.pptx,.ppt,.txt"
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="sw-file-list">
          {uploadedFiles.map((f) => (
            <div key={f.id} className="sw-file-item">
              <span className={`sw-file-icon sw-file-icon--${f.ext}`}>
                {f.ext?.toUpperCase().slice(0, 4)}
              </span>
              <span className="sw-file-name">{f.name}</span>
              <span className="sw-file-size">{formatSize(f.size)}</span>
              <button className="sw-file-remove" onClick={() => removeFile(f.id)}>×</button>
            </div>
          ))}
        </div>
      )}

      <div className="sw-stage__nav">
        <button className="sw-btn sw-btn--ghost" onClick={onBack}>Back</button>
        <button className="sw-btn sw-btn--primary" onClick={onNext}>
          Continue{uploadedFiles.length > 0 ? ` with ${uploadedFiles.length} file${uploadedFiles.length !== 1 ? "s" : ""}` : ""}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Stage 3: SELECT TOPIC
// ═══════════════════════════════════════════════════════════════
function SelectTopicStage({ topics, selectedClient, selectedTopic, onSelectTopic, saveItem, onNext, onBack }) {
  const [customTopic, setCustomTopic] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filter topics relevant to selected client — show all if none match
  const clientTopics = useMemo(() => {
    if (!selectedClient) return topics;
    const matched = topics.filter(
      (t) => !t.clientId || t.clientId === selectedClient.id || t.clientId === selectedClient.clientId
    );
    return matched.length > 0 ? matched : topics;
  }, [topics, selectedClient]);

  const handleCreateCustom = async () => {
    if (!customTopic.trim()) return;
    setSaving(true);
    const newTopic = {
      id: `topic_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: customTopic.trim(),
      description: customDescription.trim(),
      clientId: selectedClient?.id || null,
      issueCode: "CUSTOM",
      generalIssueCode: "CUSTOM",
      status: "drafting",
      targetOffices: [],
      isCustom: true,
    };

    // Persist to DynamoDB if saveItem is available
    if (saveItem) {
      try {
        await saveItem("topic", newTopic);
      } catch (err) {
        console.error("Failed to save topic:", err);
      }
    }

    onSelectTopic(newTopic);
    setShowCustom(false);
    setCustomTopic("");
    setCustomDescription("");
    setSaving(false);
  };

  return (
    <div className="sw-stage">
      <div className="sw-stage__header">
        <h2>Select Topic</h2>
        <p>Choose the policy topic or issue area for this CDS submission.</p>
      </div>

      {clientTopics.length > 0 ? (
        <div className="sw-topic-list">
          {clientTopics.map((topic) => (
            <button
              key={topic.id}
              className={`sw-topic-card${selectedTopic?.id === topic.id ? " sw-topic-card--selected" : ""}`}
              onClick={() => onSelectTopic(topic)}
            >
              <div className="sw-topic-card__code">
                {topic.issueCode || topic.generalIssueCode || "—"}
              </div>
              <div className="sw-topic-card__info">
                <strong>{topic.name || topic.description || "Untitled Topic"}</strong>
                {topic.description && topic.name && (
                  <span className="sw-topic-card__desc">{topic.description}</span>
                )}
              </div>
              {selectedTopic?.id === topic.id && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="sw-empty">
          <p>No topics found for this client. Create one below to get started.</p>
        </div>
      )}

      {!showCustom ? (
        <button
          className="sw-btn sw-btn--ghost"
          style={{ marginTop: 16 }}
          onClick={() => setShowCustom(true)}
        >
          + Create new topic
        </button>
      ) : (
        <div className="sw-custom-topic">
          <div className="sw-field" style={{ marginBottom: 12 }}>
            <label className="sw-field__label">Topic Name</label>
            <input
              className="sw-field__input"
              placeholder="e.g., Healthcare Infrastructure, Defense R&D"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              autoFocus
            />
          </div>
          <div className="sw-field" style={{ marginBottom: 12 }}>
            <label className="sw-field__label">Description (optional)</label>
            <textarea
              className="sw-field__textarea"
              placeholder="Brief description of the policy issue..."
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="sw-btn sw-btn--primary sw-btn--sm"
              onClick={handleCreateCustom}
              disabled={!customTopic.trim() || saving}
            >
              {saving ? "Saving..." : "Create & Select Topic"}
            </button>
            <button className="sw-btn sw-btn--ghost sw-btn--sm" onClick={() => setShowCustom(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="sw-stage__nav">
        <button className="sw-btn sw-btn--ghost" onClick={onBack}>Back</button>
        <button
          className="sw-btn sw-btn--primary"
          disabled={!selectedTopic}
          onClick={onNext}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Stage 4: WHITE PAPER (Collaborative AI-assisted)
// ═══════════════════════════════════════════════════════════════

// Simulated online team members
const TEAM_MEMBERS = [
  { id: 1, name: "You", initials: "YO", color: "#3A6FF7", online: true },
  { id: 2, name: "Sarah Chen", initials: "SC", color: "#059669", online: true },
  { id: 3, name: "Marcus Wright", initials: "MW", color: "#D97706", online: true },
  { id: 4, name: "Elena Vasquez", initials: "EV", color: "#9333EA", online: false },
  { id: 5, name: "James Park", initials: "JP", color: "#DC2626", online: false },
];

function WhitePaperStage({ selectedClient, selectedTopic, uploadedFiles, whitePaper, onUpdateWhitePaper, onNext, onBack }) {
  const [generating, setGenerating] = useState(false);
  const [agentMessages, setAgentMessages] = useState([]);
  const [comments, setComments] = useState([]);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState(null);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const chatEndRef = useRef(null);
  const editorRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [agentMessages]);

  // Track text selection in the editor for commenting
  const handleTextSelect = () => {
    const textarea = editorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start !== end) {
      setSelectedText(textarea.value.substring(start, end));
      setSelectionRange({ start, end });
    }
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: `cmt_${Date.now()}`,
      author: TEAM_MEMBERS[0],
      text: newComment.trim(),
      selectedText: selectedText || null,
      range: selectionRange,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      resolved: false,
      replies: [],
    };
    setComments((prev) => [...prev, comment]);
    setNewComment("");
    setShowCommentInput(false);
    setSelectedText("");
    setSelectionRange(null);
  };

  const addReply = (commentId) => {
    if (!replyText.trim()) return;
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: `reply_${Date.now()}`,
                  author: TEAM_MEMBERS[0],
                  text: replyText.trim(),
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              ],
            }
          : c
      )
    );
    setReplyText("");
  };

  const resolveComment = (commentId) => {
    setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, resolved: true } : c)));
  };

  // Toolbar formatting actions
  const execFormat = (prefix, suffix) => {
    const textarea = editorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = whitePaper || "";
    const before = text.substring(0, start);
    const selected = text.substring(start, end) || "text";
    const after = text.substring(end);
    const newText = before + prefix + selected + (suffix || "") + after;
    onUpdateWhitePaper(newText);
    // Refocus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  const execLine = (prefix) => {
    const textarea = editorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const text = whitePaper || "";
    // Find start of current line
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    const lineEnd = text.indexOf("\n", start);
    const end = lineEnd === -1 ? text.length : lineEnd;
    const line = text.substring(lineStart, end);
    // Remove existing heading/list prefix
    const cleaned = line.replace(/^#{1,6}\s|^[-*]\s|^>\s|^\d+\.\s/, "");
    const newText = text.substring(0, lineStart) + prefix + cleaned + text.substring(end);
    onUpdateWhitePaper(newText);
  };

  const generateDraft = async () => {
    setGenerating(true);
    setAgentMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Analyzing your documents and generating a white paper draft..." },
    ]);

    await new Promise((r) => setTimeout(r, 2000));

    const clientName = selectedClient?.name || "the client";
    const topicName = selectedTopic?.name || selectedTopic?.description || "the selected topic";
    const fileNames = uploadedFiles.map((f) => f.name).join(", ");

    const draft = `# ${topicName} — CDS White Paper\n\n## Executive Summary\n\nThis white paper outlines the case for Congressionally Directed Spending in support of ${clientName}'s initiative on ${topicName}. The proposal addresses critical community needs and aligns with federal funding priorities.\n\n## Background & Need\n\n[Based on the uploaded documents${fileNames ? ` (${fileNames})` : ""}, describe the current situation, gap analysis, and community need here.]\n\n## Proposed Solution\n\n[Detail the specific project, program, or initiative that will address the identified need. Include scope, timeline, and key deliverables.]\n\n## Budget & Funding Request\n\n[Provide a detailed budget breakdown. Include matching funds from state, local, or private sources if applicable.]\n\n## Community Impact\n\n[Quantify the expected impact — jobs created, population served, economic multiplier, etc.]\n\n## Organizational Capacity\n\n${clientName} has demonstrated capacity to execute projects of this nature. [Include relevant track record, prior federal funding, and organizational qualifications.]\n\n## Supporting Evidence\n\n[Reference the uploaded supporting documents and any additional data points that strengthen the case.]\n`;

    onUpdateWhitePaper(draft);
    setAgentMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "I've generated a structured white paper draft based on your client, topic, and uploaded documents. You can edit it directly in the editor below, or ask me to refine specific sections.",
      },
    ]);
    setGenerating(false);
  };

  const handleChatMessage = async (message) => {
    setAgentMessages((prev) => [...prev, { role: "user", content: message }]);
    setGenerating(true);

    await new Promise((r) => setTimeout(r, 1500));

    setAgentMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `I've noted your feedback: "${message}". In the live version, I'll refine the white paper based on your input using Claude on Bedrock. For now, please edit the document directly.`,
      },
    ]);
    setGenerating(false);
  };

  const onlineMembers = TEAM_MEMBERS.filter((m) => m.online);
  const offlineMembers = TEAM_MEMBERS.filter((m) => !m.online);
  const unresolvedComments = comments.filter((c) => !c.resolved);

  return (
    <div className="sw-stage">
      <div className="sw-stage__header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h2>Create White Paper</h2>
          <p>
            Collaborate with AI to build a compelling white paper for your CDS submission.
            This document's "language" will be inserted into the final form.
          </p>
        </div>
        {/* Online Team Members */}
        <div className="sw-team-presence">
          <div className="sw-team-avatars">
            {onlineMembers.map((m) => (
              <div key={m.id} className="sw-team-avatar sw-team-avatar--online" title={`${m.name} (online)`} style={{ background: m.color }}>
                {m.initials}
                <span className="sw-team-avatar__status" />
              </div>
            ))}
            {offlineMembers.map((m) => (
              <div key={m.id} className="sw-team-avatar sw-team-avatar--offline" title={`${m.name} (offline)`} style={{ background: m.color }}>
                {m.initials}
              </div>
            ))}
          </div>
          <span className="sw-team-count">{onlineMembers.length} online</span>
        </div>
      </div>

      <div className="sw-paper-layout">
        {/* Editor pane */}
        <div className="sw-paper-editor">
          {/* MS Word-style toolbar */}
          <div className="sw-paper-editor__toolbar sw-word-toolbar">
            <div className="sw-word-toolbar__group">
              <button className="sw-word-toolbar__btn" title="Bold" onClick={() => execFormat("**", "**")}>
                <strong>B</strong>
              </button>
              <button className="sw-word-toolbar__btn" title="Italic" onClick={() => execFormat("*", "*")}>
                <em>I</em>
              </button>
              <button className="sw-word-toolbar__btn" title="Underline" onClick={() => execFormat("<u>", "</u>")}>
                <span style={{ textDecoration: "underline" }}>U</span>
              </button>
              <button className="sw-word-toolbar__btn" title="Strikethrough" onClick={() => execFormat("~~", "~~")}>
                <span style={{ textDecoration: "line-through" }}>S</span>
              </button>
            </div>
            <div className="sw-word-toolbar__sep" />
            <div className="sw-word-toolbar__group">
              <button className="sw-word-toolbar__btn" title="Heading 1" onClick={() => execLine("# ")}>
                H1
              </button>
              <button className="sw-word-toolbar__btn" title="Heading 2" onClick={() => execLine("## ")}>
                H2
              </button>
              <button className="sw-word-toolbar__btn" title="Heading 3" onClick={() => execLine("### ")}>
                H3
              </button>
            </div>
            <div className="sw-word-toolbar__sep" />
            <div className="sw-word-toolbar__group">
              <button className="sw-word-toolbar__btn" title="Bullet List" onClick={() => execLine("- ")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1.5" fill="currentColor"/><circle cx="3" cy="12" r="1.5" fill="currentColor"/><circle cx="3" cy="18" r="1.5" fill="currentColor"/></svg>
              </button>
              <button className="sw-word-toolbar__btn" title="Numbered List" onClick={() => execLine("1. ")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="2" y="8" fontSize="8" fill="currentColor" stroke="none" fontWeight="700">1</text><text x="2" y="14" fontSize="8" fill="currentColor" stroke="none" fontWeight="700">2</text><text x="2" y="20" fontSize="8" fill="currentColor" stroke="none" fontWeight="700">3</text></svg>
              </button>
              <button className="sw-word-toolbar__btn" title="Block Quote" onClick={() => execLine("> ")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="3" x2="3" y2="21"/><line x1="9" y1="8" x2="21" y2="8"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="16" x2="17" y2="16"/></svg>
              </button>
            </div>
            <div className="sw-word-toolbar__sep" />
            <div className="sw-word-toolbar__group">
              <button
                className={`sw-word-toolbar__btn sw-word-toolbar__btn--comment${showCommentInput ? " sw-word-toolbar__btn--active" : ""}`}
                title={selectedText ? "Comment on selection" : "Add Comment"}
                onClick={() => setShowCommentInput(!showCommentInput)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>
            <div style={{ flex: 1 }} />
            <div className="sw-word-toolbar__group">
              <span className="sw-paper-editor__title">White Paper Draft</span>
              {!whitePaper && (
                <button
                  className="sw-btn sw-btn--primary sw-btn--sm"
                  onClick={generateDraft}
                  disabled={generating}
                  style={{ marginLeft: 8 }}
                >
                  {generating ? (
                    <span className="sw-btn__loading"><span className="sw-spinner sw-spinner--sm" /> Generating...</span>
                  ) : (
                    "Generate Draft with AI"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Comment input bar (shown when comment toolbar button is active) */}
          {showCommentInput && (
            <div className="sw-comment-input-bar">
              {selectedText && (
                <div className="sw-comment-input-bar__selection">
                  Commenting on: <em>"{selectedText.length > 60 ? selectedText.substring(0, 60) + "..." : selectedText}"</em>
                </div>
              )}
              <div className="sw-comment-input-bar__row">
                <input
                  className="sw-field__input"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addComment(); }}
                  autoFocus
                />
                <button className="sw-btn sw-btn--primary sw-btn--sm" onClick={addComment} disabled={!newComment.trim()}>
                  Comment
                </button>
                <button className="sw-btn sw-btn--ghost sw-btn--sm" onClick={() => { setShowCommentInput(false); setNewComment(""); }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <textarea
            ref={editorRef}
            className="sw-paper-editor__textarea"
            value={whitePaper || ""}
            onChange={(e) => onUpdateWhitePaper(e.target.value)}
            onMouseUp={handleTextSelect}
            onKeyUp={handleTextSelect}
            placeholder="Click 'Generate Draft with AI' to create an initial draft, or start writing here..."
            rows={20}
          />
          {whitePaper && (
            <div className="sw-paper-editor__stats">
              {whitePaper.split(/\s+/).filter(Boolean).length} words · {whitePaper.length} characters · {unresolvedComments.length} comment{unresolvedComments.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Right side: Comments panel + Chat */}
        <div className="sw-paper-right">
          {/* Comments Panel */}
          {comments.length > 0 && (
            <div className="sw-comments-panel">
              <div className="sw-comments-panel__header">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Comments ({unresolvedComments.length})
              </div>
              <div className="sw-comments-panel__list">
                {comments.filter((c) => !c.resolved).map((comment) => (
                  <div
                    key={comment.id}
                    className={`sw-comment-thread${activeCommentId === comment.id ? " sw-comment-thread--active" : ""}`}
                    onClick={() => setActiveCommentId(activeCommentId === comment.id ? null : comment.id)}
                  >
                    <div className="sw-comment-thread__head">
                      <div className="sw-comment-author" style={{ background: comment.author.color }}>
                        {comment.author.initials}
                      </div>
                      <div className="sw-comment-thread__meta">
                        <strong>{comment.author.name}</strong>
                        <span>{comment.timestamp}</span>
                      </div>
                      <button
                        className="sw-comment-resolve-btn"
                        title="Resolve"
                        onClick={(e) => { e.stopPropagation(); resolveComment(comment.id); }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </button>
                    </div>
                    {comment.selectedText && (
                      <div className="sw-comment-thread__quote">"{comment.selectedText.length > 80 ? comment.selectedText.substring(0, 80) + "..." : comment.selectedText}"</div>
                    )}
                    <div className="sw-comment-thread__body">{comment.text}</div>

                    {/* Replies */}
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="sw-comment-reply">
                        <div className="sw-comment-reply__head">
                          <div className="sw-comment-author sw-comment-author--sm" style={{ background: reply.author.color }}>
                            {reply.author.initials}
                          </div>
                          <strong>{reply.author.name}</strong>
                          <span>{reply.timestamp}</span>
                        </div>
                        <div className="sw-comment-reply__body">{reply.text}</div>
                      </div>
                    ))}

                    {/* Reply input (shown when thread is active) */}
                    {activeCommentId === comment.id && (
                      <div className="sw-comment-reply-input" onClick={(e) => e.stopPropagation()}>
                        <input
                          className="sw-field__input"
                          placeholder="Reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") addReply(comment.id); }}
                        />
                        <button className="sw-btn sw-btn--primary sw-btn--sm" onClick={() => addReply(comment.id)} disabled={!replyText.trim()}>
                          Reply
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat pane */}
          <div className="sw-paper-chat">
            <div className="sw-paper-chat__header">AI Assistant</div>
            <div className="sw-paper-chat__messages">
              <div className="sw-chat-msg sw-chat-msg--assistant">
                <p>I can help you write and refine this white paper. Generate a draft to get started, then ask me to improve specific sections.</p>
              </div>
              {agentMessages.map((msg, i) => (
                <div key={i} className={`sw-chat-msg sw-chat-msg--${msg.role}`}>
                  <p>{msg.content}</p>
                </div>
              ))}
              {generating && (
                <div className="sw-chat-msg sw-chat-msg--assistant">
                  <span className="sw-spinner sw-spinner--sm" />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <ChatInput onSend={handleChatMessage} disabled={generating} placeholder="Ask AI to refine the paper..." />
          </div>
        </div>
      </div>

      <div className="sw-stage__nav">
        <button className="sw-btn sw-btn--ghost" onClick={onBack}>Back</button>
        <button
          className="sw-btn sw-btn--primary"
          disabled={!whitePaper?.trim()}
          onClick={onNext}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Stage 5: SELECT OFFICES
// ═══════════════════════════════════════════════════════════════
function SelectOfficesStage({ selectedSenators, onUpdateSenators, allOffices, onNext, onBack }) {
  const [search, setSearch] = useState("");
  const [partyFilter, setPartyFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("");

  const states = useMemo(() => [...new Set(senators.map((s) => s.state))].sort(), []);

  const filtered = useMemo(() => {
    let list = senators;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.state.toLowerCase().includes(q) || s.committee?.toLowerCase().includes(q)
      );
    }
    if (partyFilter !== "all") {
      list = list.filter((s) => s.party === partyFilter);
    }
    if (stateFilter) {
      list = list.filter((s) => s.state === stateFilter);
    }
    return list;
  }, [search, partyFilter, stateFilter]);

  const toggleSenator = (id) => {
    onUpdateSenators(
      selectedSenators.includes(id)
        ? selectedSenators.filter((s) => s !== id)
        : [...selectedSenators, id]
    );
  };

  return (
    <div className="sw-stage">
      <div className="sw-stage__header">
        <h2>Select Senate Offices</h2>
        <p>
          Choose which senator offices to submit CDS/NDAA forms to.
          Each office may have unique form requirements and deadlines.
        </p>
      </div>

      {/* Filters */}
      <div className="sw-filter-bar">
        <input
          className="sw-field__input"
          style={{ flex: 1, maxWidth: 280 }}
          placeholder="Search senators..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="sw-filter-pills">
          {["all", "D", "R"].map((p) => (
            <button
              key={p}
              className={`sw-pill sw-pill--sm${partyFilter === p ? " sw-pill--active" : ""}`}
              onClick={() => setPartyFilter(p)}
            >
              {p === "all" ? "All" : p === "D" ? "Democrat" : "Republican"}
            </button>
          ))}
        </div>
        <select
          className="sw-field__select"
          style={{ width: 120 }}
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
        >
          <option value="">All States</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Senator grid */}
      <div className="sw-senator-grid">
        {filtered.map((senator) => {
          const isSelected = selectedSenators.includes(senator.id);
          const daysUntil = Math.ceil((new Date(senator.deadline) - new Date()) / 86400000);
          return (
            <button
              key={senator.id}
              className={`sw-senator-card${isSelected ? " sw-senator-card--selected" : ""}${daysUntil < 0 ? " sw-senator-card--expired" : ""}`}
              onClick={() => toggleSenator(senator.id)}
            >
              <div className="sw-senator-card__top">
                <span className={`sw-party-dot sw-party-dot--${senator.party}`} />
                <span className="sw-senator-card__name">{senator.name}</span>
                <span className={`sw-senator-card__checkbox${isSelected ? " sw-senator-card__checkbox--checked" : ""}`}>
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </span>
              </div>
              <div className="sw-senator-card__meta">
                <span>{senator.state}</span>
                <span>{senator.committee}</span>
              </div>
              <div className="sw-senator-card__bottom">
                <span className={`sw-badge ${daysUntil <= 5 ? "sw-badge--red" : daysUntil <= 14 ? "sw-badge--yellow" : "sw-badge--green"}`}>
                  {daysUntil < 0 ? "Expired" : daysUntil === 0 ? "Due today" : `${daysUntil}d left`}
                </span>
                <span className="sw-senator-card__method">
                  {senator.submissionMethod === "web_form" ? "Web form" : senator.submissionMethod === "pdf_upload" ? "PDF" : "Email"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedSenators.length > 0 && (
        <div className="sw-selection-summary">
          <strong>{selectedSenators.length}</strong> office{selectedSenators.length !== 1 ? "s" : ""} selected
        </div>
      )}

      <div className="sw-stage__nav">
        <button className="sw-btn sw-btn--ghost" onClick={onBack}>Back</button>
        <button
          className="sw-btn sw-btn--primary"
          disabled={selectedSenators.length === 0}
          onClick={onNext}
        >
          Continue with {selectedSenators.length} Office{selectedSenators.length !== 1 ? "s" : ""}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Stage 6: FILL FORM (Agentic — Bedrock Claude)
// ═══════════════════════════════════════════════════════════════
function FillFormStage({ selectedClient, selectedTopic, selectedSenators, uploadedFiles, whitePaper, formData, onUpdateFormData, onNext, onBack }) {
  const [agentSessionId, setAgentSessionId] = useState(null);
  const [agentMessages, setAgentMessages] = useState([]);
  const [filling, setFilling] = useState(false);
  const [fillProgress, setFillProgress] = useState(0);
  const [activeSenator, setActiveSenator] = useState(selectedSenators[0] || null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [agentMessages]);

  const selectedSenatorObjects = useMemo(
    () => senators.filter((s) => selectedSenators.includes(s.id)),
    [selectedSenators]
  );

  // Start auto-fill process
  const startAutoFill = async () => {
    setFilling(true);
    setFillProgress(0);
    setAgentMessages([
      { role: "assistant", type: "thinking", content: "Starting agentic form fill..." },
    ]);

    try {
      // Attempt to call the real Bedrock agent backend
      const response = await api.startAgentSession({
        client: selectedClient,
        topic: selectedTopic,
        senators: selectedSenatorObjects.map((s) => ({ id: s.id, name: s.name, state: s.state })),
        documents: uploadedFiles.map((f) => f.name),
        whitePaper: whitePaper?.substring(0, 2000),
      });

      if (response?.session_id) {
        setAgentSessionId(response.session_id);
        processAgentResponse(response);
        return;
      }
    } catch (err) {
      console.log("Agent backend not available, using simulated fill:", err.message);
    }

    // Simulated auto-fill when backend isn't running
    await simulateAutoFill();
  };

  const processAgentResponse = (response) => {
    // Process tool calls
    if (response.tool_calls?.length) {
      response.tool_calls.forEach((tc) => {
        setAgentMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "tool_call",
            tool: tc.tool,
            content: `Calling ${tc.tool}...`,
          },
        ]);
      });
    }

    // Process tool results
    if (response.tool_results?.length) {
      response.tool_results.forEach((tr) => {
        setAgentMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "tool_result",
            tool: tr.tool,
            content: typeof tr.result === "string" ? tr.result.substring(0, 200) : JSON.stringify(tr.result).substring(0, 200),
          },
        ]);
      });
    }

    // Update form data
    if (response.form_data) {
      onUpdateFormData((prev) => ({ ...prev, ...response.form_data }));
    }

    // Agent message
    if (response.agent_response) {
      setAgentMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.agent_response },
      ]);
    }

    // Handle questions
    if (response.needs_user_input && response.questions?.length) {
      response.questions.forEach((q) => {
        setAgentMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "question",
            content: q.question || q,
            suggestions: q.suggestions || [],
          },
        ]);
      });
    }

    setFilling(false);
    setFillProgress(100);
  };

  const simulateAutoFill = async () => {
    const totalSenators = selectedSenatorObjects.length;

    for (let i = 0; i < totalSenators; i++) {
      const senator = selectedSenatorObjects[i];
      const pct = Math.round(((i + 1) / totalSenators) * 100);
      setFillProgress(pct);

      setAgentMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "tool_call",
          tool: "browse_senator_website",
          content: `Checking ${senator.name}'s CDS form requirements...`,
        },
      ]);

      await new Promise((r) => setTimeout(r, 800));

      // Generate auto-fill data
      const fields = getSenatorFields(senator.id);
      const senatorFormData = {};
      fields.forEach((field) => {
        const fill = generateAutoFill(field, selectedClient, selectedTopic);
        senatorFormData[field.id] = fill;
      });

      onUpdateFormData((prev) => ({
        ...prev,
        [senator.id]: senatorFormData,
      }));

      setAgentMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Filled ${fields.length} fields for ${senator.name} (${senator.state}).`,
        },
      ]);

      await new Promise((r) => setTimeout(r, 400));
    }

    setAgentMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Auto-fill complete for ${totalSenators} senator form${totalSenators !== 1 ? "s" : ""}. Review the fields below and edit as needed, or ask me to refine specific answers.`,
      },
    ]);

    setFilling(false);
  };

  const sendAgentMessage = async (message) => {
    setAgentMessages((prev) => [...prev, { role: "user", content: message }]);
    setFilling(true);

    if (agentSessionId) {
      try {
        const response = await api.sendAgentMessage({
          session_id: agentSessionId,
          message,
        });
        processAgentResponse(response);
        return;
      } catch (err) {
        console.log("Agent message failed:", err.message);
      }
    }

    // Simulated response
    await new Promise((r) => setTimeout(r, 1000));
    setAgentMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `I've noted your request: "${message}". In the live version with Bedrock, I'll update the form fields accordingly. For now, please edit the fields directly below.`,
      },
    ]);
    setFilling(false);
  };

  // Editable form fields for active senator
  const activeFields = activeSenator ? getSenatorFields(activeSenator) : [];
  const activeFormData = formData[activeSenator] || {};

  const handleFieldEdit = (fieldId, value) => {
    onUpdateFormData((prev) => ({
      ...prev,
      [activeSenator]: {
        ...(prev[activeSenator] || {}),
        [fieldId]: {
          ...(prev[activeSenator]?.[fieldId] || {}),
          value,
          confidence: 100,
          source: "Manual edit",
        },
      },
    }));
  };

  return (
    <div className="sw-stage">
      <div className="sw-stage__header">
        <h2>Fill CDS Form</h2>
        <p>The AI agent will analyze your documents and fill each senator's form automatically.</p>
      </div>

      <div className="sw-fill-layout">
        {/* Agent chat */}
        <div className="sw-fill-chat">
          <div className="sw-paper-chat__header">
            AI Form Agent
            {filling && <span className="sw-spinner sw-spinner--sm" style={{ marginLeft: 8 }} />}
          </div>
          <div className="sw-paper-chat__messages">
            <div className="sw-chat-msg sw-chat-msg--assistant">
              <p>I'll fill out the CDS forms using your client data, topic details, and uploaded documents. Click "Start Auto-Fill" to begin.</p>
            </div>
            {agentMessages.map((msg, i) => (
              <div key={i} className={`sw-chat-msg sw-chat-msg--${msg.role}${msg.type ? ` sw-chat-msg--${msg.type}` : ""}`}>
                {msg.type === "tool_call" && (
                  <span className="sw-chat-tool-badge">{msg.tool}</span>
                )}
                <p>{msg.content}</p>
                {msg.suggestions?.length > 0 && (
                  <div className="sw-chat-suggestions">
                    {msg.suggestions.map((s, j) => (
                      <button key={j} className="sw-btn sw-btn--sm" onClick={() => sendAgentMessage(s)}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {filling && (
              <div className="sw-chat-msg sw-chat-msg--assistant">
                <span className="sw-spinner sw-spinner--sm" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <ChatInput onSend={sendAgentMessage} disabled={filling} placeholder="Ask the agent to update fields..." />
        </div>

        {/* Form pane */}
        <div className="sw-fill-form">
          {/* Start button or progress */}
          {fillProgress === 0 && !filling && Object.keys(formData).length === 0 && (
            <div className="sw-fill-start">
              <button className="sw-btn sw-btn--primary sw-btn--lg" onClick={startAutoFill}>
                Start Auto-Fill
              </button>
            </div>
          )}

          {(fillProgress > 0 || Object.keys(formData).length > 0) && (
            <>
              {/* Senator tabs */}
              {selectedSenatorObjects.length > 1 && (
                <div className="sw-tabs sw-tabs--compact">
                  {selectedSenatorObjects.map((s) => (
                    <button
                      key={s.id}
                      className={`sw-tab${activeSenator === s.id ? " sw-tab--active" : ""}`}
                      onClick={() => setActiveSenator(s.id)}
                    >
                      <span className={`sw-party-dot sw-party-dot--${s.party}`} />
                      {s.name.replace("Sen. ", "")}
                    </button>
                  ))}
                </div>
              )}

              {/* Progress bar */}
              {filling && (
                <div className="sw-progress">
                  <div className="sw-progress__bar">
                    <div className="sw-progress__fill" style={{ width: `${fillProgress}%` }} />
                  </div>
                  <span className="sw-progress__text">{fillProgress}%</span>
                </div>
              )}

              {/* Fields */}
              <div className="sw-form-fields">
                {activeFields.map((field) => {
                  const fill = activeFormData[field.id] || {};
                  return (
                    <div key={field.id} className="sw-form-field">
                      <div className="sw-form-field__header">
                        <label className="sw-field__label">
                          {field.label}
                          {field.required && <span className="sw-required">*</span>}
                        </label>
                        {fill.confidence > 0 && (
                          <span className={`sw-badge ${fill.confidence >= 80 ? "sw-badge--green" : fill.confidence >= 50 ? "sw-badge--yellow" : "sw-badge--red"}`}>
                            {fill.confidence}%
                          </span>
                        )}
                      </div>
                      {field.type === "textarea" ? (
                        <textarea
                          className="sw-field__textarea"
                          value={fill.value || ""}
                          onChange={(e) => handleFieldEdit(field.id, e.target.value)}
                          placeholder={field.helpText || ""}
                          maxLength={field.charLimit || undefined}
                          rows={4}
                        />
                      ) : field.type === "select" ? (
                        <select
                          className="sw-field__select"
                          value={fill.value || ""}
                          onChange={(e) => handleFieldEdit(field.id, e.target.value)}
                        >
                          <option value="">Select...</option>
                          {(field.options || []).map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === "checkbox" ? (
                        <label className="sw-checkbox-label">
                          <input
                            type="checkbox"
                            checked={fill.value === "true"}
                            onChange={(e) => handleFieldEdit(field.id, e.target.checked ? "true" : "")}
                          />
                          <span>{field.helpText || field.label}</span>
                        </label>
                      ) : (
                        <input
                          className="sw-field__input"
                          type={field.type || "text"}
                          value={fill.value || ""}
                          onChange={(e) => handleFieldEdit(field.id, e.target.value)}
                          placeholder={field.helpText || ""}
                        />
                      )}
                      {fill.source && <span className="sw-source-attr">Source: {fill.source}</span>}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="sw-stage__nav">
        <button className="sw-btn sw-btn--ghost" onClick={onBack}>Back</button>
        <button
          className="sw-btn sw-btn--primary"
          disabled={Object.keys(formData).length === 0}
          onClick={onNext}
        >
          Continue to Language
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Stage 7: ADD LANGUAGE (Insert white paper content into form)
// ═══════════════════════════════════════════════════════════════
function AddLanguageStage({ selectedSenators, formData, onUpdateFormData, whitePaper, onNext, onBack }) {
  const [activeSenator, setActiveSenator] = useState(selectedSenators[0] || null);
  const [insertedFields, setInsertedFields] = useState({});

  const selectedSenatorObjects = useMemo(
    () => senators.filter((s) => selectedSenators.includes(s.id)),
    [selectedSenators]
  );

  // Extract "language" sections from white paper
  const languageSections = useMemo(() => {
    if (!whitePaper) return [];
    const sections = [];
    const lines = whitePaper.split("\n");
    let currentTitle = "";
    let currentContent = "";

    for (const line of lines) {
      if (line.startsWith("## ")) {
        if (currentTitle && currentContent.trim()) {
          sections.push({ title: currentTitle, content: currentContent.trim() });
        }
        currentTitle = line.replace("## ", "");
        currentContent = "";
      } else if (!line.startsWith("# ")) {
        currentContent += line + "\n";
      }
    }
    if (currentTitle && currentContent.trim()) {
      sections.push({ title: currentTitle, content: currentContent.trim() });
    }
    return sections;
  }, [whitePaper]);

  // Narrative fields that accept "language" from white paper
  const getNarrativeFields = (senatorId) => {
    const fields = getSenatorFields(senatorId);
    return fields.filter(
      (f) => f.type === "textarea" && (f.category === "narrative" || f.id.includes("description") || f.id.includes("benefit") || f.id.includes("impact"))
    );
  };

  const insertLanguage = (senatorId, fieldId, sectionContent) => {
    const current = formData[senatorId]?.[fieldId]?.value || "";
    const newValue = current ? `${current}\n\n${sectionContent}` : sectionContent;

    onUpdateFormData((prev) => ({
      ...prev,
      [senatorId]: {
        ...(prev[senatorId] || {}),
        [fieldId]: {
          ...(prev[senatorId]?.[fieldId] || {}),
          value: newValue,
          confidence: 85,
          source: "White paper language",
        },
      },
    }));

    setInsertedFields((prev) => ({
      ...prev,
      [`${senatorId}_${fieldId}`]: true,
    }));
  };

  const narrativeFields = activeSenator ? getNarrativeFields(activeSenator) : [];

  return (
    <div className="sw-stage">
      <div className="sw-stage__header">
        <h2>Add White Paper Language</h2>
        <p>Insert excerpts from your white paper into the narrative fields of each senator's form.</p>
      </div>

      {/* Senator tabs */}
      {selectedSenatorObjects.length > 1 && (
        <div className="sw-tabs sw-tabs--compact">
          {selectedSenatorObjects.map((s) => (
            <button
              key={s.id}
              className={`sw-tab${activeSenator === s.id ? " sw-tab--active" : ""}`}
              onClick={() => setActiveSenator(s.id)}
            >
              <span className={`sw-party-dot sw-party-dot--${s.party}`} />
              {s.name.replace("Sen. ", "")}
            </button>
          ))}
        </div>
      )}

      <div className="sw-language-layout">
        {/* Language sections from white paper */}
        <div className="sw-language-sections">
          <h3>White Paper Sections</h3>
          {languageSections.length === 0 ? (
            <p className="sw-empty-text">No white paper content to insert. Go back and create a white paper first.</p>
          ) : (
            languageSections.map((section, i) => (
              <div key={i} className="sw-language-section">
                <div className="sw-language-section__title">{section.title}</div>
                <p className="sw-language-section__preview">
                  {section.content.substring(0, 200)}
                  {section.content.length > 200 ? "..." : ""}
                </p>
                <div className="sw-language-section__actions">
                  {narrativeFields.map((field) => (
                    <button
                      key={field.id}
                      className={`sw-btn sw-btn--sm${insertedFields[`${activeSenator}_${field.id}`] ? " sw-btn--inserted" : ""}`}
                      onClick={() => insertLanguage(activeSenator, field.id, section.content)}
                    >
                      {insertedFields[`${activeSenator}_${field.id}`] ? "Inserted" : `Insert into ${field.label}`}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Preview of narrative fields */}
        <div className="sw-language-preview">
          <h3>Form Narrative Fields</h3>
          {narrativeFields.map((field) => {
            const fill = formData[activeSenator]?.[field.id] || {};
            return (
              <div key={field.id} className="sw-language-field">
                <label className="sw-field__label">{field.label}</label>
                <textarea
                  className="sw-field__textarea"
                  value={fill.value || ""}
                  onChange={(e) => {
                    onUpdateFormData((prev) => ({
                      ...prev,
                      [activeSenator]: {
                        ...(prev[activeSenator] || {}),
                        [field.id]: {
                          ...(prev[activeSenator]?.[field.id] || {}),
                          value: e.target.value,
                          source: "Manual edit",
                        },
                      },
                    }));
                  }}
                  rows={6}
                  maxLength={field.charLimit || undefined}
                />
                {field.charLimit && (
                  <span className="sw-char-count">
                    {(fill.value || "").length} / {field.charLimit}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="sw-stage__nav">
        <button className="sw-btn sw-btn--ghost" onClick={onBack}>Back</button>
        <button className="sw-btn sw-btn--primary" onClick={onNext}>
          Continue to Review
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Stage 8: REVIEW & SUBMIT
// ═══════════════════════════════════════════════════════════════
function ReviewStage({ selectedClient, selectedTopic, selectedSenators, formData, whitePaper, uploadedFiles, saveItem, refreshData, onBack }) {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState({
    accuracy: false,
    compliance: false,
    authorized: false,
    reviewed: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const allChecked = Object.values(checklist).every(Boolean);

  const selectedSenatorObjects = useMemo(
    () => senators.filter((s) => selectedSenators.includes(s.id)),
    [selectedSenators]
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    setSaveError(null);

    const refId = "SUB-" + Date.now().toString(36).toUpperCase();
    setSubmissionId(refId);

    // Save a submission record for each senator office
    const submissionPromises = selectedSenatorObjects.map((senator) => {
      const senatorFormData = formData[senator.id] || {};
      const fieldValues = {};
      Object.entries(senatorFormData).forEach(([fieldId, data]) => {
        fieldValues[fieldId] = data.value || "";
      });

      const record = {
        id: `sub_${Date.now()}_${senator.id}_${Math.random().toString(36).slice(2, 6)}`,
        referenceId: refId,
        clientId: selectedClient?.id || null,
        clientName: selectedClient?.name || "",
        topicId: selectedTopic?.id || null,
        topicName: selectedTopic?.name || selectedTopic?.description || "",
        senatorId: senator.id,
        senatorName: senator.name,
        senatorState: senator.state,
        officeId: senator.id,
        title: `${selectedTopic?.name || "CDS"} — ${senator.name}`,
        type: "appropriations",
        status: "submitted",
        formData: fieldValues,
        whitePaper: whitePaper || "",
        documentCount: uploadedFiles?.length || 0,
        submissionMethod: senator.submissionMethod || "web_form",
        deadline: senator.deadline,
        wordCount: whitePaper ? whitePaper.split(/\s+/).filter(Boolean).length : 0,
        version: 1,
        aiGenerated: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (saveItem) {
        return saveItem("submission", record).catch((err) => {
          console.error(`Failed to save submission for ${senator.name}:`, err);
          return null;
        });
      }
      return Promise.resolve(record);
    });

    try {
      await Promise.all(submissionPromises);
      if (refreshData) await refreshData();
      setSubmitted(true);
    } catch (err) {
      console.error("Submission save failed:", err);
      setSaveError("Some submissions failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="sw-stage">
        <div className="sw-success">
          <div className="sw-success__icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h2 className="sw-success__title">Submission Packages Generated</h2>
          <p className="sw-success__text">
            {selectedSenators.length} submission package{selectedSenators.length !== 1 ? "s have" : " has"} been created for {selectedClient?.name || "your client"}.
          </p>
          <p className="sw-success__id">Reference: {submissionId}</p>
        </div>

        <div className="sw-post-senators">
          {selectedSenatorObjects.map((s) => (
            <div key={s.id} className="sw-post-senator">
              <div className="sw-post-senator__info">
                <span className={`sw-party-dot sw-party-dot--${s.party}`} />
                <div>
                  <strong>{s.name}</strong>
                  <p>{s.state} · Due {new Date(s.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="sw-badge sw-badge--blue">Package ready</span>
            </div>
          ))}
        </div>

        <div className="sw-post-actions">
          <button className="sw-btn sw-btn--primary" onClick={() => navigate("/app/submissions")}>View in LobbyFlow</button>
          <button className="sw-btn sw-btn--ghost" onClick={() => navigate("/app")}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="sw-stage">
      <div className="sw-stage__header">
        <h2>Review &amp; Submit</h2>
        <p>Review your submission before generating final packages for each senator office.</p>
      </div>

      {/* Summary */}
      <div className="sw-approval-summary">
        <div className="sw-approval-summary__item">
          <span className="sw-approval-summary__label">Client</span>
          <span className="sw-approval-summary__value">{selectedClient?.name || "—"}</span>
        </div>
        <div className="sw-approval-summary__item">
          <span className="sw-approval-summary__label">Topic</span>
          <span className="sw-approval-summary__value">{selectedTopic?.name || selectedTopic?.description || "—"}</span>
        </div>
        <div className="sw-approval-summary__item">
          <span className="sw-approval-summary__label">Documents</span>
          <span className="sw-approval-summary__value">{uploadedFiles?.length || 0} files</span>
        </div>
        <div className="sw-approval-summary__item">
          <span className="sw-approval-summary__label">Offices</span>
          <span className="sw-approval-summary__value">{selectedSenators.length} senator{selectedSenators.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="sw-approval-summary__item">
          <span className="sw-approval-summary__label">White Paper</span>
          <span className="sw-approval-summary__value">
            {whitePaper ? `${whitePaper.split(/\s+/).filter(Boolean).length} words` : "Not created"}
          </span>
        </div>
      </div>

      {/* Per-senator field completion */}
      <div className="sw-review-senators">
        <h3>Form Completeness</h3>
        {selectedSenatorObjects.map((s) => {
          const data = formData[s.id] || {};
          const fields = getSenatorFields(s.id);
          const filled = fields.filter((f) => data[f.id]?.value).length;
          const pct = Math.round((filled / fields.length) * 100);
          return (
            <div key={s.id} className="sw-risk-senator-row">
              <span className={`sw-party-dot sw-party-dot--${s.party}`} />
              <span className="sw-risk-senator-name">{s.name}</span>
              <div className="sw-risk-senator-bar">
                <div className="sw-risk-senator-bar__fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="sw-risk-senator-pct">{pct}%</span>
            </div>
          );
        })}
      </div>

      {/* Pre-submission checklist */}
      <div className="sw-checklist">
        <h3 className="sw-checklist__title">Pre-Submission Certification</h3>
        {[
          { key: "accuracy", label: "I have verified the accuracy of all form data and narratives" },
          { key: "compliance", label: "This submission complies with all lobbying disclosure requirements (LDA)" },
          { key: "authorized", label: "I am authorized to submit on behalf of the listed organization" },
          { key: "reviewed", label: "A senior team member has reviewed these submissions" },
        ].map((item) => (
          <label key={item.key} className="sw-checklist__item">
            <input
              type="checkbox"
              checked={checklist[item.key]}
              onChange={() => setChecklist((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
              className="sw-checklist__hidden"
            />
            <span className={`sw-checklist__check${checklist[item.key] ? " sw-checklist__check--done" : ""}`}>
              {checklist[item.key] && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </span>
            <span>{item.label}</span>
          </label>
        ))}
      </div>

      <div className="sw-stage__nav">
        <button className="sw-btn sw-btn--ghost" onClick={onBack}>Back</button>
        <button
          className="sw-btn sw-btn--primary sw-btn--lg"
          onClick={handleSubmit}
          disabled={!allChecked || submitting}
        >
          {submitting ? (
            <span className="sw-btn__loading"><span className="sw-spinner" /> Generating packages...</span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Approve &amp; Generate {selectedSenators.length} Package{selectedSenators.length !== 1 ? "s" : ""}
            </>
          )}
        </button>
        {!allChecked && <p className="sw-stage__hint">Complete all certifications to enable submission.</p>}
        {saveError && <p className="sw-stage__hint" style={{ color: "#DC2626" }}>{saveError}</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SHARED: Chat Input Component
// ═══════════════════════════════════════════════════════════════
function ChatInput({ onSend, disabled, placeholder }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <form className="sw-chat-input" onSubmit={handleSubmit}>
      <input
        className="sw-field__input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder || "Type a message..."}
        disabled={disabled}
      />
      <button
        type="submit"
        className="sw-btn sw-btn--primary sw-btn--sm"
        disabled={!value.trim() || disabled}
      >
        Send
      </button>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function generateAutoFill(field, client, topic) {
  const name = client?.name || "";
  const topicName = topic?.name || topic?.description || "";

  const map = {
    org_name:            { value: name, confidence: 95, source: "Client Profile" },
    org_address:         { value: client?.address || "", confidence: 80, source: "Client Profile" },
    org_ein:             { value: client?.ein || "", confidence: 90, source: "Client Profile" },
    contact_name:        { value: client?.contactName || "", confidence: 88, source: "Client Profile" },
    contact_email:       { value: client?.contactEmail || "", confidence: 88, source: "Client Profile" },
    contact_phone:       { value: client?.contactPhone || "", confidence: 85, source: "Client Profile" },
    project_title:       { value: topicName || "", confidence: 70, source: "Selected Topic" },
    project_description: { value: "", confidence: 0, source: "" },
    funding_amount:      { value: client?.fundingAmount ? String(client.fundingAmount) : "", confidence: 60, source: "Client data" },
    congressional_district: { value: client?.congressionalDistrict || "", confidence: 75, source: "Client Profile" },
    community_benefit:   { value: "", confidence: 0, source: "" },
    appropriations_bill: { value: "", confidence: 0, source: "" },
    appropriations_account: { value: "", confidence: 0, source: "" },
    federal_match:       { value: "", confidence: 0, source: "" },
    state_match:         { value: "", confidence: 0, source: "" },
    private_match:       { value: "", confidence: 0, source: "" },
    prior_federal_funding: { value: "", confidence: 0, source: "" },
    cert_no_financial_interest: { value: "", confidence: 0, source: "" },
    cert_lobbying_compliance:   { value: "", confidence: 0, source: "" },
  };

  if (map[field.id]) return map[field.id];

  // Unknown fields — no auto-fill
  return { value: "", confidence: 0, source: "" };
}

// ═══════════════════════════════════════════════════════════════
// MAIN ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════
export default function SubmissionWizard() {
  const navigate = useNavigate();
  const { clients, topics, allOffices, saveItem, refreshData } = useFirmData();
  const [stage, setStage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [whitePaper, setWhitePaper] = useState("");
  const [selectedSenators, setSelectedSenators] = useState([]);
  const [formData, setFormData] = useState({});

  const goTo = (s) => {
    setStage(s);
    window.scrollTo(0, 0);
  };

  return (
    <div className="sw">
      {/* Stage indicator */}
      <div className="sw__stages">
        {STAGES.map((s, i) => {
          const isActive = stage === s.id;
          const isDone = stage > s.id;
          return (
            <React.Fragment key={s.id}>
              {i > 0 && <div className={`sw__stage-line${isDone ? " sw__stage-line--done" : ""}`} />}
              <button
                className={`sw__stage${isActive ? " sw__stage--active" : ""}${isDone ? " sw__stage--done" : ""}`}
                onClick={() => isDone && goTo(s.id)}
                disabled={!isDone && !isActive}
              >
                <span className="sw__stage-num">
                  {isDone ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    s.id
                  )}
                </span>
                <span className="sw__stage-label">{s.short}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Stage content */}
      <div className="sw__content">
        {stage === 1 && (
          <SelectClientStage
            clients={clients}
            selectedClient={selectedClient}
            onSelectClient={setSelectedClient}
            onNext={() => goTo(2)}
          />
        )}
        {stage === 2 && (
          <UploadDocumentsStage
            uploadedFiles={uploadedFiles}
            onUpdateFiles={setUploadedFiles}
            onNext={() => goTo(3)}
            onBack={() => goTo(1)}
          />
        )}
        {stage === 3 && (
          <SelectTopicStage
            topics={topics}
            selectedClient={selectedClient}
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
            saveItem={saveItem}
            onNext={() => goTo(4)}
            onBack={() => goTo(2)}
          />
        )}
        {stage === 4 && (
          <WhitePaperStage
            selectedClient={selectedClient}
            selectedTopic={selectedTopic}
            uploadedFiles={uploadedFiles}
            whitePaper={whitePaper}
            onUpdateWhitePaper={setWhitePaper}
            onNext={() => goTo(5)}
            onBack={() => goTo(3)}
          />
        )}
        {stage === 5 && (
          <SelectOfficesStage
            selectedSenators={selectedSenators}
            onUpdateSenators={setSelectedSenators}
            allOffices={allOffices}
            onNext={() => goTo(6)}
            onBack={() => goTo(4)}
          />
        )}
        {stage === 6 && (
          <FillFormStage
            selectedClient={selectedClient}
            selectedTopic={selectedTopic}
            selectedSenators={selectedSenators}
            uploadedFiles={uploadedFiles}
            whitePaper={whitePaper}
            formData={formData}
            onUpdateFormData={setFormData}
            onNext={() => goTo(7)}
            onBack={() => goTo(5)}
          />
        )}
        {stage === 7 && (
          <AddLanguageStage
            selectedSenators={selectedSenators}
            formData={formData}
            onUpdateFormData={setFormData}
            whitePaper={whitePaper}
            onNext={() => goTo(8)}
            onBack={() => goTo(6)}
          />
        )}
        {stage === 8 && (
          <ReviewStage
            selectedClient={selectedClient}
            selectedTopic={selectedTopic}
            selectedSenators={selectedSenators}
            formData={formData}
            whitePaper={whitePaper}
            uploadedFiles={uploadedFiles}
            saveItem={saveItem}
            refreshData={refreshData}
            onBack={() => goTo(7)}
          />
        )}
      </div>
    </div>
  );
}
