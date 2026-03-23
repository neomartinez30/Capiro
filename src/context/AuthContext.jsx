import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { signIn as amplifySignIn, signUp as amplifySignUp, signOut as amplifySignOut, getCurrentUser, fetchUserAttributes, confirmSignUp as amplifyConfirmSignUp } from "aws-amplify/auth";
import COGNITO_CONFIG from "../config/cognito";

// ── Configure Amplify ──────────────────────────────────────────
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: COGNITO_CONFIG.userPoolId,
      userPoolClientId: COGNITO_CONFIG.userPoolWebClientId,
    },
  },
});

const AuthContext = createContext(null);

// Helper: build user object from Cognito attributes
function buildUser(cognitoUser, attributes) {
  const email = attributes?.email || cognitoUser?.signInDetails?.loginId || "";
  const name = attributes?.name || email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return {
    id: cognitoUser?.userId || cognitoUser?.username || "usr_" + Math.random().toString(36).slice(2, 10),
    email,
    name,
    role: "firm_admin",
    tenantId: "tenant_" + (cognitoUser?.userId || "default").slice(0, 8),
    orgId: null, // null until onboarding completes
    initials: name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
    createdAt: new Date().toISOString(),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [confirmationPending, setConfirmationPending] = useState(null); // email awaiting confirmation

  // Check for existing session on mount
  useEffect(() => {
    checkCurrentUser();
  }, []);

  async function checkCurrentUser() {
    try {
      const cognitoUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      const appUser = buildUser(cognitoUser, attributes);
      // Restore orgId from localStorage if previously onboarded
      const savedOrg = localStorage.getItem(`capiro_org_${appUser.email}`);
      if (savedOrg) {
        try {
          const org = JSON.parse(savedOrg);
          appUser.orgId = org.id;
          appUser.orgName = org.name;
          // Validate the org still exists in DynamoDB
          const { getFirmData } = await import("../services/api");
          const firmResult = await getFirmData(org.id).catch(() => null);
          if (!firmResult?.firm) {
            // Firm no longer exists — clear stale org and force re-onboarding
            localStorage.removeItem(`capiro_org_${appUser.email}`);
            appUser.orgId = null;
            appUser.orgName = null;
          }
        } catch {
          // If validation fails, clear stale org data
          localStorage.removeItem(`capiro_org_${appUser.email}`);
          appUser.orgId = null;
          appUser.orgName = null;
        }
      }
      setUser(appUser);
    } catch {
      // No session
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const signIn = useCallback(async ({ email, password }) => {
    try {
      const result = await amplifySignIn({ username: email, password });

      if (result.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        setConfirmationPending(email);
        throw new Error("CONFIRM_SIGN_UP");
      }

      const cognitoUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      const appUser = buildUser(cognitoUser, attributes);

      // Restore org — validate it still exists
      const savedOrg = localStorage.getItem(`capiro_org_${appUser.email}`);
      if (savedOrg) {
        try {
          const org = JSON.parse(savedOrg);
          const { getFirmData } = await import("../services/api");
          const firmResult = await getFirmData(org.id).catch(() => null);
          if (firmResult?.firm) {
            appUser.orgId = org.id;
            appUser.orgName = org.name;
          } else {
            // Stale — firm no longer in DB
            localStorage.removeItem(`capiro_org_${appUser.email}`);
          }
        } catch {
          localStorage.removeItem(`capiro_org_${appUser.email}`);
        }
      }

      setUser(appUser);
      setIsNewUser(false);
      return appUser;
    } catch (err) {
      throw err;
    }
  }, []);

  const signUp = useCallback(async ({ email, password, name }) => {
    try {
      const result = await amplifySignUp({
        username: email,
        password,
        options: { userAttributes: { email, name } },
      });

      if (!result.isSignUpComplete) {
        // Need email confirmation
        setConfirmationPending(email);
        return { needsConfirmation: true, email };
      }

      // Auto-sign in after signup if auto-confirmed
      const appUser = await signIn({ email, password });
      setIsNewUser(true);
      return appUser;
    } catch (err) {
      throw err;
    }
  }, [signIn]);

  const confirmSignUp = useCallback(async ({ email, code }) => {
    try {
      await amplifyConfirmSignUp({ username: email, confirmationCode: code });
      setConfirmationPending(null);
      return true;
    } catch (err) {
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await amplifySignOut();
    } catch {
      // Ignore errors on sign out
    }
    setUser(null);
    setIsNewUser(false);
    setConfirmationPending(null);
  }, []);

  const completeOnboarding = useCallback((orgData) => {
    setUser(prev => {
      const updated = { ...prev, orgId: orgData.id, orgName: orgData.name };
      // Persist org selection
      localStorage.setItem(`capiro_org_${prev.email}`, JSON.stringify({ id: orgData.id, name: orgData.name }));
      return updated;
    });
    setIsNewUser(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, isNewUser, confirmationPending,
      signIn, signUp, signOut, confirmSignUp, completeOnboarding,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
