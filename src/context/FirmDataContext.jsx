import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import * as api from "../services/api";
import { plans } from "../data/ldaData";

const FirmDataContext = createContext(null);

export function FirmDataProvider({ children }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const recoveryAttempted = useRef(false);

  const fetchFirmData = useCallback(async (firmId) => {
    if (!firmId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch firm data, offices, and filing periods in parallel
      const [firmResult, officesResult, filingsResult] = await Promise.all([
        api.getFirmData(firmId),
        api.getOffices().catch(() => ({ offices: [] })),
        api.getFilingPeriods().catch(() => ({ filingPeriods: [] })),
      ]);

      // Merge offices: firm-specific offices override, fall back to global
      const offices =
        firmResult.offices && firmResult.offices.length > 0
          ? firmResult.offices
          : officesResult.offices || [];

      // Filing periods from API (dynamically computed)
      const filingPeriods =
        firmResult.filingPeriods && firmResult.filingPeriods.length > 0
          ? firmResult.filingPeriods
          : filingsResult.filingPeriods || [];

      const merged = {
        ...firmResult,
        offices,
        filingPeriods,
      };

      // Auto-recovery: if the firm profile exists but has no clients,
      // the setupFirm call likely failed during onboarding. Re-run it once.
      if (
        merged.firm &&
        merged.firm.ldaRegistrantId &&
        (!merged.clients || merged.clients.length === 0) &&
        !recoveryAttempted.current
      ) {
        recoveryAttempted.current = true;
        console.log("[Capiro] Auto-recovering: re-pulling LDA data for firm", firmId);
        try {
          const recovered = await api.setupFirm({
            firmId,
            ldaRegistrantId: merged.firm.ldaRegistrantId,
            firmData: merged.firm,
          });
          // Re-fetch fresh data after recovery
          const freshResult = await api.getFirmData(firmId);
          setData({
            ...freshResult,
            offices,
            filingPeriods,
          });
          return;
        } catch (recoverErr) {
          console.error("[Capiro] Auto-recovery failed:", recoverErr);
          // Fall through to use whatever we have
        }
      }

      setData(merged);
    } catch (err) {
      console.error("Failed to fetch firm data:", err);
      setError(err.message);
      // Provide empty defaults so the UI doesn't crash
      setData({
        firm: { id: firmId, name: user?.orgName || "Your Firm" },
        clients: [],
        lobbyists: [],
        topics: [],
        submissions: [],
        offices: [],
        filingPeriods: [],
      });
    } finally {
      setLoading(false);
    }
  }, [user?.orgName]);

  // Fetch when user orgId changes
  useEffect(() => {
    recoveryAttempted.current = false;
    if (user?.orgId) {
      fetchFirmData(user.orgId);
    } else {
      setData(null);
      setLoading(false);
    }
  }, [user?.orgId, fetchFirmData]);

  const saveItem = useCallback(async (type, itemData) => {
    if (!user?.orgId) return;
    const result = await api.saveItem({ firmId: user.orgId, type, data: itemData });
    await fetchFirmData(user.orgId);
    return result;
  }, [user?.orgId, fetchFirmData]);

  const deleteItemFn = useCallback(async (type, id) => {
    if (!user?.orgId) return;
    await api.deleteItem({ firmId: user.orgId, type, id });
    await fetchFirmData(user.orgId);
  }, [user?.orgId, fetchFirmData]);

  const refreshData = useCallback(() => {
    if (user?.orgId) fetchFirmData(user.orgId);
  }, [user?.orgId, fetchFirmData]);

  return (
    <FirmDataContext.Provider value={{
      data,
      loading,
      error,
      saveItem,
      deleteItem: deleteItemFn,
      refreshData,
      plans,
    }}>
      {children}
    </FirmDataContext.Provider>
  );
}

export function useFirmDataContext() {
  return useContext(FirmDataContext);
}
