import React, { useState } from "react";
import { useFirmData } from "../hooks/useFirmData";
import "../styles/Settings.css";

export default function SettingsPage() {
  const { firm, lobbyists, filingPeriods, plans } = useFirmData();

  const [activeTab, setActiveTab] = useState("profile");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: firm.name,
    address: firm.address,
    website: firm.website,
    ldaRegistrationId: firm.ldaRegistrationId,
  });

  const firmData = firm;
  const teamMembers = lobbyists;

  // Mock data for usage stats
  const usageStats = {
    clientsUsed: 5,
    clientsLimit: 25,
    aiGenerations: 47,
    aiGenerationsLimit: 200,
  };

  // Mock data for invoices
  const invoices = [
    {
      id: "inv_001",
      date: "2025-03-01",
      period: "Mar 1 - Mar 31, 2025",
      amount: 799,
      status: "paid",
      plan: "Professional",
    },
    {
      id: "inv_002",
      date: "2025-02-01",
      period: "Feb 1 - Feb 28, 2025",
      amount: 799,
      status: "paid",
      plan: "Professional",
    },
    {
      id: "inv_003",
      date: "2025-01-01",
      period: "Jan 1 - Jan 31, 2025",
      amount: 799,
      status: "paid",
      plan: "Professional",
    },
  ];

  // Mock API key
  const apiKey = "cap_live_xxxxxxxxxxxxxxxxxxxxxxxx";
  const maskedApiKey = "cap_live_" + apiKey.slice(9).replace(/./g, "•");

  // Mock webhook URL
  const webhookUrl = "https://yourapp.com/webhooks/capiro";

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    setEditingProfile(false);
    // API call would go here
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your Capiro account, team, billing, and compliance requirements</p>
      </div>

      {/* Tabs */}
      <div className="settings-tabs">
        <button
          className={`tab ${activeTab === "profile" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`tab ${activeTab === "team" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("team")}
        >
          Team
        </button>
        <button
          className={`tab ${activeTab === "billing" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("billing")}
        >
          Billing
        </button>
        <button
          className={`tab ${activeTab === "compliance" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("compliance")}
        >
          Compliance
        </button>
        <button
          className={`tab ${activeTab === "api" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("api")}
        >
          API
        </button>
      </div>

      <div className="settings-content">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="tab-panel">
            <h2 className="panel-title">Firm Profile</h2>
            {!editingProfile ? (
              <div className="profile-view">
                <div className="profile-section">
                  <div className="profile-field">
                    <label className="field-label">Firm Name</label>
                    <p className="field-value">{profileForm.name}</p>
                  </div>
                  <div className="profile-field">
                    <label className="field-label">Address</label>
                    <p className="field-value">{profileForm.address}</p>
                  </div>
                  <div className="profile-field">
                    <label className="field-label">Website</label>
                    <p className="field-value">
                      <a href={profileForm.website} target="_blank" rel="noopener noreferrer">
                        {profileForm.website}
                      </a>
                    </p>
                  </div>
                  <div className="profile-field">
                    <label className="field-label">LDA Registration ID</label>
                    <p className="field-value">{profileForm.ldaRegistrationId}</p>
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setEditingProfile(true)}
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form className="profile-form" onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile();
              }}>
                <div className="form-group">
                  <label className="form-label">Firm Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    value={profileForm.address}
                    onChange={(e) => handleProfileChange("address", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input
                    type="url"
                    className="form-input"
                    value={profileForm.website}
                    onChange={(e) => handleProfileChange("website", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">LDA Registration ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.ldaRegistrationId}
                    onChange={(e) => handleProfileChange("ldaRegistrationId", e.target.value)}
                    disabled
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingProfile(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <div className="tab-panel">
            <div className="panel-header">
              <h2 className="panel-title">Team Members</h2>
              <button className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Invite Member
              </button>
            </div>
            <div className="team-list">
              {teamMembers.map((member) => (
                <div key={member.id} className="team-member">
                  <div className="member-info">
                    <h4 className="member-name">{member.name}</h4>
                    <p className="member-email">{member.email}</p>
                    <p className="member-position">{member.coveredPosition || "N/A"}</p>
                  </div>
                  <div className="member-issues">
                    <div className="issues-label">Issue Areas:</div>
                    <div className="issues-tags">
                      {member.issueAreas.map((area) => (
                        <span key={area} className="issue-tag">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="member-actions">
                    <select className="role-select" defaultValue="admin">
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <button className="btn-icon" title="Remove member">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 4 21 4 23 6 18 6 6 6 1 6" />
                        <path d="M19 7v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7m3 0v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <div className="tab-panel">
            <h2 className="panel-title">Billing & Plans</h2>

            {/* Current Plan Card */}
            <div className="current-plan-card">
              <div className="plan-badge">Current Plan</div>
              <h3 className="plan-name">Professional</h3>
              <div className="plan-price">
                <span className="price-amount">$799</span>
                <span className="price-period">/month</span>
              </div>
              <p className="plan-description">25 active clients, advanced AI drafting, multi-office routing</p>
              <div className="plan-renewal">Next billing date: <strong>April 1, 2025</strong></div>
            </div>

            {/* Usage Stats */}
            <div className="usage-stats">
              <h3 className="stats-title">Usage This Month</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Clients Used</div>
                  <div className="stat-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(usageStats.clientsUsed / usageStats.clientsLimit) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="stat-value">
                    {usageStats.clientsUsed} / {usageStats.clientsLimit}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">AI Generations</div>
                  <div className="stat-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(usageStats.aiGenerations / usageStats.aiGenerationsLimit) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="stat-value">
                    {usageStats.aiGenerations} / {usageStats.aiGenerationsLimit}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="plans-section">
              <h3 className="plans-title">Upgrade or Downgrade</h3>
              <div className="pricing-grid">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`pricing-card ${plan.popular ? "pricing-card--popular" : ""}`}
                  >
                    {plan.popular && <div className="popular-badge">Most Popular</div>}
                    <h4 className="plan-title">{plan.name}</h4>
                    {plan.price ? (
                      <div className="plan-pricing">
                        <span className="price">${plan.price}</span>
                        <span className="period">/month</span>
                      </div>
                    ) : (
                      <div className="plan-pricing">
                        <span className="price">Custom</span>
                      </div>
                    )}
                    <ul className="plan-features">
                      {plan.features.map((feature, idx) => (
                        <li key={idx}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {plan.name === "Enterprise" ? (
                      <button className="btn btn-secondary w-100">Contact Sales</button>
                    ) : (
                      <button className="btn btn-primary w-100">Change Plan</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="payment-section">
              <h3 className="payment-title">Payment Method</h3>
              <div className="payment-card">
                <div className="card-info">
                  <div className="card-type">
                    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                      <rect width="32" height="20" rx="2" fill="#0066CC" />
                      <rect x="2" y="2" width="8" height="4" fill="white" fillOpacity="0.3" />
                      <rect x="12" y="2" width="8" height="4" fill="white" fillOpacity="0.3" />
                      <rect x="22" y="2" width="8" height="4" fill="white" fillOpacity="0.3" />
                      <text x="16" y="15" fontSize="10" fill="white" textAnchor="middle" dominantBaseline="middle">
                        •••• 4242
                      </text>
                    </svg>
                    Visa ending in 4242
                  </div>
                  <div className="card-expiry">Expires 12/26</div>
                </div>
                <button className="btn btn-secondary">Update Payment Method</button>
              </div>
            </div>

            {/* Invoice History */}
            <div className="invoices-section">
              <h3 className="invoices-title">Invoice History</h3>
              <div className="invoices-table">
                <div className="table-header">
                  <div className="col col-date">Date</div>
                  <div className="col col-period">Period</div>
                  <div className="col col-plan">Plan</div>
                  <div className="col col-amount">Amount</div>
                  <div className="col col-status">Status</div>
                  <div className="col col-action">Action</div>
                </div>
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="table-row">
                    <div className="col col-date">{invoice.date}</div>
                    <div className="col col-period">{invoice.period}</div>
                    <div className="col col-plan">{invoice.plan}</div>
                    <div className="col col-amount">${invoice.amount}</div>
                    <div className="col col-status">
                      <span className={`status-badge status-badge--${invoice.status}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <div className="col col-action">
                      <button className="btn-link">Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Powered by Stripe */}
            <div className="stripe-badge">
              <svg width="40" height="16" viewBox="0 0 40 16" fill="currentColor">
                <path d="M0 2a2 2 0 012-2h36a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2z" fill="#F7F8FB" />
                <path d="M8.5 4c-2.3 0-3.7 1-3.7 3.2v5.6c0 2.2 1.4 3.2 3.7 3.2 1.8 0 2.9-.6 3.3-1.5h.1v1.5h2.2V4h-2.2v5.6c0 1-.5 1.4-1.4 1.4-.9 0-1.4-.4-1.4-1.4V4z" fill="#635BFF" />
              </svg>
              Secure payments powered by Stripe
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === "compliance" && (
          <div className="tab-panel">
            <h2 className="panel-title">Compliance & Filing</h2>

            {/* LD-2 Calendar */}
            <div className="compliance-section">
              <h3 className="section-title">LD-2 Filing Deadlines</h3>
              <div className="filings-grid">
                {filingPeriods
                  .filter((fp) => fp.type === "LD-2")
                  .map((filing) => (
                    <div key={filing.id} className="filing-card">
                      <div className="filing-header">
                        <h4 className="filing-period">{filing.period}</h4>
                        <span className={`filing-status filing-status--${filing.status}`}>
                          {filing.status === "upcoming" ? "Upcoming" : "Filed"}
                        </span>
                      </div>
                      <div className="filing-due">
                        <span className="due-label">Due:</span>
                        <span className="due-date">{filing.dueDate}</span>
                      </div>
                      {filing.status === "upcoming" && (
                        <div className="days-left">
                          <strong>{filing.daysLeft} days left</strong>
                        </div>
                      )}
                      {filing.status === "filed" && (
                        <div className="filed-date">
                          Filed: {filing.filedDate}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* LD-203 Tracker */}
            <div className="compliance-section">
              <h3 className="section-title">LD-203 Year-End Filing</h3>
              <div className="ld203-card">
                <div className="ld203-header">
                  <h4>2024 Year-End Filing</h4>
                  <span className="filing-status filing-status--filed">Filed</span>
                </div>
                <div className="ld203-content">
                  <div className="ld203-row">
                    <span className="ld203-label">Due Date:</span>
                    <span className="ld203-value">January 30, 2025</span>
                  </div>
                  <div className="ld203-row">
                    <span className="ld203-label">Filed Date:</span>
                    <span className="ld203-value">January 28, 2025</span>
                  </div>
                  <div className="ld203-row">
                    <span className="ld203-label">Status:</span>
                    <span className="ld203-value">
                      <span className="status-badge status-badge--filed">Accepted by Senate</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Notes */}
            <div className="compliance-section">
              <h3 className="section-title">Compliance Notes</h3>
              <div className="compliance-notes">
                <div className="note-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#059669">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  <span>All quarterly LD-2 filings up to date</span>
                </div>
                <div className="note-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#059669">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  <span>Year-end LD-203 filing submitted and accepted</span>
                </div>
                <div className="note-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#D97706">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                  </svg>
                  <span>Q2 2025 LD-2 filing due in 30 days</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Tab */}
        {activeTab === "api" && (
          <div className="tab-panel">
            <h2 className="panel-title">API Access</h2>

            {/* API Key */}
            <div className="api-section">
              <h3 className="section-title">API Key</h3>
              <div className="api-key-box">
                <div className="key-display">
                  <code className="key-code">{maskedApiKey}</code>
                  <button className="btn-copy" title="Copy API key">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>
                <button className="btn btn-secondary">Regenerate Key</button>
              </div>
              <p className="api-note">Keep your API key confidential. If compromised, regenerate immediately.</p>
            </div>

            {/* Rate Limits */}
            <div className="api-section">
              <h3 className="section-title">Rate Limits</h3>
              <div className="rate-limits-box">
                <div className="limit-item">
                  <div className="limit-label">Requests per minute</div>
                  <div className="limit-value">60</div>
                </div>
                <div className="limit-item">
                  <div className="limit-label">Requests per hour</div>
                  <div className="limit-value">3,600</div>
                </div>
                <div className="limit-item">
                  <div className="limit-label">Max request size</div>
                  <div className="limit-value">10 MB</div>
                </div>
                <div className="limit-item">
                  <div className="limit-label">Max response size</div>
                  <div className="limit-value">10 MB</div>
                </div>
              </div>
            </div>

            {/* Usage Chart Placeholder */}
            <div className="api-section">
              <h3 className="section-title">API Usage This Month</h3>
              <div className="usage-chart">
                <svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid meet" className="chart-svg">
                  {/* Simple bar chart representation */}
                  <rect x="20" y="80" width="30" height="50" fill="#3A6FF7" opacity="0.7" />
                  <rect x="60" y="60" width="30" height="70" fill="#3A6FF7" opacity="0.8" />
                  <rect x="100" y="40" width="30" height="90" fill="#3A6FF7" opacity="0.9" />
                  <rect x="140" y="50" width="30" height="80" fill="#3A6FF7" opacity="0.8" />
                  <rect x="180" y="30" width="30" height="100" fill="#3A6FF7" />
                  <rect x="220" y="60" width="30" height="70" fill="#3A6FF7" opacity="0.8" />
                  <rect x="260" y="45" width="30" height="85" fill="#3A6FF7" opacity="0.9" />
                  <rect x="300" y="70" width="30" height="60" fill="#3A6FF7" opacity="0.7" />
                  {/* Axis lines */}
                  <line x1="10" y1="130" x2="350" y2="130" stroke="#D1D5DB" strokeWidth="1" />
                  <line x1="10" y1="10" x2="10" y2="130" stroke="#D1D5DB" strokeWidth="1" />
                </svg>
                <p className="chart-label">Daily API calls over the last 8 days</p>
              </div>
            </div>

            {/* Webhook Configuration */}
            <div className="api-section">
              <h3 className="section-title">Webhooks</h3>
              <div className="webhook-box">
                <label className="form-label">Webhook URL</label>
                <div className="webhook-input-group">
                  <input
                    type="url"
                    className="form-input"
                    value={webhookUrl}
                    readOnly
                  />
                  <button className="btn btn-secondary">Edit</button>
                </div>
                <p className="webhook-note">
                  We'll POST notifications for filing status changes, deadline reminders, and submission completions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
