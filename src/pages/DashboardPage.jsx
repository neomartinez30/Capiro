import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar, Topbar, KPICards, DeadlineCard, TasksCard,
  ActivityCard, InsightsCard, HealthCard, QuickStats, LiveFeedPanel,
} from "../components/dashboard";
import LobbyistProfilePage from "./LobbyistProfilePage";
import FirmProfilePage from "./FirmProfilePage";
import ClientProfilePage from "./ClientProfilePage";
import { currentUser } from "../data/dashboardMock";
import "../styles/Dashboard.css";
import "../styles/Profile.css";

function DashboardContent() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Compliance Overview</h1>
          <p className="page-header__subtitle">Welcome back, {currentUser.name}</p>
        </div>
      </div>
      <KPICards />
      <div className="content-grid">
        <div className="content-grid__col">
          <DeadlineCard />
          <TasksCard />
          <ActivityCard />
        </div>
        <div className="content-grid__col">
          <InsightsCard />
          <HealthCard />
          <QuickStats />
        </div>
      </div>
    </>
  );
}

const PAGE_COMPONENTS = {
  "lobbyist-profile": LobbyistProfilePage,
  "firm-profile": FirmProfilePage,
  "client-profile": ClientProfilePage,
};

export default function DashboardPage({ onLogout, page }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive active nav from path
  const getActiveNav = () => {
    if (page === "lobbyist-profile" || page === "firm-profile" || page === "client-profile") return "entities";
    if (location.pathname.startsWith("/profiles")) return "entities";
    return "dashboard";
  };

  const [activeNav, setActiveNav] = useState(getActiveNav());
  const [feedOpen, setFeedOpen] = useState(true);

  const handleNav = (id) => {
    setActiveNav(id);
    if (id === "dashboard") navigate("/dashboard");
    else if (id === "entities") navigate("/profiles/lobbyist");
    // Other nav items can be wired up later
  };

  const PageComponent = PAGE_COMPONENTS[page];

  return (
    <div className="dashboard">
      <Sidebar active={activeNav} onNav={handleNav} />
      <div className="dashboard__main">
        <Topbar feedOpen={feedOpen} onToggleFeed={() => setFeedOpen(!feedOpen)} />
        <div className="dashboard__body">
          <div className="dashboard__content">
            {PageComponent ? <PageComponent /> : <DashboardContent />}
          </div>
          <LiveFeedPanel open={feedOpen} />
        </div>
      </div>
    </div>
  );
}
