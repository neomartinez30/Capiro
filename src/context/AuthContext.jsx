import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import COGNITO_CONFIG from "../config/cognito";

const AuthContext = createContext(null);

// Dev auto-login: add ?dev=onboarding or ?dev=dashboard to URL
function getDevUser() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const dev = params.get("dev");
  if (!dev) return null;
  const base = {
    id: "usr_dev001", email: "neo@capiro.ai", name: "Neo Capiro",
    role: "firm_admin", tenantId: "tenant_demo_001",
    initials: "NC", createdAt: new Date().toISOString(),
  };
  if (dev === "onboarding") return { ...base, orgId: null };
  if (dev === "dashboard") return { ...base, orgId: "reg_001", orgName: "Capstone Government Affairs" };
  return null;
}

// Simulated Cognito auth — replace with aws-amplify/auth in production
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Dev auto-login via useEffect (runs after mount, more reliable in dev)
  useEffect(() => {
    if (user) return; // already logged in
    const devUser = getDevUser();
    if (devUser) {
      console.log("[AuthContext] Dev auto-login:", devUser.orgId ? "dashboard" : "onboarding");
      setUser(devUser);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signIn = useCallback(async ({ email, password }) => {
    setLoading(true);
    // TODO: const { isSignedIn } = await signIn({ username: email, password });
    console.log(`[Cognito] signIn: ${email} → Pool: ${COGNITO_CONFIG.userPoolId}`);
    await new Promise((r) => setTimeout(r, 1200));
    const mockUser = {
      id: "usr_" + Math.random().toString(36).slice(2, 10),
      email,
      name: email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      role: "lobbyist",
      tenantId: "tenant_demo_001",
      orgId: null, // null means needs onboarding
      initials: email.slice(0, 2).toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    setUser(mockUser);
    setIsNewUser(false);
    setLoading(false);
    return mockUser;
  }, []);

  const signUp = useCallback(async ({ email, password, name }) => {
    setLoading(true);
    console.log(`[Cognito] signUp: ${name} <${email}>`);
    await new Promise((r) => setTimeout(r, 1500));
    const mockUser = {
      id: "usr_" + Math.random().toString(36).slice(2, 10),
      email,
      name,
      role: "firm_admin",
      tenantId: "tenant_" + Math.random().toString(36).slice(2, 8),
      orgId: null, // needs onboarding
      initials: name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
      createdAt: new Date().toISOString(),
    };
    setUser(mockUser);
    setIsNewUser(true);
    setLoading(false);
    return mockUser;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setIsNewUser(false);
  }, []);

  const completeOnboarding = useCallback((orgData) => {
    setUser((prev) => ({ ...prev, orgId: orgData.id, orgName: orgData.name }));
    setIsNewUser(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isNewUser, signIn, signUp, signOut, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
