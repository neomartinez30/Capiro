import React from "react";
import { useFirmData } from "../../hooks/useFirmData";

export default function QuickStats() {
  const { kpis } = useFirmData();

  const stats = [
    { label: "Active Clients", value: kpis.activeClients },
    { label: "Lobbyists Assigned", value: kpis.lobbyistCount },
    { label: "Topics This Qtr", value: kpis.topicCount },
    { label: "Pending Reviews", value: kpis.pendingSubmissions },
  ];

  return (
    <div className="card">
      <div className="card__header"><span className="card__title">Quick Stats</span></div>
      <div className="card__body">
        {stats.map((s, i) => (
          <div key={i} className="stat-row">
            <span className="stat-row__label">{s.label}</span>
            <span className="stat-row__value">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
