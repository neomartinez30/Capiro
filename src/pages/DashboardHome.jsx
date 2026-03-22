import React from "react";
import { useAuth } from "../context/AuthContext";
import { KPICards, DeadlineCard, TasksCard, ActivityCard, InsightsCard, HealthCard, QuickStats } from "../components/dashboard";

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Compliance Overview</h1>
          <p className="page-header__subtitle">Welcome back, {user?.name || "there"}</p>
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
