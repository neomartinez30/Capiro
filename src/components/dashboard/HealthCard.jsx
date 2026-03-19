import React from "react";
import { complianceHealth } from "../../data/dashboardMock";

export default function HealthCard() {
  const h = complianceHealth;
  const circ = 2 * Math.PI * 42;
  const offset = circ - (h.score / 100) * circ;
  const sc = h.score >= 80 ? "#059669" : h.score >= 60 ? "#D97706" : "#DC2626";
  const bars = [{ label: "Filings", val: h.filings }, { label: "Disclosures", val: h.disclosures }, { label: "Activities", val: h.activities }];
  const bc = (v) => (v >= 80 ? "health__bar-fill--good" : v >= 60 ? "health__bar-fill--warning" : "health__bar-fill--danger");

  return (
    <div className="card">
      <div className="card__header"><span className="card__title">Compliance Health</span></div>
      <div className="health">
        <div className="health__ring">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="42" fill="none" stroke="#F0F1F3" strokeWidth="8" />
            <circle cx="48" cy="48" r="42" fill="none" stroke={sc} strokeWidth="8" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 48 48)" style={{ transition: "stroke-dashoffset 1s ease" }} />
          </svg>
          <div className="health__ring-label">
            <span className="health__ring-score">{h.score}</span>
            <span className="health__ring-status" style={{ color: sc }}>{h.label}</span>
          </div>
        </div>
        <div className="health__bars">
          {bars.map((b) => (
            <div key={b.label} className="health__bar">
              <div className="health__bar-header"><span className="health__bar-label">{b.label}</span><span className="health__bar-value">{b.val}%</span></div>
              <div className="health__bar-track"><div className={`health__bar-fill ${bc(b.val)}`} style={{ width: `${b.val}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
