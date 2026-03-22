import React from "react";
import Icon from "./Icons";

const NAV_ITEMS = [
  { id: "dashboard",   label: "Dashboard",      icon: "grid" },
  { id: "entities",    label: "Entities",        icon: "building" },
  { id: "activities",  label: "Activities",      icon: "calendar" },
  { id: "issues",      label: "Issues & Policy", icon: "flag" },
  { id: "filings",     label: "Filings",         icon: "file" },
  { id: "disclosures", label: "Disclosures",     icon: "eye" },
  { id: "workflow",    label: "Workflow",         icon: "workflow" },
  { id: "analytics",   label: "Analytics",       icon: "chart" },
  { id: "copilot",     label: "AI Copilot",      icon: "sparkle" },
  { id: "admin",       label: "Admin",           icon: "settings" },
];

export default function Sidebar({ active = "dashboard", onNav }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">Capiro</div>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((n) => (
          <div
            key={n.id}
            className={`sidebar__item${n.id === active ? " sidebar__item--active" : ""}`}
            onClick={() => onNav?.(n.id)}
          >
            <Icon name={n.icon} size={18} color={n.id === active ? "#fff" : "rgba(255,255,255,0.6)"} />
            <span>{n.label}</span>
          </div>
        ))}
      </nav>
      <div className="sidebar__bottom">
        <div className="sidebar__item">
          <Icon name="bell" size={18} color="rgba(255,255,255,0.6)" />
          <span>Notifications</span>
        </div>
        <div className="sidebar__item">
          <Icon name="help" size={18} color="rgba(255,255,255,0.6)" />
          <span>Help</span>
        </div>
      </div>
    </aside>
  );
}
