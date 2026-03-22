import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Topbar, LiveFeedPanel } from "../components/dashboard";
import DashboardHome from "./DashboardHome";
import EntitiesPage from "./EntitiesPage";
import SubmissionsPage from "./SubmissionsPage";
import OfficesPage from "./OfficesPage";
import SettingsPage from "./SettingsPage";
import Icon from "../components/dashboard/Icons";
import "../styles/Dashboard.css";

const NAV_ITEMS = [
  { id: "dashboard",   path: "",             label: "Dashboard",      icon: "grid" },
  { id: "entities",    path: "entities",     label: "Clients",        icon: "building" },
  { id: "submissions", path: "submissions",  label: "Submissions",    icon: "file" },
  { id: "offices",     path: "offices",      label: "Offices",        icon: "flag" },
  { id: "settings",    path: "settings",     label: "Settings",       icon: "settings" },
];

const BOTTOM_ITEMS = [
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "help",          label: "Help",          icon: "help" },
];

function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const currentPath = location.pathname.replace("/app/", "").replace("/app", "");

  const getActive = (path) => {
    if (path === "" && (currentPath === "" || currentPath === "/")) return true;
    if (path !== "" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">Capiro</div>
      {user?.orgName && (
        <div style={{ padding: "0 12px 8px", margin: "0 8px" }}>
          <div style={{
            padding: "6px 10px", borderRadius: 6,
            background: "rgba(58,111,247,0.15)", fontSize: 11,
            color: "rgba(255,255,255,0.8)", fontWeight: 500,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
          }}>
            {user.orgName}
          </div>
        </div>
      )}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((n) => (
          <div
            key={n.id}
            className={`sidebar__item${getActive(n.path) ? " sidebar__item--active" : ""}`}
            onClick={() => navigate(`/app/${n.path}`)}
          >
            <Icon name={n.icon} size={18} color={getActive(n.path) ? "#fff" : "rgba(255,255,255,0.6)"} />
            <span>{n.label}</span>
          </div>
        ))}
      </nav>
      <div className="sidebar__bottom">
        {BOTTOM_ITEMS.map((n) => (
          <div key={n.id} className="sidebar__item">
            <Icon name={n.icon} size={18} color="rgba(255,255,255,0.6)" />
            <span>{n.label}</span>
          </div>
        ))}
        <div className="sidebar__item" onClick={onLogout} style={{ cursor: "pointer" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Sign Out</span>
        </div>
      </div>
    </aside>
  );
}

export default function DashboardLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [feedOpen, setFeedOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="dashboard">
      <Sidebar onLogout={handleLogout} />
      <div className="dashboard__main">
        <Topbar feedOpen={feedOpen} onToggleFeed={() => setFeedOpen(!feedOpen)} />
        <div className="dashboard__body">
          <div className="dashboard__content">
            <Routes>
              <Route index element={<DashboardHome />} />
              <Route path="entities" element={<EntitiesPage />} />
              <Route path="submissions" element={<SubmissionsPage />} />
              <Route path="offices" element={<OfficesPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Routes>
          </div>
          <LiveFeedPanel open={feedOpen} />
        </div>
      </div>
    </div>
  );
}
