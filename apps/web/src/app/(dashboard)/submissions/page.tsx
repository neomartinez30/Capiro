"use client";

import React from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Send, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "In Review", value: "in_review" },
  { label: "Approved", value: "approved" },
  { label: "Submitted", value: "submitted" },
];

const submissions = [
  {
    id: "1",
    name: "H.R. 4521 — CHIPS Act Letter",
    client: "Tech Alliance",
    topic: "Semiconductor Policy",
    status: "in_review" as const,
    targetOffices: 12,
    lastModified: "Mar 20, 2026",
  },
  {
    id: "2",
    name: "Clean Energy Tax Credit Testimony",
    client: "GreenFuture Coalition",
    topic: "Energy & Climate",
    status: "draft" as const,
    targetOffices: 8,
    lastModified: "Mar 19, 2026",
  },
  {
    id: "3",
    name: "Broadband Expansion Comment",
    client: "Rural Connect PAC",
    topic: "Telecommunications",
    status: "approved" as const,
    targetOffices: 24,
    lastModified: "Mar 18, 2026",
  },
  {
    id: "4",
    name: "Defense Authorization Markup Brief",
    client: "Aerospace Industries Assoc.",
    topic: "Defense & National Security",
    status: "submitted" as const,
    targetOffices: 6,
    lastModified: "Mar 17, 2026",
  },
  {
    id: "5",
    name: "Healthcare Price Transparency Letter",
    client: "Patient First Alliance",
    topic: "Healthcare Reform",
    status: "draft" as const,
    targetOffices: 15,
    lastModified: "Mar 16, 2026",
  },
  {
    id: "6",
    name: "Education Funding Appropriations Brief",
    client: "National Education Council",
    topic: "Education Policy",
    status: "in_review" as const,
    targetOffices: 10,
    lastModified: "Mar 15, 2026",
  },
  {
    id: "7",
    name: "Infrastructure Investment Testimony",
    client: "Rural Connect PAC",
    topic: "Infrastructure",
    status: "approved" as const,
    targetOffices: 18,
    lastModified: "Mar 14, 2026",
  },
];

const statusVariant: Record<string, "draft" | "review" | "approved" | "submitted"> = {
  draft: "draft",
  in_review: "review",
  approved: "approved",
  submitted: "submitted",
};

const statusLabel: Record<string, string> = {
  draft: "Draft",
  in_review: "In Review",
  approved: "Approved",
  submitted: "Submitted",
};

export default function SubmissionsPage() {
  const [activeTab, setActiveTab] = React.useState("all");

  const filtered =
    activeTab === "all"
      ? submissions
      : submissions.filter((s) => s.status === activeTab);

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Submissions</h1>
          <p className="mt-1 text-sm text-cool-grey">
            Track and manage all legislative submissions across your clients.
          </p>
        </div>
        <Button variant="accent" className="gap-2">
          <Plus className="h-4 w-4" />
          New Submission
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150",
              activeTab === tab.value
                ? "bg-capiro-blue text-white shadow-sm"
                : "text-cool-grey hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-4 border-b border-gray-100 px-6 py-3 text-xs font-medium uppercase tracking-wider text-cool-grey">
              <div className="col-span-4">Submission</div>
              <div className="col-span-2">Client</div>
              <div className="col-span-2">Topic</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-center">Offices</div>
              <div className="col-span-2 text-right">Modified</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {filtered.map((submission) => (
                <div
                  key={submission.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 transition-colors duration-150 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      <FileText className="h-4 w-4 text-cool-grey" />
                    </div>
                    <p className="truncate text-sm font-medium text-gray-900">
                      {submission.name}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="truncate text-sm text-gray-700">
                      {submission.client}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="truncate text-sm text-cool-grey">
                      {submission.topic}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <Badge variant={statusVariant[submission.status]}>
                      {statusLabel[submission.status]}
                    </Badge>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="text-sm text-gray-700">
                      {submission.targetOffices}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-sm text-cool-grey">
                      {submission.lastModified}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <Send className="h-7 w-7 text-cool-grey" />
          </div>
          <h3 className="mt-4 text-sm font-medium text-gray-900">
            No submissions found
          </h3>
          <p className="mt-1 text-sm text-cool-grey">
            No submissions match the selected filter. Try a different tab.
          </p>
        </div>
      )}
    </PageShell>
  );
}
