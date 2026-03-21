import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icons";

const NAV_ITEMS = [
  { id: "dashboard",   label: "Dashboard",      icon: "grid",     path: "/dashboard" },
  {
    id: "entities",
    label: "Entities",
    icon: "building",
    children: [
      { id: "lobbyist-profile", label: "Lobbyist Profile", path: "/profiles/lobbyist" },
      { id: "firm-profile",     label: "Firm Profile",     path: "/profiles/firm" },
      { id: "client-profile",   label: "Client Profile",   path: "/profiles/client" },
    ],
  },
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
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedId, setExpandedId] = useState(
    location.pathname.startsWith("/profiles") ? "entities" : null
  );

  const handleClick = (item) => {
    if (item.children) {
      setExpandedId(expandedId === item.id ? null : item.id);
      // Navigate to first child
      navigate(item.children[0].path);
      onNav?.(item.id);
    } else if (item.path) {
      navigate(item.path);
      onNav?.(item.id);
    } else {
      onNav?.(item.id);
    }
  };

  const handleChildClick = (child) => {
    navigate(child.path);
    onNav?.(child.id);
  };

  const isChildActive = (child) => location.pathname.startsWith(child.path);

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">Capiro</div>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((n) => (
          <div key={n.id}>
            <div
              className={`sidebar__item${n.id === active || (n.children && expandedId === n.id) ? " sidebar__item--active" : ""}`}
              onClick={() => handleClick(n)}
            >
              <Icon name={n.icon || "building"} size={18} color={n.id === active || expandedId === n.id ? "#fff" : "rgba(255,255,255,0.6)"} />
              <span>{n.label}</span>
              {n.children && (
                <span className={`sidebar__chevron ${expandedId === n.id ? "sidebar__chevron--open" : ""}`}>
                  &#9662;
                </span>
              )}
            </div>
            {n.children && expandedId === n.id && (
              <div className="sidebar__children">
                {n.children.map((child) => (
                  <div
                    key={child.id}
                    className={`sidebar__child${isChildActive(child) ? " sidebar__child--active" : ""}`}
                    onClick={() => handleChildClick(child)}
                  >
                    {child.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="sidebar__bottom">
        <div className="sidebar__item"><Icon name="bell" size={18} color="rgba(255,255,255,0.6)" /><span>Notifications</span></div>
        <div className="sidebar__item"><Icon name="help" size={18} color="rgba(255,255,255,0.6)" /><span>Help</span></div>
      </div>
    </aside>
  );
}
