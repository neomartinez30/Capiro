import React, { useState } from "react";
import { searchRegistrants } from "../../services/ldaApi";

/**
 * Modal to search LDA.gov for a registrant (firm) by name and import profile data.
 */
export default function LdaSearchModal({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await searchRegistrants({ name: query.trim() });
      setResults(data.results || []);
      if ((data.results || []).length === 0) {
        setError("No registrants found. Try a different search term.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal lda-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Search LDA.gov Registrants</h2>
          <button type="button" className="modal__close" onClick={onClose}>&times;</button>
        </div>
        <form className="lda-search-modal__form" onSubmit={handleSearch}>
          <input
            className="form-field__input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter firm / registrant name..."
            autoFocus
          />
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {error && <p className="lda-search-modal__error">{error}</p>}
        <div className="lda-search-modal__results">
          {results.map((reg) => (
            <div
              key={reg.id}
              className="lda-search-modal__result"
              onClick={() => onSelect(reg)}
            >
              <div className="lda-search-modal__result-name">{reg.name}</div>
              <div className="lda-search-modal__result-meta">
                ID: {reg.id}
                {reg.house_registrant_id && ` | House ID: ${reg.house_registrant_id}`}
                {reg.city && ` | ${reg.city}, ${reg.state || ""}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
