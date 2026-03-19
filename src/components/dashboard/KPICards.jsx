import React from "react";
import { kpiCards } from "../../data/dashboardMock";

export default function KPICards() {
  return (
    <div className="kpi-row">
      {kpiCards.map((k, i) => (
        <div key={i} className={`kpi-card kpi-card--${k.accent}`}>
          <div className="kpi-card__value">{k.value}</div>
          <div className="kpi-card__label">{k.label}</div>
        </div>
      ))}
    </div>
  );
}
