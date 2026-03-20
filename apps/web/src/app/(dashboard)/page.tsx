import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Users,
  ClipboardCheck,
  Building2,
  ArrowUpRight,
  Calendar,
} from "lucide-react";

const stats = [
  {
    label: "Active Submissions",
    value: "24",
    change: "+3 this week",
    icon: Send,
    iconBg: "bg-signal-blue-light",
    iconColor: "text-signal-blue",
  },
  {
    label: "Active Clients",
    value: "12",
    change: "+1 this month",
    icon: Users,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    label: "Pending Reviews",
    value: "8",
    change: "3 urgent",
    icon: ClipboardCheck,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    label: "Office Coverage",
    value: "73%",
    change: "435 offices tracked",
    icon: Building2,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

const recentSubmissions = [
  {
    id: "1",
    name: "H.R. 4521 — CHIPS Act Letter",
    client: "Tech Alliance",
    status: "in_review" as const,
    date: "2 hours ago",
  },
  {
    id: "2",
    name: "Clean Energy Tax Credit Testimony",
    client: "GreenFuture Coalition",
    status: "draft" as const,
    date: "5 hours ago",
  },
  {
    id: "3",
    name: "Broadband Expansion Comment",
    client: "Rural Connect PAC",
    status: "approved" as const,
    date: "1 day ago",
  },
  {
    id: "4",
    name: "Defense Authorization Markup Brief",
    client: "Aerospace Industries Assoc.",
    status: "submitted" as const,
    date: "2 days ago",
  },
  {
    id: "5",
    name: "Healthcare Price Transparency Letter",
    client: "Patient First Alliance",
    status: "draft" as const,
    date: "3 days ago",
  },
];

const upcomingDeadlines = [
  {
    id: "1",
    title: "Senate Commerce Hearing — Broadband",
    date: "Mar 25, 2026",
    type: "hearing" as const,
  },
  {
    id: "2",
    title: "House Energy Markup — Clean Energy",
    date: "Mar 28, 2026",
    type: "markup" as const,
  },
  {
    id: "3",
    title: "FCC Comment Filing Deadline",
    date: "Apr 1, 2026",
    type: "filing" as const,
  },
  {
    id: "4",
    title: "Appropriations Subcommittee Testimony",
    date: "Apr 5, 2026",
    type: "hearing" as const,
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

const deadlineTypeColor: Record<string, string> = {
  hearing: "bg-signal-blue-light text-signal-blue",
  markup: "bg-amber-50 text-amber-700",
  filing: "bg-red-50 text-red-700",
  other: "bg-gray-100 text-gray-600",
};

export default function DashboardPage() {
  return (
    <PageShell>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, Jane
        </h1>
        <p className="mt-1 text-sm text-cool-grey">
          Here&apos;s what&apos;s happening with your legislative workflows today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-cool-grey">{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-cool-grey-light">
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Submissions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Recent Submissions</CardTitle>
            <button className="flex items-center gap-1 text-xs font-medium text-signal-blue hover:text-signal-blue-hover transition-colors duration-150">
              View all
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between rounded-lg px-3 py-3 transition-colors duration-150 hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {submission.name}
                    </p>
                    <p className="text-xs text-cool-grey">{submission.client}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    <Badge variant={statusVariant[submission.status]}>
                      {statusLabel[submission.status]}
                    </Badge>
                    <span className="text-xs text-cool-grey-light whitespace-nowrap">
                      {submission.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Upcoming Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-cool-grey" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="rounded-lg border border-gray-100 p-3 transition-colors duration-150 hover:border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 leading-snug">
                      {deadline.title}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${deadlineTypeColor[deadline.type]}`}
                    >
                      {deadline.type}
                    </span>
                    <span className="text-xs text-cool-grey">
                      {deadline.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
