import React, { useState } from "react";
import {
  Sidebar, Topbar, KPICards, DeadlineCard, TasksCard,
  ActivityCard, InsightsCard, HealthCard, QuickStats, LiveFeedPanel,
} from "../components/dashboard";
import { currentUser } from "../data/dashboardMock";
import "../styles/Dashboard.css";

export default function DashboardPage({ onLogout }) {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [feedOpen, setFeedOpen] = useState(true);

  return (
    <div className="dashboard">
      <Sidebar active={activeNav} onNav={setActiveNav} />
      <div className="dashboard__main">
        <Topbar feedOpen={feedOpen} onToggleFeed={() => setFeedOpen(!feedOpen)} />
        <div className="dashboard__body">
          <div className="dashboard__content">
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
          </div>
          <LiveFeedPanel open={feedOpen} />
        </div>
      </div>
    </div>
  );
}
