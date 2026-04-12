import React from "react";
import { IconHandshake, IconPhone, IconFile, IconRefresh } from "./Icons";
import { recentActivity } from "../../data/dashboardMock";

const TYPE_ICONS = {
  meeting: <IconHandshake size={16} color="#3A6FF7" />,
  call: <IconPhone size={16} color="#10B981" />,
  filing: <IconFile size={16} color="#F59E0B" />,
  update: <IconRefresh size={16} color="#8B5CF6" />,
};

export default function ActivityCard() {
  return (
    <div className="card">
      <div className="card__header"><span className="card__title">Recent Activity</span><span className="card__link">&bull;&bull;&bull;</span></div>
      <div className="card__list">
        {recentActivity.map((a) => (
          <div key={a.id} className="list-row">
            <span className="activity-icon">{TYPE_ICONS[a.type]}</span>
            <span className="activity-label">{a.action}</span>
            <span className="activity-date">{a.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
