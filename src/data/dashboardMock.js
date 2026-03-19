// Dashboard Mock Data
// TODO: Replace with API Gateway calls to Lambda + DynamoDB
//
// Endpoint mapping:
//   currentUser       -> GET  /api/user/me
//   kpiCards          -> GET  /api/dashboard/kpis?quarter=Q2-2024
//   upcomingDeadlines -> GET  /api/filings/deadlines
//   myTasks           -> GET  /api/tasks?assignee=me
//   recentActivity    -> GET  /api/activity?limit=5
//   aiInsights        -> POST /api/ai/insights   (Lambda)
//   complianceHealth  -> GET  /api/compliance/health
//   quickStats        -> GET  /api/dashboard/stats
//   liveFeedItems     -> GET  /api/feed/live      (Lambda + SNS)
//   trendingTopics    -> GET  /api/feed/trending

export const currentUser = { name: "Jordan Davis", initials: "JD", role: "Compliance Manager", org: "Acme Corp" };
export const quarterInfo = { label: "Q2 2024", entity: "Acme Corp" };

export const kpiCards = [
  { label: "Open Filings", value: 3, accent: "blue" },
  { label: "Due This Week", value: 2, accent: "warning" },
  { label: "At Risk", value: 1, accent: "danger" },
  { label: "Missing Disclosures", value: 5, accent: "purple" },
];

export const upcomingDeadlines = [
  { id: 1, type: "LD-2",  label: "LD-2 Report Due",              date: "Jul 20", priority: "high",   daysLeft: 8 },
  { id: 2, type: "LD-203",label: "LD-203 Contribution Due",      date: "Aug 15", priority: "medium", daysLeft: 34 },
  { id: 3, type: "AMEND", label: "Amendment Needed \u2014 Client XYZ", date: "Jul 25", priority: "low",    daysLeft: 13 },
];

export const myTasks = [
  { id: 1, label: "Review LD-2 for Acme Corp",     done: false, priority: "high" },
  { id: 2, label: "Update Lobbyist Info",           done: true,  priority: "medium" },
  { id: 3, label: "Approve Q2 Disclosure Draft",    done: false, priority: "high" },
  { id: 4, label: "Verify new issue code mapping",  done: false, priority: "low" },
];

export const recentActivity = [
  { id: 1, action: "Meeting with Senate Staff",       date: "Jul 10", type: "meeting" },
  { id: 2, action: "Call on HR 1234",                 date: "Jul 8",  type: "call" },
  { id: 3, action: "Draft LD-203 Created",            date: "Jul 7",  type: "filing" },
  { id: 4, action: "Issue code updated: Healthcare AI",date:"Jul 6",  type: "update" },
  { id: 5, action: "LD-2 amendment submitted",         date: "Jul 5",  type: "filing" },
];

export const aiInsights = [
  { id: 1, text: "3 activities may require LD-2 reporting", type: "warning" },
  { id: 2, text: "2 disclosures need review",               type: "alert" },
  { id: 3, text: "Suggest new issue code for HR 4567",      type: "suggestion" },
];

export const complianceHealth = { score: 83, label: "Good", filings: 90, disclosures: 72, activities: 88 };

export const quickStats = [
  { label: "Active Clients",    value: 4 },
  { label: "Lobbyists Assigned",value: 7 },
  { label: "Meetings This Qtr", value: 12 },
  { label: "Pending Reviews",   value: 3 },
];

export const liveFeedItems = [
  { id: 1, source: "legislator", author: "Sen. Smith",   text: "New healthcare AI bill introduced with bipartisan support...",  tags: ["Healthcare","AI","HR4567"], time: "2m ago",  relevance: "high" },
  { id: 2, source: "agency",     author: "EPA",          text: "New emission regs update: stricter standards proposed for Q3...",tags: ["Environment","Regulation"], time: "15m ago", relevance: "medium" },
  { id: 3, source: "bill",       author: "Congress.gov",  text: "HR4567 has moved to committee \u2014 Healthcare & Commerce...",  tags: ["Healthcare","HR4567"],      time: "1h ago",  relevance: "high" },
  { id: 4, source: "news",       author: "Reuters",       text: "Lobbying spend hits record high in tech sector...",              tags: ["Tech","Spending"],          time: "2h ago",  relevance: "low" },
  { id: 5, source: "legislator", author: "Rep. Johnson",  text: "Introducing amendment to procurement transparency act...",      tags: ["Procurement"],              time: "3h ago",  relevance: "medium" },
];

export const trendingTopics = [
  { topic: "Healthcare AI",       mentions: 24, trend: "up" },
  { topic: "Climate Regulation",  mentions: 18, trend: "up" },
  { topic: "Defense Procurement", mentions: 12, trend: "stable" },
  { topic: "Data Privacy",        mentions: 9,  trend: "down" },
];
