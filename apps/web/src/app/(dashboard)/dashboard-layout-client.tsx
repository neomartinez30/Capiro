"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-soft-white">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Topbar sidebarCollapsed={collapsed} />
      <main
        className={cn(
          "pt-16 transition-all duration-200",
          collapsed ? "pl-[68px]" : "pl-[280px]"
        )}
      >
        {children}
      </main>
    </div>
  );
}
