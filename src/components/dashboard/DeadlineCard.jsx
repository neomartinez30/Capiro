import React from "react";
import { upcomingDeadlines } from "../../data/dashboardMock";

export default function DeadlineCard() {
  return (
    <div className="card">
      <div className="card__header"><span className="card__title">Upcoming Deadlines</span><span className="card__link">View all</span></div>
      <div className="card__list">
        {upcomingDeadlines.map((d) => (
          <div key={d.id} className="list-row list-row--spaced">
            <span className={`type-badge type-badge--${d.priority}`}>{d.type}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{d.label}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{d.date}</div>
            </div>
            <span className={`days-count ${d.daysLeft <= 10 ? "days-count--urgent" : "days-count--normal"}`}>{d.daysLeft}d</span>
          </div>
        ))}
      </div>
    </div>
  );
}
