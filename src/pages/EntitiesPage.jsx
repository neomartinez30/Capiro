import React, { useState } from "react";
import { useFirmData } from "../hooks/useFirmData";
import "../styles/Entities.css";

const INDUSTRY_COLORS = {
  "Defense & Aerospace": "#EF4444",
  "Healthcare Technology": "#3B82F6",
  "Clean Energy": "#10B981",
  "Technology": "#8B5CF6",
  "Agriculture & Food": "#F59E0B",
};

const getAvatarColor = (industry) => INDUSTRY_COLORS[industry] || "#6B7280";

const ClientDetailPanel = ({ client, onClose }) => {
  c  st [activeTab, setActiveTab] = useState("topics");
  const clientTopics = topics.filter(t => t.clientId === client.id);
  const clientSubmissions = submissions.filter(s =>
    clientTopics.some(t => t.id === s.topicId)
  );

  const getOfficeNames = (officeIds) => {
    return officeIds
      .map(id => offices.find(o => o.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const statusColors = {
    drafting: "#9CA3AF",
    review: "#D97706",
    submitted: "#3B82F6",
    approved: "#059669",
  };

  return (
    <div className="detail-panel">
      <div className="detail-panel__overlay" onClick={onClose} />
      <div className="detail-panel__content">
        <div className="detail-panel__header">
          <div className="detail-panel__title-block">
            <div
              className="detail-panel__avatar"
              style={{ backgroundColor: getAvatarColor(client.industry) }}
            >
              {client.avatar}
            </div>
            <div>
              <h2 className="detail-panel__name">{client.name}</h2>
              <p className="detail-panel__subtitle">{client.industry}</p>
            </div>
          </div>
          <button className="detail-panel__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="detail-panel__tabs">
          <button
            className={`detail-panel__tab ${activeTab === "topics" ? "active" : ""}`}
            onClick={() => setActiveTab("topics")}
          >
            Topics
          </button>
          <button
            className={`detail-panel__tab ${activeTab === "submissions" ? "active" : ""}`}
            onClick={() => setActiveTab("submissions")}
          >
            Submissions
          </button>
          <button
            className={`detail-panel__tab ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            Activity
          </button>
        </div>

        <div className="detail-panel__body">
          {activeTab === "topics" && (
            <div className="detail-panel__section">
              {clientTopics.length === 0 ? (
                <p className="detail-panel__empty">No topics for this client.</p>
              ) : (
                <div className="detail-panel__list">
                  {clientTopics.map(topic => (
                    <div key={topic.id} className="detail-item">
                      <div className="detail-item__header">
                        <h4 className="detail-item__title">{topic.name}</h4>
                        <span
                          className="detail-item__badge"
                          style={{ backgroundColor: statusColors[topic.status] }}
                        >
                          {topic.status}
                        </span>
                      </div>
                      <p className="detail-item__desc">{topic.description}</p>
                      <div className="detail-item__meta">
                        <div>
                          <span className="detail-item__label">Target Offices:</span>
                          <span className="detail-item__value">
                            {getOfficeNames(topic.targetOffices) || "—"}
                          </span>
                        </div>
                        {topic.fundingAmount && (
                          <div>
                            <span className="detail-item__label">Funding:</span>
                            <span className="detail-item__value">
                              ${(topic.fundingAmount / 1000000).toFixed(1)}M
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "submissions" && (
            <div className="detail-panel__section">
              {clientSubmissions.length === 0 ? (
                <p className="detail-panel__empty">No submissions yet.</p>
              ) : (
                <div className="detail-panel__list">
                  {clientSubmissions.map(submission => (
                    <div key={submission.id} className="detail-item">
                      <div className="detail-item__header">
                        <h4 className="detail-item__title">{submission.title}</h4>
                        <span
                          className="detail-item__badge"
                          style={{ backgroundColor: statusColors[submission.status] }}
                        >
                          {submission.status}
                        </span>
                      </div>
                      <div className="detail-item__meta">
                        <div>
                          <span className="detail-item__label">Type:</span>
                          <span className="detail-item__value">{submission.type}</span>
                        </div>
                        <div>
                          <span className="detail-item__label">Last Edited:</span>
                          <span className="detail-item__value">
                            {new Date(submission.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="detail-panel__section">
              <div className="detail-panel__list">
                <div className="detail-item">
                  <p className="detail-item__title">Client added to Capiro</p>
                  <p className="detail-item__desc">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="detail-item">
                  <p className="detail-item__title">{clientTopics.length} active topics</p>
                  <p className="detail-item__desc">
                    Across {new Set(clientSubmissions.map(s => s.type)).size} submission types
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="detail-panel__ai">
          <div className="detail-panel__ai-title">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1a7 7 0 110 14A7 7 0 018 1zm0 2a5 5 0 100 10A5 5 0 008 3z"
                fill="currentColor"
              />
            </svg>
            AI Insights
          </div>
          <div className="detail-panel__ai-list">
            <div className="ai-insight">
              <p className="ai-insight__text">
                3 new policy opportunities match {client.name}'s defense technology focus
              </p>
              <button className="ai-insight__btn">Explore</button>
            </div>
            <div className="ai-insight">
              <p className="ai-insight__text">
                Recommend submitting to 2 additional committees based on topic alignment
              </p>
              <button className="ai-insight__btn">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddClientModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    industry: "",
    description: "",
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Add Client</h3>
          <button className="modal__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal__form">
          <div className="form-group">
            <label className="form-label">Client Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Northrop Defense Systems"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Website</label>
            <div className="form-input-group">
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="form-input"
              />
              <button type="button" className="form-btn-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 8a2 2 0 11-4 0 2 2 0 014 0z" fill="currentColor" opacity="0.3" />
                  <path d="M12 2H4a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <p className="form-hint">AI will scrape company info</p>
          </div>
          <div className="form-group">
            <label className="form-label">Industry</label>
            <select name="industry" value={formData.industry} onChange={handleChange} className="form-input" required>
              <option value="">Select industry</option>
              <option>Defense & Aerospace</option>
              <option>Healthcare Technology</option>
              <option>Clean Energy</option>
              <option>Technology</option>
              <option>Agriculture & Food</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief overview of the client's business..."
              className="form-input form-textarea"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., Defense, AI, Aerospace"
              className="form-input"
            />
          </div>
          <div className="modal__actions">
            <button type="button" onClick={onClose} className="btn btn--secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function EntitiesPage() {
  const { clients, topics, submissions, allOffices: offices } = useFirmData();
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [selectedClient, setSelectedClient] = useState(null);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = !industryFilter || client.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const industries = [...new Set(clients.map(c => c.industry))];

  return (
    <div className="entities-page">
      {/* Header */}
      <div className="entities-header">
        <div className="entities-header__left">
          <h1 className="entities-header__title">Clients</h1>
          <span className="entities-header__badge">{filteredClients.length}</span>
        </div>
        <button className="btn btn--primary" onClick={() => setAddClientOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add Client
        </button>
      </div>

      {/* Controls */}
      <div className="entities-controls">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M7 1a6 6 0 015.745 8.745l4 4m-5 0a6 6 0 110-12 6 6 0 010 12z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-box__input"
          />
        </div>

        <select
          value={industryFilter}
          onChange={e => setIndustryFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Industries</option>
          {industries.map(ind => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>

        <div className="view-toggle">
          <button
            className={`view-toggle__btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="6" height="6" rx="1" />
              <rect x="9" y="1" width="6" height="6" rx="1" />
              <rect x="1" y="9" width="6" height="6" rx="1" />
              <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
          </button>
          <button
            className={`view-toggle__btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="2" width="14" height="3" rx="1" />
              <rect x="1" y="6.5" width="14" height="3" rx="1" />
              <rect x="1" y="11" width="14" height="3" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="entities-grid">
          {filteredClients.map(client => {
            const clientTopics = topics.filter(t => t.clientId === client.id);
            return (
              <div
                key={client.id}
                className="client-card"
                onClick={() => setSelectedClient(client)}
              >
                <div
                  className="client-card__avatar"
                  style={{ backgroundColor: getAvatarColor(client.industry) }}
                >
                  {client.avatar}
                </div>
                <h3 className="client-card__name">{client.name}</h3>
                <p className="client-card__industry">{client.industry}</p>
                <div className="client-card__tags">
                  {client.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="client-card__tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="client-card__stats">
                  <div className="client-card__stat">
                    <span className="client-card__stat-label">Topics</span>
                    <span className="client-card__stat-value">{clientTopics.length}</span>
                  </div>
                  <div className="client-card__stat">
                    <span className="client-card__stat-label">Annual Spend</span>
                    <span className="client-card__stat-value">
                      ${(client.annualSpend / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
                <div className="client-card__status">
                  <span className={`status-badge status-badge--${client.status}`}>
                    {client.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="entities-list">
          {filteredClients.map(client => {
            const clientTopics = topics.filter(t => t.clientId === client.id);
            return (
              <div
                key={client.id}
                className="entities-list__row"
                onClick={() => setSelectedClient(client)}
              >
                <div className="entities-list__cell entities-list__cell--avatar">
                  <div
                    className="client-list-avatar"
                    style={{ backgroundColor: getAvatarColor(client.industry) }}
                  >
                    {client.avatar}
                  </div>
                </div>
                <div className="entities-list__cell entities-list__cell--name">
                  <p className="entities-list__name">{client.name}</p>
                  <p className="entities-list__meta">{client.industry}</p>
                </div>
                <div className="entities-list__cell entities-list__cell--tags">
                  {client.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="client-card__tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="entities-list__cell entities-list__cell--topics">
                  {clientTopics.length} topic{clientTopics.length !== 1 ? "s" : ""}
                </div>
                <div className="entities-list__cell entities-list__cell--spend">
                  ${(client.annualSpend / 1000).toFixed(0)}K
                </div>
                <div className="entities-list__cell entities-list__cell--status">
                  <span className={`status-badge status-badge--${client.status}`}>
                    {client.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {selectedClient && (
        <ClientDetailPanel
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
      <AddClientModal isOpen={addClientOpen} onClose={() => setAddClientOpen(false)} />
    </div>
  );
}
