import React from "react";
import { quickStats } from "../../data/dashboardMock";

export default function QuickStats() {
  return (
    <div className="card">
      <div className="card__header"><span className="card__title">Quick Stats</span></div>
      <div className="card__body">
        {quickStats.map((s, i) => (
          <div key={i} className="stat-row">
            <span className="stat-row__label">{s.label}</span>
            <span className="stat-row__value">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
