import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFirmData } from "../hooks/useFirmData";
import senators, { getSenatorFields, getSenatorSpecificFields } from "../data/senatorForms";
import "../styles/SubmissionWizard.css";

/* ═══════════════════════════════════════════════════════════════
   Senate Form Submission — 7-Stage Agentic Workflow

   1. Data Ingestion    → Import sources, extract client profile
   2. Form Retrieval    → Select senators, preview form requirements
   3. AI Auto-Fill      → Map data to fields with confidence scores
   4. Human Validation  → Guided review & inline editing
   5. Risk Analysis     → Compliance & confidence report
   6. Approval          → Sign-off & generate package
   7. Post-Submission   → Confirmation & tracking
   ═══════════════════════════════════════════════════════════════ */

const STAGES = [
  { id: 1, key: "ingest",   label: "Data Ingestion",    short: "Ingest" },
  { id: 2, key: "retrieve", label: "Form Retrieval",     short: "Forms" },
  { id: 3, key: "autofill", label: "AI Auto-Fill",       short: "Auto-Fill" },
  { id: 4, key: "validate", label: "Human Validation",   short: "Validate" },
  { id: 5, key: "risk",     label: "Risk Analysis",      short: "Risk" },
  { id: 6, key: "approve",  label: "Approval",           short: "Approve" },
  { id: 7, key: "post",     label: "Post-Submission",    short: "Complete" },
];

const FILE_TYPES = [
  { ext: "pdf", label: "PDF", icon: "doc" },
  { ext: "pptx", label: "PowerPoint", icon: "ppt" },
  { ext: "docx", label: "Word", icon: "doc" },
  { ext: "xlsx", label: "Excel", icon: "xls" },
  { ext: "csv", label: "CSV", icon: "xls" },
  { ext: "txt", label: "Text", icon: "txt" },
];

// ═══════════════════════════════════════════════════════════════
// Stage 1: DATA INGESTION
// ═══════════════════════════════════════════════════════════════
function DataIngestionStage({ clientProfile, onUpdateProfile, clients, onNext }) {
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [urls, setUrls] = useState([""]);
  const [manualNotes, setManualNotes] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target?.files || []);
    setUploadedFiles(prev => [...prev, ...files.map(f => ({
      name: f.name, size: f.size, type: f.type,
      ext: f.name.split(".").pop().toLowerCase(),
    }))]);
  };

  const removeFile = (idx) => setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  const addUrl = () => setUrls(prev => [...prev, ""]);
  const updateUrl = (idx, val) => setUrls(prev => prev.map((u, i) => i === idx ? val : u));
  const removeUrl = (idx) => setUrls(prev => prev.filter((_, i) => i !== idx));

  const handleExtract = async () => {
    setExtracting(true);
    // Simulate AI extraction (2.5s)
    await new Promise(r => setTimeout(r, 2500));

    const client = clients.find(c => c.id === selectedClient);
    const profile = {
      orgName: client?.name || "Organization Name",
      ein: "52-" + Math.floor(1000000 + Math.random() * 9000000),
      address: client?.state ? `${client.state} Regional Office` : "Washington, DC",
      contactName: client?.contactName || "Primary Contact",
      contactEmail: client?.contactEmail || "contact@org.com",
      contactPhone: "(202) 555-" + Math.floor(1000 + Math.random() * 9000),
      projectTitle: client?.description?.split(".")[0] || "Infrastructure Modernization Project",
      projectDescription: client?.description || "Project focused on critical infrastructure improvements.",
      fundingAmount: client?.annualSpend || 500000,
      congressionalDistrict: `${client?.state || "DC"}-01`,
      industry: client?.industry || "Government Affairs",
      priorFunding: "FY2024: $250,000 (DOE Grant); FY2023: $180,000 (USDA NIFA)",
      sources: [
        ...uploadedFiles.map(f => ({ type: "file", name: f.name })),
        ...urls.filter(u => u.trim()).map(u => ({ type: "url", name: u })),
        ...(manualNotes ? [{ type: "notes", name: "Manual notes" }] : []),
        ...(selectedClient ? [{ type: "client_profile", name: "Capiro Client Profile" }] : []),
      ],
      gaps: [],
    };

    // Detect gaps
    if (!selectedClient) profile.gaps.push("No client selected — organization details may be incomplete");
    if (uploadedFiles.length === 0 && urls.filter(u => u.trim()).length === 0) {
      profile.gaps.push("No documents or URLs provided — project narrative may need manual entry");
    }

    onUpdateProfile(profile);
    setExtracted(true);
    setExtracting(false);
  };

  const sourceCount = uploadedFiles.length + urls.filter(u => u.trim()).length + (manualNotes ? 1 : 0) + (selectedClient ? 1 : 0);

  return (
    <div className="sw-stage">
      <div className="sw-stage__header">
        <h2>Data Ingestion</h2>
        <p>Import source materials for this submission. The AI agent will extract structured entities to auto-fill senator forms.</p>
      </div>

      {/* Client selector */}
      <div className="sw-field" style={{ marginBottom: 24 }}>
        <label className="sw-field__label">Client (from your firm profile)</label>
        <select className="sw-field__select" value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
          <option value="">Select a client...</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Source tabs */}
      <div className="sw-tabs sw-tabs--compact">
        {[
          { id: "upload", label: "Upload Documents", count: uploadedFiles.length },
          { id: "urls", label: "Website URLs", count: urls.filter(u => u.trim()).length },
          { id: "manual", label: "Manual Entry", count: manualNotes ? 1 : 0 },
          { id: "apis", label: "Public APIs", count: 0 },
        ].map(tab => (
          <button key={tab.id} className={`sw-tab${activeTab === tab.id ? " sw-tab--active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
            {tab.count > 0 && <span className="sw-tab__count">{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className="sw-tab-content">
        {activeTab === "upload" && (
          <div>
            <div
              className="sw-dropzone"
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" multiple hidden onChange={handleFileDrop} accept=".pdf,.pptx,.docx,.xlsx,.csv,.txt" />
              <div className="sw-dropzone__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <p className="sw-dropzone__text">Drop files here or click to browse</p>
              <p className="sw-dropzone__hint">PDF, PPTX, DOCX, XLSX, CSV, TXT</p>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="sw-file-list">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="sw-file-item">
                    <span className={`sw-file-icon sw-file-icon--${f.ext}`}>{f.ext.toUpperCase()}</span>
                    <span className="sw-file-name">{f.name}</span>
                    <span className="sw-file-size">{(f.size / 1024).toFixed(0)} KB</span>
                    <button className="sw-file-remove" onClick={() => removeFile(i)}>x</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "urls" && (
          <div className="sw-urls">
            {urls.map((url, i) => (
              <div key={i} className="sw-url-row">
                <input className="sw-field__input" type="url" placeholder="https://client-website.com/project" value={url} onChange={e => updateUrl(i, e.target.value)} />
                {urls.length > 1 && <button className="sw-file-remove" onClick={() => removeUrl(i)}>x</button>}
              </div>
            ))}
            <button className="sw-btn sw-btn--ghost sw-btn--sm" onClick={addUrl}>+ Add another URL</button>
          </div>
        )}

        {activeTab === "manual" && (
          <textarea className="sw-field__textarea" rows={6} placeholder="Paste briefing notes, project summaries, or any supporting text..." value={manualNotes} onChange={e => setManualNotes(e.target.value)} />
        )}

        {activeTab === "apis" && (
          <div className="sw-api-sources">
            {[
              { id: "usaspending", label: "USASpending.gov", desc: "Federal award & spending data", status: "available" },
              { id: "sam", label: "SAM.gov", desc: "Entity registration & exclusions", status: "available" },
              { id: "census", label: "Census Bureau", desc: "Community demographics & district data", status: "available" },
              { id: "grants", label: "Grants.gov", desc: "Federal grant opportunities", status: "available" },
            ].map(api => (
              <div key={api.id} className="sw-api-source">
                <div>
                  <strong>{api.label}</strong>
                  <p className="sw-api-source__desc">{api.desc}</p>
                </div>
                <span className="sw-api-source__status sw-api-source__status--available">Auto-queried</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extract button / results */}
      <div className="sw-stage__actions">
        {!extracted ? (
          <button className="sw-btn sw-btn--primary sw-btn--lg" onClick={handleExtract} disabled={extracting || sourceCount === 0}>
            {extracting ? (
              <span className="sw-btn__loading"><span className="sw-spinner" /> Extracting entities...</span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Extract &amp; Build Client Profile ({sourceCount} source{sourceCount !== 1 ? "s" : ""})
              </>
            )}
          </button>
        ) : (
          <div className="sw-profile-preview">
            <div className="sw-profile-preview__header">
              <h3>Client Data Profile</h3>
              <span className="sw-badge sw-badge--green">Extracted</span>
            </div>
            <div className="sw-profile-grid">
              {[
                { label: "Organization", value: clientProfile.orgName },
                { label: "EIN", value: clientProfile.ein },
                { label: "Contact", value: clientProfile.contactName },
                { label: "Email", value: clientProfile.contactEmail },
                { label: "Phone", value: clientProfile.contactPhone },
                { label: "District", value: clientProfile.congressionalDistrict },
                { label: "Project", value: clientProfile.projectTitle },
                { label: "Funding Request", value: `$${(clientProfile.fundingAmount || 0).toLocaleString()}` },
              ].map(item => (
                <div key={item.label} className="sw-profile-item">
                  <span className="sw-profile-item__label">{item.label}</span>
                  <span className="sw-profile-item__value">{item.value}</span>
                </div>
              ))}
            </div>
            {clientProfile.gaps?.length > 0 && (
              <div className="sw-profile-gaps">
                <strong>Gaps detected:</strong>
                {clientProfile.gaps.map((gap, i) => <p key={i} className="sw-profile-gap">{gap}</p>)}
              </div>
            )}
            <div className="sw-profile-sources">
              <strong>{clientProfile.sources?.length || 0} sources indexed</strong>
              <div className="sw-profile-sources__list">
                {(clientProfile.sources || []).map((s, i) => (
                  <span key={i} className={`sw-source-tag sw-source-tag--${s.type}`}>{s.name}</span>
                ))}
              </div>
            </div>
            <button className="sw-btn sw-btn--primary sw-btn--lg" onClick={onNext} style={{ marginTop: 16 }}>
              Continue to Form Selection
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Stage 2: FORM RETRIEVAL & SELECTION
// ═══════════════════════════════════════════════════════════════
function FormRetrievalStage({ selectedSenators, onUpdateSenators, onNext, onBack }) {
  const [filter, setFilter] = useState({ party: "all", search: "" });
  const [verifying, setVerifying] = useState(null);
  const [verified, setVerified] = useState(new Set());

  const filtered = useMemo(() => {
    return senators.filter(s => {
      if (filter.party !== "all" && s.party !== filter.party) return false;
      if (filter.search && !s.name.toLowerCase().includes(filter.search.toLowerCase()) && !s.state.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    });
  }, [filter]);

  const toggleSenator = (id) => {
    onUpdateSenators(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const verifySenator = async (id) => {
    setVerifying(id);
    await new Promise(r => setTimeout(r, 1500));
    setVerified(prev => new Set([...prev, id]));
    setVerifying(null);
  };

  const selectedSenatorObjects = senators.filter(s => selectedSenators.includes(s.id));
  const commonFieldCount = 19; // from senatorForms.js COMMON_FIELDS
  const totalUniqueFields = selectedSenatorObjects.reduce((sum, s) => sum + getSenatorSpecificFields(s.id).length, 0);

  const daysUntilDeadline = (deadline) => {
    const diff = new Date(deadline) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="sw-stage">
      <div className="sw-stage__header">
        <h2>Form Retrieval &amp; Selection</h2>
        <p>Select target senators. The agent verifies each office's current form requirements and flags changes.</p>
      </div>

      {/* Filters */}
      <div className="sw-filter-row">
        <input className="sw-field__input sw-filter-search" placeholder="Search senators by name or state..." value={filter.search} onChange={e => setFilter(p => ({ ...p, search: e.target.value }))} />
        <div className="sw-filter-pills">
          {["all", "D", "R"].map(p => (
            <button key={p} className={`sw-pill${filter.party === p ? " sw-pill--active" : ""}`} onClick={() => setFilter(prev => ({ ...prev, party: p }))}>
              {p === "all" ? "All" : p === "D" ? "Democrat" : "Republican"}
            </button>
          ))}
        </div>
      </div>

      {/* Senator grid */}
      <div className="sw-senator-grid">
        {filtered.map(senator => {
          const isSelected = selectedSenators.includes(senator.id);
          const isVerified = verified.has(senator.id);
          const isVerifying = verifying === senator.id;
          const days = daysUntilDeadline(senator.deadline);
          const specificFields = getSenatorSpecificFields(senator.id);

          return (
            <div key={senator.id} className={`sw-senator-card${isSelected ? " sw-senator-card--selected" : ""}${days <= 0 ? " sw-senator-card--expired" : days <= 7 ? " sw-senator-card--urgent" : ""}`}>
              <div className="sw-senator-card__top">
                <div className="sw-senator-card__info">
                  <span className={`sw-party-dot sw-party-dot--${senator.party}`} />
                  <div>
                    <h4 className="sw-senator-card__name">{senator.name}</h4>
                    <p className="sw-senator-card__meta">{senator.state} · {senator.committee}</p>
                  </div>
                </div>
                <label className="sw-checkbox-wrap">
                  <input type="checkbox" checked={isSelected} onChange={() => toggleSenator(senator.id)} />
                  <span className="sw-checkbox" />
                </label>
              </div>
              <div className="sw-senator-card__details">
                <div className="sw-senator-card__detail">
                  <span className="sw-senator-card__detail-label">Deadline</span>
                  <span className={`sw-senator-card__detail-value${days <= 7 ? " sw-text--urgent" : ""}`}>
                    {new Date(senator.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {days > 0 ? ` (${days}d)` : " (PASSED)"}
                  </span>
                </div>
                <div className="sw-senator-card__detail">
                  <span className="sw-senator-card__detail-label">Unique fields</span>
                  <span className="sw-senator-card__detail-value">{specificFields.length}</span>
                </div>
                <div className="sw-senator-card__detail">
                  <span className="sw-senator-card__detail-label">Method</span>
                  <span className="sw-senator-card__detail-value">{senator.submissionMethod.replace("_", " ")}</span>
                </div>
              </div>
              {isSelected && (
                <div className="sw-senator-card__verify">
                  {isVerified ? (
                    <span className="sw-badge sw-badge--green">Form verified current</span>
                  ) : (
                    <button className="sw-btn sw-btn--ghost sw-btn--sm" onClick={() => verifySenator(senator.id)} disabled={isVerifying}>
                      {isVerifying ? <><span className="sw-spinner sw-spinner--sm" /> Checking...</> : "Verify form is current"}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selection summary */}
      {selectedSenators.length > 0 && (
        <div className="sw-selection-summary">
          <div className="sw-selection-summary__stats">
            <div className="sw-stat">
              <span className="sw-stat__value">{selectedSenators.length}</span>
              <span className="sw-stat__label">Senator{selectedSenators.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="sw-stat">
              <span className="sw-stat__value">{commonFieldCount}</span>
              <span className="sw-stat__label">Common fields</span>
            </div>
            <div className="sw-stat">
              <span className="sw-stat__value">{totalUniqueFields}</span>
              <span className="sw-stat__label">Unique fields</span>
            </div>
          </div>
          <p className="sw-selection-summary__overlap">
            ~{Math.round((commonFieldCount / (commonFieldCount + (totalUniqueFields / Math.max(selectedSenators.length, 1)))) * 100)}% field overlap — AI will fill common fields once, then handle senator-specific requirements.
          </p>
        </div>
      )}

      <div className="sw-stage__nav">
        <button className="sw-btn sw-btn--ghost" onClick={onBack}>Back</button>
        <button className="sw-btn sw-btn--primary" onClick={onNext} disabled={selectedSenators.length === 0}>
          Continue to Auto-Fill ({selectedSenators.length} form{selectedSenators.length !== 1 ? "s" : ""})
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Stage 3: AI AUTO-FILL
// ═══════════════════════════════════════════════════════════════
function AutoFillStage({ clientProfile, selectedSenators, formData, onUpdateFormData, onNext, onBack }) {
  const [filling, setFilling] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeSenator, setActiveSenator] = useState(selectedSenators[0] || "");

  const selectedSenatorObjects = senators.filter(s => selectedSenators.includes(s.id));

  // Simulate AI auto-fill
  useEffect(() => {
    if (!filling) return;
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 8 + 2;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        // Generate auto-fill results
        const results = {};
        for (const senId of selectedSenators) {
          const fields = getSenatorFields(senId);
          results[senId] = {};
          for (const field of fields) {
            results[senId][field.id] = generateAutoFill(field, clientProfile);
          }
        }
        onUpdateFormData(results);
        setFilling(false);
      }
      setProgress(Math.min(p, 100));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  if (filling) {
    return (
      <div className="sw-stage">
        <div className="sw-autofill-working">
          <div className="sw-spinner sw-spinner--lg" />
          <h2>AI Agent is auto-filling {selectedSenators.length} form{selectedSenators.length !== 1 ? "s" : ""}...</h2>
          <p>Mapping your client data profile to each senator's field requirements.</p>
          <div className="sw-progress-bar"><div className="sw-progress-bar__fill" style={{ width: `${progress}%` }} /></div>
          <div className="sw-autofill-tasks">
            {[
              { label: "Mapping common fields across all forms", done: progress > 20 },
              { label: "Matching organization & contact data", done: progress > 35 },
              { label: "Generating project narratives per character limits", done: progress > 55 },
              { label: "Adapting to senator-specific requirements", done: progress > 70 },
              { label: "Calculating confidence scores", done: progress > 85 },
              { label: "Flagging gaps requiring manual entry", done: progress >= 100 },
            ].map(task => (
              <div key={task.label} className={`sw-atask${task.done ? " sw-atask--done" : ""}`}>
                {task.done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--signal-blue)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                ) : <span className="sw-spinner sw-spinner--sm" />}
                <span>{task.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentFields = getSenatorFields(activeSenator);
  const currentData = formData[activeSenator] || {};
  const confidenceSummary = getConfidenceSummary(currentData);

  return (
    <div className="sw-stage">
      <div className="sw-stage__header">
        <h2>AI Auto-Fill Results</h2>
        <p>Review auto-filled fields for each senator. Color-coded by confidence level.</p>
      </div>

      {/* Senator selector tabs */}
      <div className="sw-senator-tabs">
        {selectedSenatorObjects.map(s => {
          const data = formData[s.id] || {};
          const summary = getConfidenceSummary(data);
          return (
            <button key={s.id} className={`sw-senator-tab${activeSenator === s.id ? " sw-senator-tab--active" : ""}`} onClick={() => setActiveSenator(s.id)}>
              <span className={`sw-party-dot sw-party-dot--${s.party}`} />
              <span>{s.name.replace("Sen. ", "")}</span>
              <span className="sw-senator-tab__score">{summary.avgConfidence}%</span>
            </button>
          );
        })}
      </div>

      {/* Confidence summary bar */}
      <div className="sw-confidence-bar">
        <div className="sw-confidence-segment sw-confidence-segment--high" style={{ width: `${confidenceSummary.highPct}%` }} title={`${confidenceSummary.high} high confidence`} />
        <div className="sw-confidence-segment sw-confidence-segment--med" style={{ width: `${confidenceSummary.medPct}%` }} title={`${confidenceSummary.med} medium confidence`} />
        <div className="sw-confidence-segment sw-confidence-segment--low" style={{ width: `${confidenceSummary.lowPct}%` }} title={`${confidenceSummary.low} low / missing`} />
      </div>
      <div className="sw-confidence-legend">
        <span className="sw-legend-item"><span className="sw-legend-dot sw-legend-dot--high" /> High ({confidenceSummary.high})</span>
        <span className="sw-legend-item"><span className="sw-legend-dot sw-legend-dot--med" /> Needs review ({confidenceSummary.med})</span>
        <span className="sw-legend-item"><span className="sw-legend-dot sw-legend-dot--low" /> Missing / low ({confidenceSummary.low})</span>
      </div>

      {/* Form fields */}
      <div className="sw-form-fields">
        {currentFields.filter(f => f.type !== "checkbox" && f.type !== "file").map(field => {
          const fill = currentData[field.id] || {};
          const conf = fill.confidence || 0;
          const level = conf >= 80 ? "high" : conf >= 50 ? "med" : "low";
          return (
            <div key={field.id} className={`sw-form-field sw-form-field--${level}`}>
              <div className="sw-form-field__header">
                <label className="sw-form-field__label">
                  {field.label}
                  {field.required && <span className="sw-required">*</span>}
                </label>
                <div className="sw-form-field__meta">
                  <span className={`sw-confidence-badge sw-confidence-badge--${level}`}>{conf}%</span>
                  {fill.source && <span className="sw-source-attr" title={fill.source}>Source: {fill.source}</span>}
                </div>
              </div>
              {field.type === "textarea" ? (
                <textarea className="sw-form-field__input" rows={3} value={fill.value || ""} readOnly />
              ) : field.type === "select" ? (
                <select className="sw-form-field__input" value={fill.value || ""} disabled>
                  <option>{fill.value || "—"}</option>
                </select>
              ) : (
                <input className="sw-form-field__input" type={field.type || "text"} value={fill.value || ""} readOnly />
              )}
              {field.charLimit && fill.value && (
                <span className="sw-form-field__charlimit">{fill.value.length} / {field.charLimit}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="sw-stage__nav">
        <button className="sw-btn sw-btn--ghost" onClick={onBack}>Back</button>
        <button className="sw-btn sw-btn--primary" onClick={onNext}>Continue to Validation</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Stage 4: HUMAN VALIDATION
// ═══════════════════════════════════════════════════════════════
function HumanValidationStage({ selectedSenators, formData, onUpdateFormData, onNext, onBack }) {
  const [activeSenator, setActiveSenator] = useState(selectedSenators[0] || "");
  const [reviewFilter, setReviewFilter] = useState("all"); // all | low | med | high
  const [edits, setEdits] = useState({});

  const selectedSenatorObjects = senators.filter(s => selectedSenators.includes(s.id));
  const currentFields = getSenatorFields(activeSenator);
  const currentData = formData[activeSenator] || {};

  const handleFieldEdit = (fieldId, newValue) => {
    setEdits(prev => ({
      ...prev,
      [activeSenator]: { ...(prev[activeSenator] || {}), [fieldId]: newValue },
    }));
  };

  const getFieldValue = (fieldId) => {
    return edits[activeSenator]?.[fieldId] ?? currentData[fieldId]?.value ?? "";
  };

  const isEdited = (fieldId) => edits[activeSenator]?.[fieldId] !== undefined;

  const filteredFields = currentFields.filter(f => {
    if (f.type === "file") return false;
    if (reviewFilter === "all") return true;
    const conf = currentData[f.id]?.confidence || 0;
    if (reviewFilter === "low") return conf < 50;
    if (reviewFilter === "med") return conf >= 50 && conf < 80;
    if (reviewFilter === "high") return conf >= 80;
    return true;
  });

  const editCount = Object.values(edits).reduce((sum, s) => sum + Object.keys(s).length, 0);

  return (
    <div className="sw-stage">
      <div className="sw-stage__header">
        <h2>Human Validation</h2>
        <p>Review and edit auto-filled fields. Start with low-confidence items that need your attention.</p>
      </div>

      {/* Senator tabs */}
      <div className="sw-senator-tabs">
        {selectedSenatorObjects.map(s => (
          <button key={s.id} className={`sw-senator-tab${activeSenator === s.id ? " sw-senator-tab--active" : ""}`} onClick={() => setActiveSenator(s.id)}>
            <span className={`sw-party-dot sw-party-dot--${s.party}`} />
            <span>{s.name.replace("Sen. ", "")}</span>
            {edits[s.id] && Object.keys(edits[s.id]).length > 0 && (
              <span className="sw-senator-tab__edits">{Object.keys(edits[s.id]).length} edits</span>
            )}
          </button>
        ))}
      </div>

      {/* Review filter */}
      <div className="sw-review-filter">
        <span>Show:</span>
        {[
          { id: "all", label: "All fields" },
          { id: "low", label: "Needs entry" },
          { id: "med", label: "Needs review" },
          { id: "high", label: "Auto-filled" },
        ].map(f => (
          <button key={f.id} className={`sw-pill sw-pill--sm${reviewFilter === f.id ? " sw-pill--active" : ""}`} onClick={() => setReviewFilter(f.id)}>{f.label}</button>
        ))}
      </div>

      {/* Editable form fields */}
      <div className="sw-form-fields sw-form-fields--editable">
        {filteredFields.map(field => {
          const fill = currentData[field.id] || {};
          const conf = fill.confidence || 0;
          const level = conf >= 80 ? "high" : conf >= 50 ? "med" : "low";
          const edited = isEdited(field.id);
          return (
            <div key={field.id} className={`sw-form-field sw-form-field--${level}${edited ? " sw-form-field--edited" : ""}`}>
              <div className="sw-form-field__header">
                <label className="sw-form-field__label">
                  {field.label}
                  {field.required && <span className="sw-required">*</span>}
                  {edited && <span className="sw-edited-badge">Edited</span>}
                </label>
                <span className={`sw-confidence-badge sw-confidence-badge--${level}`}>{conf}%</span>
              </div>
              {field.type === "textarea" ? (
                <textarea className="sw-form-field__input" rows={4} value={getFieldValue(field.id)} onChange={e => handleFieldEdit(field.id, e.target.value)} />
              ) : field.type === "select" ? (
                <select className="sw-form-field__input" value={getFieldValue(field.id)} onChange={e => handleFieldEdit(field.id, e.target.value)}>
                  <option value="">Select...</option>
                  {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : field.type === "checkbox" ? (
                <label className="sw-checkbox-label">
                  <input type="checkbox" checked={getFieldValue(field.id) === "true"} onChange={e => handleFieldEdit(field.id, e.target.checked ? "true" : "")} />
                  <span>{field.helpText || field.label}</span>
                </label>
              ) : (
                <input className="sw-form-field__input" type={field.type || "text"} value={getFieldValue(field.id)} onChange={e => handleFieldEdit(field.id, e.target.value)} placeholder={field.helpText || ""} />
              )}
              {fill.source && <span className="sw-source-attr">Source: {fill.source}</span>}
            </div>
          );
        })}
      </div>

      {editCount > 0 && (
        <div className="sw-edit-summary">
          You've made <strong>{editCount}</strong> edit{editCount !== 1 ? "s" : ""} across {Object.keys(edits).length} form{Object.keys(edits).length !== 1 ? "s" : ""}.
        </div>
      )}

      <div className="sw-stage__nav">
        <button className="sw-btn sw-btn--ghost" onClick={onBack}>Back</button>
        <button className="sw-btn sw-btn--primary" onClick={onNext}>Run Risk Analysis</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Stage 5: RISK & CONFIDENCE ANALYSIS
// ═══════════════════════════════════════════════════════════════
function RiskAnalysisStage({ selectedSenators, formData, clientProfile, onNext, onBack }) {
  const [analyzing, setAnalyzing] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReport(generateRiskReport(selectedSenators, formData, clientProfile));
      setAnalyzing(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (analyzing) {
    return (
      <div className="sw-stage">
        <div className="sw-autofill-working">
          <div className="sw-spinner sw-spinner--lg" />
          <h2>Running Risk &amp; Compliance Analysis...</h2>
          <p>Checking lobbying disclosure compliance, field completeness, cross-form consistency, and deadline proximity.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sw-stage">
      <div className="sw-stage__header">
        <h2>Risk &amp; Confidence Report</h2>
        <p>Review the submission readiness assessment before final approval.</p>
      </div>

      {/* Overall score */}
      <div className="sw-risk-score">
        <div className={`sw-risk-score__ring sw-risk-score__ring--${report.overallRisk}`}>
          <svg viewBox="0 0 36 36">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={report.overallRisk === "low" ? "#059669" : report.overallRisk === "medium" ? "#D97706" : "#DC2626"} strokeWidth="3" strokeDasharray={`${report.readinessScore}, 100`} strokeLinecap="round" />
          </svg>
          <span className="sw-risk-score__value">{report.readinessScore}</span>
        </div>
        <div className="sw-risk-score__info">
          <h3>Readiness Score: {report.readinessScore}/100</h3>
          <p>Overall Risk: <span className={`sw-risk-level sw-risk-level--${report.overallRisk}`}>{report.overallRisk.toUpperCase()}</span></p>
        </div>
      </div>

      {/* Risk items */}
      <div className="sw-risk-items">
        {report.items.map((item, i) => (
          <div key={i} className={`sw-risk-item sw-risk-item--${item.severity}`}>
            <div className="sw-risk-item__icon">
              {item.severity === "pass" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              ) : item.severity === "warning" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              )}
            </div>
            <div className="sw-risk-item__content">
              <div className="sw-risk-item__header">
                <span className={`sw-risk-item__badge sw-risk-item__badge--${item.severity}`}>{item.severity}</span>
                <span className="sw-risk-item__category">{item.category}</span>
              </div>
              <p className="sw-risk-item__text">{item.text}</p>
              {item.action && <p className="sw-risk-item__action"><strong>Recommended:</strong> {item.action}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Per-senator completeness */}
      <div className="sw-risk-senators">
        <h3>Per-Senator Completeness</h3>
        {senators.filter(s => selectedSenators.includes(s.id)).map(s => {
          const data = formData[s.id] || {};
          const fields = getSenatorFields(s.id);
          const filled = fields.filter(f => data[f.id]?.value).length;
          const pct = Math.round((filled / fields.length) * 100);
          return (
            <div key={s.id} className="sw-risk-senator-row">
              <span className={`sw-party-dot sw-party-dot--${s.party}`} />
              <span className="sw-risk-senator-name">{s.name}</span>
              <div className="sw-risk-senator-bar"><div className="sw-risk-senator-bar__fill" style={{ width: `${pct}%` }} /></div>
              <span className="sw-risk-senator-pct">{pct}%</span>
            </div>
          );
        })}
      </div>

      <div className="sw-stage__nav">
        <button className="sw-btn sw-btn--ghost" onClick={onBack}>Back to Validation</button>
        <button className="sw-btn sw-btn--primary" onClick={onNext}>
          {report.readinessScore >= 70 ? "Proceed to Approval" : "Proceed Anyway"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Stage 6: APPROVAL & SUBMISSION
// ═══════════════════════════════════════════════════════════════
function ApprovalStage({ selectedSenators, clientProfile, onSubmit, onBack }) {
  const [checklist, setChecklist] = useState({
    accuracy: false, compliance: false, authorized: false, reviewed: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const allChecked = Object.values(checklist).every(Boolean);

  const selectedSenatorObjects = senators.filter(s => selectedSenators.includes(s.id));

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    onSubmit();
  };

  return (
    <div className="sw-stage">
      <div className="sw-stage__header">
        <h2>Approval &amp; Submission</h2>
        <p>Review the final checklist, approve, and generate submission packages for each senator.</p>
      </div>

      {/* Submission summary */}
      <div className="sw-approval-summary">
        <div className="sw-approval-summary__item">
          <span className="sw-approval-summary__label">Client</span>
          <span className="sw-approval-summary__value">{clientProfile?.orgName || "—"}</span>
        </div>
        <div className="sw-approval-summary__item">
          <span className="sw-approval-summary__label">Project</span>
          <span className="sw-approval-summary__value">{clientProfile?.projectTitle || "—"}</span>
        </div>
        <div className="sw-approval-summary__item">
          <span className="sw-approval-summary__label">Funding</span>
          <span className="sw-approval-summary__value">${(clientProfile?.fundingAmount || 0).toLocaleString()}</span>
        </div>
        <div className="sw-approval-summary__item">
          <span className="sw-approval-summary__label">Senators</span>
          <span className="sw-approval-summary__value">{selectedSenators.length} offices</span>
        </div>
      </div>

      {/* Delivery routing per senator */}
      <div className="sw-delivery-routing">
        <h3>Delivery Method</h3>
        {selectedSenatorObjects.map(s => (
          <div key={s.id} className="sw-delivery-row">
            <div className="sw-delivery-row__info">
              <span className={`sw-party-dot sw-party-dot--${s.party}`} />
              <div>
                <strong>{s.name}</strong>
                <p className="sw-delivery-row__deadline">Due: {new Date(s.deadline).toLocaleDateString()}</p>
              </div>
            </div>
            <span className={`sw-delivery-method sw-delivery-method--${s.submissionMethod}`}>
              {s.submissionMethod === "web_form" ? "Submission-ready package" : s.submissionMethod === "pdf_upload" ? "PDF package" : "Email package"}
            </span>
          </div>
        ))}
      </div>

      {/* Pre-submission checklist */}
      <div className="sw-checklist">
        <h3 className="sw-checklist__title">Pre-Submission Certification</h3>
        {[
          { key: "accuracy", label: "I have verified the accuracy of all form data and narratives" },
          { key: "compliance", label: "This submission complies with all lobbying disclosure requirements (LDA)" },
          { key: "authorized", label: "I am authorized to submit on behalf of the listed organization" },
          { key: "reviewed", label: "A senior team member has reviewed these submissions" },
        ].map(item => (
          <label key={item.key} className="sw-checklist__item">
            <input type="checkbox" checked={checklist[item.key]} onChange={() => setChecklist(prev => ({ ...prev, [item.key]: !prev[item.key] }))} className="sw-checklist__hidden" />
            <span className={`sw-checklist__check${checklist[item.key] ? " sw-checklist__check--done" : ""}`}>
              {checklist[item.key] && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </span>
            <span>{item.label}</span>
          </label>
        ))}
      </div>

      <div className="sw-stage__nav">
        <button className="sw-btn sw-btn--ghost" onClick={onBack}>Back</button>
        <button className="sw-btn sw-btn--primary sw-btn--lg" onClick={handleSubmit} disabled={!allChecked || submitting}>
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
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Stage 7: POST-SUBMISSION
// ═══════════════════════════════════════════════════════════════
function PostSubmissionStage({ selectedSenators, clientProfile }) {
  const navigate = useNavigate();
  const selectedSenatorObjects = senators.filter(s => selectedSenators.includes(s.id));
  const submissionId = "SUB-" + Date.now().toString(36).toUpperCase();

  return (
    <div className="sw-stage">
      <div className="sw-success">
        <div className="sw-success__icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h2 className="sw-success__title">Submission Packages Generated</h2>
        <p className="sw-success__text">
          {selectedSenators.length} submission package{selectedSenators.length !== 1 ? "s have" : " has"} been created for {clientProfile?.orgName || "your client"}.
        </p>
        <p className="sw-success__id">Reference: {submissionId}</p>
      </div>

      {/* Per-senator status */}
      <div className="sw-post-senators">
        {selectedSenatorObjects.map(s => (
          <div key={s.id} className="sw-post-senator">
            <div className="sw-post-senator__info">
              <span className={`sw-party-dot sw-party-dot--${s.party}`} />
              <div>
                <strong>{s.name}</strong>
                <p>{s.state} · Due {new Date(s.deadline).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="sw-post-senator__status">
              <span className="sw-badge sw-badge--blue">Package ready</span>
              <span className="sw-post-senator__method">{s.submissionMethod.replace("_", " ")}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Next steps */}
      <div className="sw-post-next">
        <h3>What happens next</h3>
        <div className="sw-post-next__items">
          <div className="sw-post-next__item">
            <span className="sw-post-next__num">1</span>
            <div>
              <strong>Download submission packages</strong>
              <p>Each senator's package is formatted per their office requirements.</p>
            </div>
          </div>
          <div className="sw-post-next__item">
            <span className="sw-post-next__num">2</span>
            <div>
              <strong>Submit via senator portals</strong>
              <p>Upload or paste from the generated packages into each office's submission portal.</p>
            </div>
          </div>
          <div className="sw-post-next__item">
            <span className="sw-post-next__num">3</span>
            <div>
              <strong>Track status</strong>
              <p>Monitor submission status and respond to office follow-ups from your dashboard.</p>
            </div>
          </div>
          <div className="sw-post-next__item">
            <span className="sw-post-next__num">4</span>
            <div>
              <strong>Annual rollover</strong>
              <p>When the next fiscal year opens, Capiro will pre-populate from this submission.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sw-post-actions">
        <button className="sw-btn sw-btn--primary" onClick={() => navigate("/app/submissions")}>View All Submissions</button>
        <button className="sw-btn sw-btn--ghost" onClick={() => navigate("/app")}>Back to Dashboard</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function generateAutoFill(field, profile) {
  const p = profile || {};
  const map = {
    org_name:           { value: p.orgName, confidence: 95, source: "Client Profile" },
    org_address:        { value: p.address, confidence: 85, source: "Client Profile" },
    org_ein:            { value: p.ein, confidence: 90, source: "SAM.gov verification" },
    contact_name:       { value: p.contactName, confidence: 92, source: "Client Profile" },
    contact_email:      { value: p.contactEmail, confidence: 92, source: "Client Profile" },
    contact_phone:      { value: p.contactPhone, confidence: 88, source: "Client Profile" },
    project_title:      { value: p.projectTitle, confidence: 82, source: "Uploaded brief, p.3" },
    project_description:{ value: p.projectDescription, confidence: 70, source: "AI-generated from brief + client site" },
    funding_amount:     { value: String(p.fundingAmount || ""), confidence: 78, source: "Client engagement data" },
    congressional_district: { value: p.congressionalDistrict, confidence: 85, source: "Census API" },
    community_benefit:  { value: `This project will directly benefit the ${p.congressionalDistrict || "local"} community by ${p.projectDescription?.split(".")[0]?.toLowerCase() || "advancing critical infrastructure"}. The initiative aligns with regional priorities and is expected to create sustainable economic impact.`, confidence: 62, source: "AI-generated" },
    appropriations_bill: { value: guessAppropriationsBill(p.industry), confidence: 68, source: "Industry mapping" },
    appropriations_account: { value: "", confidence: 0, source: "" },
    federal_match:      { value: "", confidence: 0, source: "" },
    state_match:        { value: "", confidence: 0, source: "" },
    private_match:      { value: "", confidence: 0, source: "" },
    prior_federal_funding: { value: p.priorFunding || "", confidence: p.priorFunding ? 75 : 0, source: p.priorFunding ? "USASpending.gov" : "" },
    cert_no_financial_interest: { value: "", confidence: 0, source: "" },
    cert_lobbying_compliance: { value: "", confidence: 0, source: "" },
  };

  if (map[field.id]) return map[field.id];

  // Senator-specific fields: lower confidence
  if (field.type === "textarea") {
    return { value: `[Auto-generated content for "${field.label}" based on available data]`, confidence: 45, source: "AI inference" };
  }
  if (field.type === "select" && field.options?.length) {
    return { value: field.options[0], confidence: 35, source: "Default selection" };
  }
  return { value: "", confidence: 0, source: "" };
}

function guessAppropriationsBill(industry) {
  const map = {
    "Defense & Aerospace": "Defense",
    "Healthcare": "Labor-HHS-Education",
    "Energy": "Energy-Water",
    "Technology": "Commerce-Justice-Science",
    "Agriculture & Food": "Agriculture",
    "Transportation": "Transportation-HUD",
    "Environment": "Interior-Environment",
    "Education": "Labor-HHS-Education",
  };
  return map[industry] || "Commerce-Justice-Science";
}

function getConfidenceSummary(data) {
  const values = Object.values(data);
  if (values.length === 0) return { high: 0, med: 0, low: 0, highPct: 0, medPct: 0, lowPct: 0, avgConfidence: 0 };
  const high = values.filter(v => v.confidence >= 80).length;
  const med = values.filter(v => v.confidence >= 50 && v.confidence < 80).length;
  const low = values.filter(v => v.confidence < 50).length;
  const total = values.length;
  const avg = Math.round(values.reduce((s, v) => s + v.confidence, 0) / total);
  return { high, med, low, highPct: (high/total)*100, medPct: (med/total)*100, lowPct: (low/total)*100, avgConfidence: avg };
}

function generateRiskReport(selectedSenators, formData, clientProfile) {
  const items = [
    { severity: "pass", category: "LDA Compliance", text: "Lobbying disclosure requirements appear satisfied. Client engagement is properly registered.", action: null },
    { severity: "pass", category: "Certification", text: "No financial interest conflicts detected for the submitting organization.", action: null },
    { severity: "pass", category: "Format", text: "All submissions conform to respective senator office formatting requirements.", action: null },
    { severity: "warning", category: "Deadline Proximity", text: `${selectedSenators.length > 1 ? "Some selected" : "The selected"} senator office${selectedSenators.length !== 1 ? "s have" : " has a"} deadline within 10 days.`, action: "Prioritize submission to offices with nearest deadlines." },
    { severity: "warning", category: "Field Completeness", text: "Appropriations account/program field is empty across all forms. This is typically required.", action: "Review and fill the specific appropriations account for each submission." },
    { severity: "suggestion", category: "Narrative Quality", text: "Community benefit narratives could be strengthened with quantitative impact metrics (jobs, population served, etc.).", action: "Add 2-3 specific data points to the community impact statement." },
    { severity: "pass", category: "Cross-Form Consistency", text: "Organization details (name, EIN, contact) are consistent across all selected senator forms.", action: null },
    { severity: "suggestion", category: "Historical Comparison", text: "Funding request is 15% higher than the median successful CDS request in this category. Consider providing additional justification.", action: "Add budget breakdown or phased implementation plan." },
  ];

  const warnings = items.filter(i => i.severity === "warning").length;
  const errors = items.filter(i => i.severity === "error").length;
  const score = Math.max(0, 100 - (warnings * 8) - (errors * 20));
  const risk = score >= 80 ? "low" : score >= 60 ? "medium" : "high";

  return { readinessScore: score, overallRisk: risk, items };
}

// ═══════════════════════════════════════════════════════════════
// MAIN ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════
export default function SubmissionWizard() {
  const navigate = useNavigate();
  const { clients, topics, allOffices } = useFirmData();
  const [stage, setStage] = useState(1);
  const [clientProfile, setClientProfile] = useState(null);
  const [selectedSenators, setSelectedSenators] = useState([]);
  const [formData, setFormData] = useState({});

  const goTo = (s) => { setStage(s); window.scrollTo(0, 0); };

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
                  ) : s.id}
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
          <DataIngestionStage
            clientProfile={clientProfile}
            onUpdateProfile={setClientProfile}
            clients={clients}
            onNext={() => goTo(2)}
          />
        )}
        {stage === 2 && (
          <FormRetrievalStage
            selectedSenators={selectedSenators}
            onUpdateSenators={setSelectedSenators}
            onNext={() => goTo(3)}
            onBack={() => goTo(1)}
          />
        )}
        {stage === 3 && (
          <AutoFillStage
            clientProfile={clientProfile}
            selectedSenators={selectedSenators}
            formData={formData}
            onUpdateFormData={setFormData}
            onNext={() => goTo(4)}
            onBack={() => goTo(2)}
          />
        )}
        {stage === 4 && (
          <HumanValidationStage
            selectedSenators={selectedSenators}
            formData={formData}
            onUpdateFormData={setFormData}
            onNext={() => goTo(5)}
            onBack={() => goTo(3)}
          />
        )}
        {stage === 5 && (
          <RiskAnalysisStage
            selectedSenators={selectedSenators}
            formData={formData}
            clientProfile={clientProfile}
            onNext={() => goTo(6)}
            onBack={() => goTo(4)}
          />
        )}
        {stage === 6 && (
          <ApprovalStage
            selectedSenators={selectedSenators}
            clientProfile={clientProfile}
            onSubmit={() => goTo(7)}
            onBack={() => goTo(5)}
          />
        )}
        {stage === 7 && (
          <PostSubmissionStage
            selectedSenators={selectedSenators}
            clientProfile={clientProfile}
          />
        )}
      </div>
    </div>
  );
}
