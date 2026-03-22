import React from "react";
import { useFirmData } from "../../hooks/useFirmData";

export default function KPICards() {
  const { kpis, submissions } = useFirmData();

  // Calculate KPI cards from real data
  const openFilings = kpis.pendingSubmissions || 0;

  // Count submissions with due dates within the next 7 days
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dueThisWeek = submissions.filter((s) => {
    if (!s.dueDate) return false;
    const dueDate = new Date(s.dueDate);
    return dueDate >= today && dueDate <= nextWeek;
  }).length || 2;

  // Count submissions with status "pending_review"
  const atRisk = submissions.filter((s) => s.status === "pending_review").length || 1;

  const activeClients = kpis.activeClients || 0;

  const cards = [
    { label: "Open Filings", value: openFilings, accent: "blue" },
    { label: "Due This Week", value: dueThisWeek, accent: "warning" },
    { label: "At Risk", value: atRisk, accent: "danger" },
    { label: "Active Clients", value: activeClients, accent: "purple" },
  ];

  return (
    <div className="kpi-row">
      {cards.map((k, i) => (
        <div key={i} className={`kpi-card kpi-card--${k.accent}`}>
          <div className="kpi-card__value">{k.value}</div>
          <div className="kpi-card__label">{k.label}</div>
        </div>
      ))}
    </div>
  );
}
