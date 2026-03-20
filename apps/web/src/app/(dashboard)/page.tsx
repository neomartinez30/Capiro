'use client';

import { useState } from 'react';
import { PageShell } from '@/components/layout/page-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Users,
  ClipboardCheck,
  Building2,
  ArrowUpRight,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

/* ─── data ─── */

const stats = [
  {
    label: 'Active Submissions',
    value: '24',
    change: '+12%',
    changeLabel: 'vs last week',
    positive: true,
    icon: Send,
    gradient: 'from-blue-500 to-indigo-600',
    sparkline: [4, 7, 5, 9, 6, 8, 12, 10, 14, 11, 16, 24],
  },
  {
    label: 'Active Clients',
    value: '12',
    change: '+8%',
    changeLabel: 'vs last month',
    positive: true,
    icon: Users,
    gradient: 'from-emerald-500 to-teal-600',
    sparkline: [6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12],
  },
  {
    label: 'Pending Reviews',
    value: '8',
    change: '-3',
    changeLabel: 'from yesterday',
    positive: false,
    icon: ClipboardCheck,
    gradient: 'from-amber-500 to-orange-600',
    sparkline: [12, 14, 11, 10, 13, 9, 11, 8, 10, 9, 7, 8],
  },
  {
    label: 'Office Coverage',
    value: '73%',
    change: '+5%',
    changeLabel: '435 offices',
    positive: true,
    icon: Building2,
    gradient: 'from-violet-500 to-purple-600',
    sparkline: [55, 58, 60, 62, 64, 65, 67, 68, 70, 71, 72, 73],
  },
];

const recentSubmissions = [
  { id: '1', name: 'H.R. 4521 — CHIPS Act Letter', client: 'Tech Alliance', status: 'in_review' as const, date: '2 hours ago', progress: 75 },
  { id: '2', name: 'Clean Energy Tax Credit Testimony', client: 'GreenFuture Coalition', status: 'draft' as const, date: '5 hours ago', progress: 30 },
  { id: '3', name: 'Broadband Expansion Comment', client: 'Rural Connect PAC', status: 'approved' as const, date: '1 day ago', progress: 100 },
  { id: '4', name: 'Defense Authorization Markup Brief', client: 'Aerospace Industries Assoc.', status: 'submitted' as const, date: '2 days ago', progress: 100 },
  { id: '5', name: 'Healthcare Price Transparency Letter', client: 'Patient First Alliance', status: 'draft' as const, date: '3 days ago', progress: 15 },
];

const upcomingDeadlines = [
  { id: '1', title: 'Senate Commerce Hearing — Broadband', date: 'Mar 25', daysLeft: 5, type: 'hearing' as const },
  { id: '2', title: 'House Energy Markup — Clean Energy', date: 'Mar 28', daysLeft: 8, type: 'markup' as const },
  { id: '3', title: 'FCC Comment Filing Deadline', date: 'Apr 1', daysLeft: 12, type: 'filing' as const },
  { id: '4', title: 'Appropriations Subcommittee Testimony', date: 'Apr 5', daysLeft: 16, type: 'hearing' as const },
];

const activityFeed = [
  { id: '1', user: 'Sarah Chen', action: 'approved', target: 'CHIPS Act Letter', time: '12 min ago', icon: CheckCircle2, color: 'text-emerald-500' },
  { id: '2', user: 'Mike Torres', action: 'commented on', target: 'Clean Energy Testimony', time: '1 hour ago', icon: FileText, color: 'text-signal-blue' },
  { id: '3', user: 'AI Assistant', action: 'generated draft for', target: 'Broadband Comment', time: '2 hours ago', icon: Zap, color: 'text-amber-500' },
  { id: '4', user: 'Jane Doe', action: 'submitted', target: 'Defense Brief', time: '4 hours ago', icon: Send, color: 'text-violet-500' },
  { id: '5', user: 'Tom Walsh', action: 'flagged review for', target: 'Healthcare Letter', time: '6 hours ago', icon: AlertCircle, color: 'text-red-500' },
];

const weeklyData = [
  { day: 'Mon', submissions: 3, reviews: 2 },
  { day: 'Tue', submissions: 5, reviews: 4 },
  { day: 'Wed', submissions: 4, reviews: 3 },
  { day: 'Thu', submissions: 7, reviews: 5 },
  { day: 'Fri', submissions: 6, reviews: 4 },
  { day: 'Sat', submissions: 2, reviews: 1 },
  { day: 'Sun', submissions: 1, reviews: 0 },
];

const pipelineData = [
  { stage: 'Drafting', count: 8, color: '#6B7280', width: 40 },
  { stage: 'In Review', count: 6, color: '#D97706', width: 30 },
  { stage: 'Approved', count: 5, color: '#059669', width: 25 },
  { stage: 'Submitted', count: 12, color: '#3A6FF7', width: 60 },
];

const statusVariant: Record<string, 'draft' | 'review' | 'approved' | 'submitted'> = {
  draft: 'draft',
  in_review: 'review',
  approved: 'approved',
  submitted: 'submitted',
};

const statusLabel: Record<string, string> = {
  draft: 'Draft',
  in_review: 'In Review',
  approved: 'Approved',
  submitted: 'Submitted',
};

const deadlineTypeStyles: Record<string, { bg: string; ring: string; dot: string }> = {
  hearing: { bg: 'bg-blue-50', ring: 'ring-blue-200', dot: 'bg-signal-blue' },
  markup: { bg: 'bg-amber-50', ring: 'ring-amber-200', dot: 'bg-amber-500' },
  filing: { bg: 'bg-red-50', ring: 'ring-red-200', dot: 'bg-red-500' },
};

const progressColor: Record<string, string> = {
  draft: '#6B7280',
  in_review: '#D97706',
  approved: '#059669',
  submitted: '#3A6FF7',
};

/* ─── Sparkline SVG ─── */

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ');
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#spark-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={w}
        cy={h - ((data[data.length - 1] - min) / range) * h}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}

/* ─── Mini Bar Chart ─── */

function WeeklyChart({ data }: { data: typeof weeklyData }) {
  const max = Math.max(...data.map((d) => d.submissions));
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d) => (
        <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
          <div className="relative w-full flex gap-0.5 items-end" style={{ height: '96px' }}>
            <div
              className="flex-1 rounded-t-sm bg-signal-blue/20 transition-all duration-500"
              style={{ height: `${(d.submissions / max) * 100}%` }}
            />
            <div
              className="flex-1 rounded-t-sm bg-signal-blue transition-all duration-500"
              style={{ height: `${(d.reviews / max) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-cool-grey font-medium">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Progress Ring ─── */

function ProgressRing({ value, size = 52, strokeWidth = 4, color }: { value: number; size?: number; strokeWidth?: number; color: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E5E7EB" strokeWidth={strokeWidth} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-[stroke-dashoffset] duration-700 ease-out"
      />
    </svg>
  );
}

/* ─── Urgency bar for deadlines ─── */

function UrgencyBar({ daysLeft }: { daysLeft: number }) {
  const pct = Math.max(0, Math.min(100, ((21 - daysLeft) / 21) * 100));
  const color = daysLeft <= 5 ? '#EF4444' : daysLeft <= 10 ? '#F59E0B' : '#3A6FF7';
  return (
    <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

/* ─── page ─── */

export default function DashboardPage() {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  return (
    <PageShell>
      {/* Welcome with gradient accent line */}
      <div className="mb-8 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-signal-blue to-violet-500" />
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, Jane
        </h1>
        <p className="mt-1 text-sm text-cool-grey">
          Here&apos;s what&apos;s happening with your legislative workflows today.
        </p>
      </div>

      {/* ─── KPI Cards with sparklines ─── */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card
            key={stat.label}
            className="group relative overflow-hidden cursor-default"
            onMouseEnter={() => setHoveredStat(i)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            {/* Gradient accent bar at top */}
            <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${stat.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-cool-grey">
                    {stat.label}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-gray-900 tabular-nums">
                      {stat.value}
                    </p>
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                        stat.positive ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {stat.positive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {stat.change}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-cool-grey/70">{stat.changeLabel}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Sparkline */}
              <div className={`mt-3 transition-opacity duration-300 ${hoveredStat === i ? 'opacity-100' : 'opacity-60'}`}>
                <Sparkline
                  data={stat.sparkline}
                  color={stat.gradient.includes('blue') ? '#3A6FF7' : stat.gradient.includes('emerald') ? '#059669' : stat.gradient.includes('amber') ? '#D97706' : '#8B5CF6'}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── Middle Row: Weekly chart + Pipeline ─── */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Weekly Activity */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Weekly Activity</CardTitle>
              <p className="text-xs text-cool-grey mt-1">Submissions &amp; reviews this week</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-signal-blue/20" />
                Submissions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-signal-blue" />
                Reviews
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <WeeklyChart data={weeklyData} />
          </CardContent>
        </Card>

        {/* Submission Pipeline */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Pipeline</CardTitle>
              <p className="text-xs text-cool-grey mt-1">Current stage breakdown</p>
            </div>
            <BarChart3 className="h-4 w-4 text-cool-grey" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineData.map((stage) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-700 font-medium">{stage.stage}</span>
                    <span className="text-sm font-semibold text-gray-900 tabular-nums">{stage.count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${stage.width}%`, backgroundColor: stage.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Bottom Row: Submissions + Deadlines + Activity ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

        {/* Recent Submissions with progress */}
        <Card className="lg:col-span-5">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent Submissions</CardTitle>
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
                  className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-gray-50"
                >
                  {/* Progress ring */}
                  <div className="relative flex-shrink-0">
                    <ProgressRing
                      value={submission.progress}
                      size={36}
                      strokeWidth={3}
                      color={progressColor[submission.status]}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-500 tabular-nums">
                      {submission.progress}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 group-hover:text-signal-blue transition-colors">
                      {submission.name}
                    </p>
                    <p className="text-xs text-cool-grey">{submission.client}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={statusVariant[submission.status]}>
                      {statusLabel[submission.status]}
                    </Badge>
                    <span className="text-[10px] text-cool-grey/60">{submission.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-cool-grey" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => {
                const styles = deadlineTypeStyles[deadline.type];
                return (
                  <div
                    key={deadline.id}
                    className={`rounded-lg border p-3 transition-all duration-200 hover:shadow-sm ${styles.bg} border-transparent ring-1 ${styles.ring}`}
                  >
                    <p className="text-sm font-medium text-gray-900 leading-snug">
                      {deadline.title}
                    </p>
                    <UrgencyBar daysLeft={deadline.daysLeft} />
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                        <span className="text-[11px] font-medium text-gray-600 capitalize">
                          {deadline.type}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold tabular-nums text-gray-500">
                        {deadline.daysLeft}d left · {deadline.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Activity</CardTitle>
            <Activity className="h-4 w-4 text-cool-grey" />
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-gray-200 via-gray-200 to-transparent" />

              <div className="space-y-4">
                {activityFeed.map((item) => (
                  <div key={item.id} className="relative flex gap-3 group">
                    {/* Icon circle */}
                    <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all duration-200">
                      <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                    </div>

                    <div className="flex-1 pt-0.5">
                      <p className="text-sm text-gray-700 leading-snug">
                        <span className="font-medium text-gray-900">{item.user}</span>{' '}
                        {item.action}{' '}
                        <span className="font-medium text-signal-blue">{item.target}</span>
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock className="h-2.5 w-2.5 text-cool-grey/50" />
                        <span className="text-[11px] text-cool-grey/60">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-200 py-2 text-xs font-medium text-cool-grey hover:text-signal-blue hover:border-signal-blue/30 transition-all duration-200">
              View all activity
              <ArrowRight className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
