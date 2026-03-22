import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import * as api from "../services/api";
import { offices as mockOffices, filingPeriods as mockFilingPeriods, plans } from "../data/ldaData";

const FirmDataContext = createContext(null);

export function FirmDataProvider({ children }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFirmData = useCallback(async (firmId) => {
    if (!firmId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.getFirmData(firmId);

      // Fall back to mock offices/filings if none stored yet
      if (!result.offices || result.offices.length === 0) {
        result.offices = mockOffices;
      }
      if (!result.filingPeriods || result.filingPeriods.length === 0) {
        result.filingPeriods = mockFilingPeriods;
      }

      setData(result);
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
        offices: mockOffices,
        filingPeriods: mockFilingPeriods,
      });
    } finally {
      setLoading(false);
    }
  }, [user?.orgName]);

  // Fetch when user orgId changes
  useEffect(() => {
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
    // Refresh all data after save
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
