import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { plans } from "../data/ldaData";
import * as api from "../services/api";
import "../styles/Onboarding.css";

/* ──────────────────────────────────────────────────────────
   LDA Firm Search — calls the real Senate LDA API via
   our Lambda proxy, stores firm data in DynamoDB.
   ────────────────────────────────────────────────────────── */

const searchLDAFirms = async (query) => {
  if (!query || query.length < 2) return [];

  try {
    console.log("[Capiro] Searching LDA for:", query);
    const data = await api.searchFirms(query);
    console.log("[Capiro] Search response:", data);
    if (data.results && data.results.length > 0) {
      return data.results.map(r => ({
        ...r,
        id: r.id || "lda_" + (r.ldaRegistrationId || Math.random().toString(36).slice(2, 10)),
        activeClients: r.activeClients ?? null,
      }));
    }
    return [];
  } catch (err) {
    console.error("[Capiro] Search failed:", err.message);
    throw err;
  }
};

const OnboardingPage = () => {
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 6;

  const [firmData, setFirmData] = useState({
    name: "", website: "", address: "", description: "",
    phone: "", ldaRegistrationId: "", contactName: "",
    // New intake fields
    priorEngagements: "",
    desiredAskAmount: "",
    knownRelationships: "",
    topicInterests: [],
  });
  const [teamMembers, setTeamMembers] = useState([{ email: "", role: "Lobbyist" }]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [setupLoading, setSetupLoading] = useState(false);

  // LDA search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState(null);
  const searchRef = useRef(null);
  const searchTimerRef = useRef(null);

  // Topics tag input (Step 3)
  const [topicInput, setTopicInput] = useState("");
  const [submissionType, setSubmissionType] = useState("CDS Appropriations");

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced LDA search
  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSelectedFirm(null);
    setScanError(null);

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (val.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    searchTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchLDAFirms(val);
        setSearchResults(results);
        if (results.length === 0) {
          setScanError(null);
        }
      } catch (err) {
        console.error("[Capiro] Search error:", err);
        setSearchResults([]);
        setScanError("Search failed: " + err.message);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  // Select a firm from LDA results → prefill form
  const handleSelectFirm = useCallback((firm) => {
    setSelectedFirm(firm);
    setSearchQuery(firm.name);
    setShowResults(false);
    setFirmData(prev => ({
      ...prev,
      name: firm.name,
      website: firm.website || "",
      address: firm.address || "",
      description: firm.description || "",
      phone: firm.phone || "",
      ldaRegistrationId: firm.ldaRegistrationId || "",
      contactName: firm.contactName || "",
    }));
    setScanError(null);
  }, []);

  // Manual firm input
  const handleFirmInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFirmData((prev) => ({ ...prev, [name]: value }));
    setScanError(null);
  }, []);

  // Clear search and reset firm
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setSelectedFirm(null);
    setSearchResults([]);
    setShowResults(false);
    setFirmData(prev => ({
      ...prev,
      name: "", website: "", address: "", description: "",
      phone: "", ldaRegistrationId: "", contactName: "",
    }));
  }, []);

  // Team members
  const handleTeamMemberChange = useCallback((index, field, value) => {
    setTeamMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const handleAddTeamMember = useCallback(() => {
    setTeamMembers((prev) => [...prev, { email: "", role: "Lobbyist" }]);
  }, []);

  const handleRemoveTeamMember = useCallback((index) => {
    setTeamMembers((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Topic tag helpers
  const handleAddTopic = useCallback(() => {
    const trimmed = topicInput.trim();
    if (trimmed && !firmData.topicInterests.includes(trimmed)) {
      setFirmData(prev => ({ ...prev, topicInterests: [...prev.topicInterests, trimmed] }));
    }
    setTopicInput("");
  }, [topicInput, firmData.topicInterests]);

  const handleRemoveTopic = useCallback((topic) => {
    setFirmData(prev => ({ ...prev, topicInterests: prev.topicInterests.filter(t => t !== topic) }));
  }, []);

  const handleTopicKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTopic();
    }
    if (e.key === "Backspace" && !topicInput && firmData.topicInterests.length) {
      setFirmData(prev => ({ ...prev, topicInterests: prev.topicInterests.slice(0, -1) }));
    }
  }, [topicInput, firmData.topicInterests, handleAddTopic]);

  // Navigation
  const handleNext = useCallback(() => {
    if (step === 2 && !firmData.name.trim()) {
      setScanError("Firm name is required. Search for your firm above or enter it manually.");
      return;
    }
    if (step < TOTAL_STEPS) setStep(step + 1);
  }, [step, firmData.name]);

  const handlePrev = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  const handleComplete = useCallback(async () => {
    const firmId = selectedFirm?.id
      ? `firm_${selectedFirm.id}`
      : "firm_" + Math.random().toString(36).slice(2, 10);

    const ldaRegistrantId = selectedFirm?.ldaRegistrationId || selectedFirm?.id || null;

    setSetupLoading(true);

    try {
      await api.setupFirm({
        firmId,
        ldaRegistrantId,
        firmData: {
          name: firmData.name,
          website: firmData.website,
          address: firmData.address,
          description: firmData.description,
          phone: firmData.phone,
          ldaRegistrationId: firmData.ldaRegistrationId,
          contactName: firmData.contactName,
          priorEngagements: firmData.priorEngagements,
          desiredAskAmount: firmData.desiredAskAmount,
          knownRelationships: firmData.knownRelationships,
          topicInterests: firmData.topicInterests,
          plan: selectedPlan,
          teamMembers: teamMembers.filter((m) => m.email.trim()),
          submissionType: submissionType || null,
        },
      });
    } catch (err) {
      console.error("Failed to set up firm:", err);
    } finally {
      setSetupLoading(false);
    }

    // Save user profile to DynamoDB
    try {
      await api.saveUserProfile({
        email: user?.email,
        userId: user?.id,
        firmId,
        firmName: firmData.name,
        name: user?.name,
        role: user?.role || "firm_admin",
        onboardingData: {
          priorEngagements: firmData.priorEngagements,
          desiredAskAmount: firmData.desiredAskAmount,
          knownRelationships: firmData.knownRelationships,
          topicInterests: firmData.topicInterests,
          submissionType,
        },
      });
    } catch (err) {
      console.error("Failed to save user profile:", err);
    }

    completeOnboarding({ id: firmId, name: firmData.name });
    navigate("/app");
  }, [firmData, selectedPlan, teamMembers, selectedFirm, submissionType, user, completeOnboarding, navigate]);

  const userName = user?.name || "there";

  return (
    <div className="onboarding-container">
      <div className="onboarding-wrapper">
        {/* Progress bar */}
        <div className="onboarding-progress">
          <div className="onboarding-progress__bar" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>

        {/* Step indicators */}
        <div className="onboarding-indicators">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <button
              key={s}
              className={`indicator ${s === step ? "indicator--active" : s < step ? "indicator--completed" : ""}`}
              onClick={() => s < step && setStep(s)}
              disabled={s > step}
              aria-label={`Step ${s}`}
            >
              {s < step ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 4.5L6 12L2.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : s}
            </button>
          ))}
        </div>

        {/* ═══════════════ Step 1: Welcome ═══════════════ */}
        {step === 1 && (
          <div className="onboarding-step fadeSlideUp">
            <div className="step-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect x="8" y="8" width="48" height="48" rx="8" fill="#E8EDF5" />
                <path d="M32 20V44M20 32H44" stroke="#01226A" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="step-title">Welcome to Capiro, {userName}!</h1>
            <p className="step-subtitle">
              We're excited to have you on board. In the next few minutes, we'll
              help you set up your firm, build your team, and choose the perfect
              plan to supercharge your government affairs work.
            </p>
            <p className="step-description">
              Capiro streamlines your entire lobbying workflow — from research
              and drafting to congressional submissions and compliance tracking.
              Let's get started!
            </p>
          </div>
        )}

        {/* ═══════════════ Step 2: LDA Firm Search + Setup ═══════════════ */}
        {step === 2 && (
          <div className="onboarding-step fadeSlideUp">
            <h1 className="step-title">Find Your Firm</h1>
            <p className="step-subtitle">
              Search the LDA registry to find and prefill your firm's details, or enter them manually below.
            </p>

            {/* LDA Search Bar */}
            <div className="lda-search-section" ref={searchRef}>
              <div className="lda-search-bar">
                <div className="lda-search-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="lda-search-input"
                  placeholder="Search by firm name, LDA ID, or contact..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  autoComplete="off"
                />
                {searchQuery && (
                  <button className="lda-search-clear" onClick={handleClearSearch} type="button" aria-label="Clear">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
                {isSearching && <span className="spinner lda-search-spinner" />}
              </div>

              <div className="lda-search-hint">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 5V8.5M8 11V11.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Data sourced from the Senate LDA Filing System
              </div>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="lda-results-dropdown">
                  {isSearching ? (
                    <div className="lda-results-loading">
                      <span className="spinner" />
                      <span>Searching LDA registry...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((firm) => (
                      <button
                        key={firm.id}
                        className="lda-result-item"
                        onClick={() => handleSelectFirm(firm)}
                        type="button"
                      >
                        <div className="lda-result-avatar">
                          {firm.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="lda-result-info">
                          <div className="lda-result-name">{firm.name}</div>
                          <div className="lda-result-meta">
                            <span className="lda-result-id">LDA #{firm.ldaRegistrationId}</span>
                            {firm.address && (
                              <>
                                <span className="lda-result-dot" />
                                <span>{firm.address.split(",").slice(-2).join(",").trim()}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {firm.activeClients != null && (
                          <div className="lda-result-badge">
                            {firm.activeClients} client{firm.activeClients !== 1 ? "s" : ""}
                          </div>
                        )}
                      </button>
                    ))
                  ) : searchQuery.length >= 2 ? (
                    <div className="lda-results-empty">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span>No firms found for "{searchQuery}"</span>
                      <span className="lda-results-empty-hint">Try a different name or enter your firm details manually below</span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Selected Firm Banner */}
            {selectedFirm && (
              <div className="lda-selected-banner">
                <div className="lda-selected-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8" fill="#059669" />
                    <path d="M5.5 9L7.5 11L12.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="lda-selected-text">
                  <strong>{selectedFirm.name}</strong> — LDA #{selectedFirm.ldaRegistrationId}
                </div>
                <button className="lda-selected-change" onClick={handleClearSearch} type="button">
                  Change
                </button>
              </div>
            )}

            {/* Firm Details Form */}
            <form className="onboarding-form">
              {!selectedFirm && (
                <div className="form-divider">
                  <span>Or enter firm details manually</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="firmName" className="form-label">
                  Firm Name <span className="required">*</span>
                </label>
                <input
                  id="firmName" type="text" name="name"
                  placeholder="e.g., Capstone Government Affairs"
                  value={firmData.name}
                  onChange={handleFirmInputChange}
                  className={`form-input ${selectedFirm ? "form-input--prefilled" : ""}`}
                />
              </div>

              {selectedFirm && firmData.ldaRegistrationId && (
                <div className="form-group">
                  <label className="form-label">LDA Registration ID</label>
                  <input
                    type="text" value={firmData.ldaRegistrationId}
                    className="form-input form-input--prefilled" readOnly
                  />
                </div>
              )}

              <div className="form-row">
                <div className="form-group form-group--half">
                  <label htmlFor="website" className="form-label">Website</label>
                  <input
                    id="website" type="text" name="website"
                    placeholder="https://example.com"
                    value={firmData.website}
                    onChange={handleFirmInputChange}
                    className={`form-input ${selectedFirm && firmData.website ? "form-input--prefilled" : ""}`}
                  />
                </div>
                <div className="form-group form-group--half">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input
                    id="phone" type="tel" name="phone"
                    placeholder="(202) 555-0147"
                    value={firmData.phone}
                    onChange={handleFirmInputChange}
                    className={`form-input ${selectedFirm && firmData.phone ? "form-input--prefilled" : ""}`}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  id="address" type="text" name="address"
                  placeholder="1100 Connecticut Ave NW, Washington, DC 20036"
                  value={firmData.address}
                  onChange={handleFirmInputChange}
                  className={`form-input ${selectedFirm && firmData.address ? "form-input--prefilled" : ""}`}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description" name="description"
                  placeholder="Tell us about your firm..."
                  value={firmData.description}
                  onChange={handleFirmInputChange}
                  className={`form-input form-textarea ${selectedFirm && firmData.description ? "form-input--prefilled" : ""}`}
                  rows="3"
                />
              </div>

              {/* ── New Intake Fields ── */}
              <div className="form-divider">
                <span>Engagement Details</span>
              </div>

              <div className="form-group">
                <label htmlFor="priorEngagements" className="form-label">Prior Engagements</label>
                <textarea
                  id="priorEngagements" name="priorEngagements"
                  placeholder="Describe any prior congressional or agency engagements..."
                  value={firmData.priorEngagements}
                  onChange={handleFirmInputChange}
                  className="form-input form-textarea"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group form-group--half">
                  <label htmlFor="desiredAskAmount" className="form-label">Desired Ask Amount ($)</label>
                  <input
                    id="desiredAskAmount" type="number" name="desiredAskAmount"
                    placeholder="e.g., 5000000"
                    value={firmData.desiredAskAmount}
                    onChange={handleFirmInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group form-group--half">
                  <label htmlFor="topicInterests" className="form-label">Topic Interests</label>
                  <div className="topic-tags-inline">
                    {firmData.topicInterests.map(tag => (
                      <span key={tag} className="topic-tag topic-tag--sm">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTopic(tag)} className="topic-tag__remove" aria-label={`Remove ${tag}`}>&times;</button>
                      </span>
                    ))}
                    <input
                      id="topicInterests"
                      placeholder={firmData.topicInterests.length === 0 ? "e.g., Defense, Healthcare, Energy" : "Add more..."}
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      onKeyDown={handleTopicKeyDown}
                      onBlur={handleAddTopic}
                      className="topic-inline-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="knownRelationships" className="form-label">Known Relationships</label>
                <textarea
                  id="knownRelationships" name="knownRelationships"
                  placeholder="List any known relationships with legislators, committee members, or agency contacts..."
                  value={firmData.knownRelationships}
                  onChange={handleFirmInputChange}
                  className="form-input form-textarea"
                  rows="3"
                />
              </div>

              {scanError && <p className="form-error">{scanError}</p>}
            </form>
          </div>
        )}

        {/* ═══════════════ Step 3: Topics & Submission Type ═══════════════ */}
        {step === 3 && (
          <div className="onboarding-step fadeSlideUp">
            <div className="step-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect x="8" y="8" width="48" height="48" rx="8" fill="#E8EDF5" />
                <path d="M22 22H42M22 32H36M22 42H30" stroke="#01226A" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="42" cy="38" r="8" fill="#3A6FF7" opacity="0.2" />
                <path d="M39 38L41 40L45 36" stroke="#3A6FF7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="step-title">Topics & Submission Type</h1>
            <p className="step-subtitle">
              Add the policy topics your firm focuses on and select a submission type.
            </p>

            {/* Submission Type Selector */}
            <div className="ndaa-section">
              <div className="form-group">
                <label className="form-label">Submission Request Type</label>
                <div className="ndaa-type-grid">
                  {["CDS Appropriations", "NDAA Authorization", "Defense Supplemental", "Agency Report Language"].map(type => (
                    <button
                      key={type}
                      type="button"
                      className={`ndaa-type-btn ${submissionType === type ? "ndaa-type-btn--active" : ""}`}
                      onClick={() => setSubmissionType(type)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        {submissionType === type ? (
                          <><circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
                        ) : (
                          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                        )}
                      </svg>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Tags Input */}
              <div className="form-group">
                <label className="form-label">Policy Topics</label>
                <p className="form-hint">Press Enter or comma to add a topic. These will appear on your firm profile.</p>
                <div className="topic-tags-box">
                  {firmData.topicInterests.map(tag => (
                    <span key={tag} className="topic-tag">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTopic(tag)} className="topic-tag__remove" aria-label={`Remove ${tag}`}>
                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                          <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="topic-input"
                    placeholder={firmData.topicInterests.length === 0 ? "e.g., Defense, Healthcare, Energy..." : "Add another topic..."}
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyDown={handleTopicKeyDown}
                    onBlur={handleAddTopic}
                  />
                </div>
              </div>

              {/* Quick-add suggestions */}
              <div className="topic-suggestions">
                <span className="topic-suggestions__label">Popular topics:</span>
                {["Defense", "Healthcare", "Energy", "Technology", "Agriculture", "Education", "Transportation", "Homeland Security"].map(t => (
                  !firmData.topicInterests.includes(t) && (
                    <button
                      key={t}
                      type="button"
                      className="topic-suggestion-btn"
                      onClick={() => setFirmData(prev => ({ ...prev, topicInterests: [...prev.topicInterests, t] }))}
                    >
                      + {t}
                    </button>
                  )
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ Step 4: Invite Team ═══════════════ */}
        {step === 4 && (
          <div className="onboarding-step fadeSlideUp">
            <h1 className="step-title">Invite Your Team</h1>
            <p className="step-subtitle">
              Add team members to collaborate. You can always invite more later, or skip this for now.
            </p>

            <div className="team-members-list">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="team-member-row">
                  <input
                    type="email" placeholder="team@example.com"
                    value={member.email}
                    onChange={(e) => handleTeamMemberChange(idx, "email", e.target.value)}
                    className="form-input"
                  />
                  <select
                    value={member.role}
                    onChange={(e) => handleTeamMemberChange(idx, "role", e.target.value)}
                    className="form-input form-select"
                  >
                    <option value="Firm Admin">Firm Admin</option>
                    <option value="Lobbyist">Lobbyist</option>
                    <option value="Analyst">Analyst</option>
                  </select>
                  {teamMembers.length > 1 && (
                    <button type="button" onClick={() => handleRemoveTeamMember(idx)} className="btn-remove-member" aria-label="Remove member">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button type="button" onClick={handleAddTeamMember} className="btn-add-member">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Add Another Team Member
            </button>
          </div>
        )}

        {/* ═══════════════ Step 5: Choose Plan ═══════════════ */}
        {step === 5 && (
          <div className="onboarding-step fadeSlideUp">
            <h1 className="step-title">Choose Your Plan</h1>
            <p className="step-subtitle">
              Select the plan that works best for your team. You can upgrade or change anytime.
            </p>

            <div className="plans-grid">
              {plans.map((plan) => (
                <button
                  key={plan.id} type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`plan-card ${selectedPlan === plan.id ? "plan-card--selected" : ""} ${plan.popular ? "plan-card--popular" : ""}`}
                >
                  {plan.popular && <div className="plan-popular-badge">Most Popular</div>}
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    {plan.price ? (
                      <>
                        <span className="plan-price-value">${plan.price}</span>
                        <span className="plan-price-period">/month</span>
                      </>
                    ) : (
                      <span className="plan-price-value">Custom</span>
                    )}
                  </div>
                  <p className="plan-seat-info">
                    {plan.seats ? `Up to ${plan.seats} team members` : "Unlimited team members"}
                  </p>
                  <ul className="plan-features">
                    {plan.features.map((feature, i) => (
                      <li key={i}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════ Step 6: Success ═══════════════ */}
        {step === 6 && (
          <div className="onboarding-step fadeSlideUp">
            <div className="success-animation">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="36" fill="#E8EDF5" />
                <path d="M30 40L36 46L50 32" stroke="#01226A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h1 className="step-title">You're All Set!</h1>
            <p className="step-subtitle">
              Your firm is ready to go. Welcome to the Capiro family!
            </p>

            <div className="success-details">
              <div className="detail-item">
                <span className="detail-label">Firm:</span>
                <span className="detail-value">{firmData.name}</span>
              </div>
              {firmData.ldaRegistrationId && (
                <div className="detail-item">
                  <span className="detail-label">LDA ID:</span>
                  <span className="detail-value">{firmData.ldaRegistrationId}</span>
                </div>
              )}
              {submissionType && (
                <div className="detail-item">
                  <span className="detail-label">Submission Type:</span>
                  <span className="detail-value">{submissionType}</span>
                </div>
              )}
              {firmData.desiredAskAmount && (
                <div className="detail-item">
                  <span className="detail-label">Ask Amount:</span>
                  <span className="detail-value">
                    ${Number(firmData.desiredAskAmount).toLocaleString()}
                  </span>
                </div>
              )}
              {selectedPlan && (
                <div className="detail-item">
                  <span className="detail-label">Plan:</span>
                  <span className="detail-value">
                    {plans.find((p) => p.id === selectedPlan)?.name}
                  </span>
                </div>
              )}
              {teamMembers.filter((m) => m.email.trim()).length > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Team Members:</span>
                  <span className="detail-value">
                    {teamMembers.filter((m) => m.email.trim()).length} invited
                  </span>
                </div>
              )}
              {firmData.topicInterests.length > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Topics:</span>
                  <span className="detail-value">{firmData.topicInterests.join(", ")}</span>
                </div>
              )}
              )}
            </div>

            <p className="success-cta-text">
              Ready to dive in? Head to your dashboard to start managing your
              government affairs campaigns.
            </p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="onboarding-actions">
          {step > 1 && (
            <button onClick={handlePrev} className="btn-secondary">Back</button>
          )}
          {step < TOTAL_STEPS && (
            <>
              {step === 3 && (
                <button onClick={() => setStep(4)} className="btn-secondary">Skip Topics</button>
              )}
              {step === 4 && (
                <button onClick={() => setStep(5)} className="btn-secondary">Skip for Now</button>
              )}
              <button onClick={handleNext} className="btn-primary">
                {step === 1 ? "Get Started" : "Next"}
              </button>
            </>
          )}
          {step === TOTAL_STEPS && (
            <button onClick={handleComplete} className="btn-primary btn-large" disabled={setupLoading}>
              {setupLoading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="spinner" /> Setting up your firm...
                </span>
              ) : "Go to Dashboard"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
