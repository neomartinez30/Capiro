import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  registrants, clients, topics, submissions,
  offices, lobbyists, filingPeriods, plans,
} from "../data/ldaData";

/**
 * useFirmData — Tenant-scoped data hook
 *
 * Filters all LDA data by the currently authenticated user's firm (orgId).
 * In production, this would call backend APIs with tenant_id isolation.
 * For now, it filters the mock data client-side.
 *
 * Returns all LDA entities scoped to the user's firm, plus computed KPIs.
 */
export function useFirmData() {
  const { user } = useAuth();

  return useMemo(() => {
    // Find the registrant for this user's org
    // orgId can be a registrant.id (e.g. "reg_001") or a generated org id
    const firm = registrants.find((r) => r.id === user?.orgId) || registrants[0];

    // Filter clients belonging to this firm
    const firmClients = clients.filter((c) => c.registrantId === firm.id);
    const firmClientIds = new Set(firmClients.map((c) => c.id));

    // Filter topics belonging to this firm's clients
    const firmTopics = topics.filter((t) => firmClientIds.has(t.clientId));
    const firmTopicIds = new Set(firmTopics.map((t) => t.id));

    // Filter submissions for this firm's topics
    const firmSubmissions = submissions.filter((s) => firmTopicIds.has(s.topicId));

    // Filter lobbyists belonging to this firm
    const firmLobbyists = lobbyists.filter((l) => l.registrantId === firm.id);

    // Offices are global (congressional offices don't belong to a firm)
    // but we can identify "relevant" offices that the firm interacts with
    const relevantOfficeIds = new Set();
    firmTopics.forEach((t) => {
      if (t.targetOffices) t.targetOffices.forEach((id) => relevantOfficeIds.add(id));
    });
    firmSubmissions.forEach((s) => {
      if (s.officeId) relevantOfficeIds.add(s.officeId);
    });
    const firmOffices = offices.filter((o) => relevantOfficeIds.has(o.id));

    // Computed KPIs
    const activeClients = firmClients.filter((c) => c.status === "active").length;
    const pendingSubmissions = firmSubmissions.filter(
      (s) => s.status === "draft" || s.status === "pending_review"
    ).length;
    const submittedCount = firmSubmissions.filter((s) => s.status === "submitted").length;
    const totalRevenue = firmClients.reduce((sum, c) => sum + (c.annualSpend || 0), 0);

    // Filing deadlines (these are global but we compute per-firm status)
    const upcomingDeadlines = filingPeriods
      .filter((fp) => new Date(fp.dueDate) > new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return {
      firm,
      clients: firmClients,
      topics: firmTopics,
      submissions: firmSubmissions,
      lobbyists: firmLobbyists,
      offices: firmOffices,
      allOffices: offices,
      filingPeriods,
      plans,
      // KPIs
      kpis: {
        activeClients,
        pendingSubmissions,
        submittedCount,
        totalRevenue,
        lobbyistCount: firmLobbyists.length,
        topicCount: firmTopics.length,
        officeCount: firmOffices.length,
      },
      upcomingDeadlines,
    };
  }, [user?.orgId]);
}

export default useFirmData;
