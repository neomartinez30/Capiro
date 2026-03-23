import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useFirmDataContext } from "../context/FirmDataContext";
import { plans } from "../data/ldaData";

/**
 * useFirmData — Tenant-scoped data hook
 *
 * Reads from FirmDataContext (backed by DynamoDB via our Lambda API).
 * All data comes from the API — no mock fallbacks.
 */
export function useFirmData() {
  const { user } = useAuth();
  const ctx = useFirmDataContext();

  return useMemo(() => {
    const d = ctx?.data;
    const firm = d?.firm || { id: user?.orgId, name: user?.orgName || "Your Firm" };
    const clients = d?.clients || [];
    const topics = d?.topics || [];
    const submissions = d?.submissions || [];
    const lobbyists = d?.lobbyists || [];
    const allOffices = d?.offices || [];
    const filingPeriods = d?.filingPeriods || [];

    // Relevant offices (ones the firm interacts with)
    const relevantOfficeIds = new Set();
    topics.forEach((t) => {
      if (t.targetOffices) t.targetOffices.forEach((id) => relevantOfficeIds.add(id));
    });
    submissions.forEach((s) => {
      if (s.officeId) relevantOfficeIds.add(s.officeId);
    });
    const offices = relevantOfficeIds.size > 0
      ? allOffices.filter((o) => relevantOfficeIds.has(o.id))
      : allOffices;

    // KPIs
    const activeClients = clients.filter((c) => c.status === "active").length;
    const pendingSubmissions = submissions.filter(
      (s) => s.status === "draft" || s.status === "pending_review"
    ).length;
    const submittedCount = submissions.filter((s) => s.status === "submitted").length;
    const totalRevenue = clients.reduce((sum, c) => sum + (c.annualSpend || 0), 0);

    const upcomingDeadlines = filingPeriods
      .filter((fp) => new Date(fp.dueDate) > new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return {
      firm,
      clients,
      topics,
      submissions,
      lobbyists,
      offices,
      allOffices,
      filingPeriods,
      plans,
      kpis: {
        activeClients,
        pendingSubmissions,
        submittedCount,
        totalRevenue,
        lobbyistCount: lobbyists.length,
        topicCount: topics.length,
        officeCount: offices.length,
      },
      upcomingDeadlines,
      // CRUD helpers
      saveItem: ctx?.saveItem,
      deleteItem: ctx?.deleteItem,
      refreshData: ctx?.refreshData,
      dataLoading: ctx?.loading,
    };
  }, [user?.orgId, user?.orgName, ctx]);
}

export default useFirmData;
