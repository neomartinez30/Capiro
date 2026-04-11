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
      // Restore orgId: try DynamoDB first, fall back to localStorage
      try {
        const { getUserProfile } = await import("../services/api");
        const profileResult = await getUserProfile(appUser.email);
        if (profileResult?.profile?.firmId) {
          const p = profileResult.profile;
          appUser.orgId = p.firmId;
          appUser.orgName = p.firmName;
          appUser.name = p.name || appUser.name;
          // Also update localStorage as cache
          localStorage.setItem(`capiro_org_${appUser.email}`, JSON.stringify({ id: p.firmId, name: p.firmName }));
        } else {
          // Fall back to localStorage
          const savedOrg = localStorage.getItem(`capiro_org_${appUser.email}`);
          if (savedOrg) {
            try {
              const org = JSON.parse(savedOrg);
              appUser.orgId = org.id;
              appUser.orgName = org.name;
            } catch {
              localStorage.removeItem(`capiro_org_${appUser.email}`);
            }
          }
        }
      } catch {
        // If DynamoDB fails, try localStorage
        const savedOrg = localStorage.getItem(`capiro_org_${appUser.email}`);
        if (savedOrg) {
          try {
            const org = JSON.parse(savedOrg);
            appUser.orgId = org.id;
            appUser.orgName = org.name;
          } catch {
            localStorage.removeItem(`capiro_org_${appUser.email}`);
          }
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

      // Restore org from DynamoDB, fall back to localStorage
      try {
        const { getUserProfile } = await import("../services/api");
        const profileResult = await getUserProfile(appUser.email);
        if (profileResult?.profile?.firmId) {
          appUser.orgId = profileResult.profile.firmId;
          appUser.orgName = profileResult.profile.firmName;
          localStorage.setItem(`capiro_org_${appUser.email}`, JSON.stringify({ id: appUser.orgId, name: appUser.orgName }));
        } else {
          const savedOrg = localStorage.getItem(`capiro_org_${appUser.email}`);
          if (savedOrg) {
            try {
              const org = JSON.parse(savedOrg);
              appUser.orgId = org.id;
              appUser.orgName = org.name;
            } catch { localStorage.removeItem(`capiro_org_${appUser.email}`); }
          }
        }
      } catch {
        const savedOrg = localStorage.getItem(`capiro_org_${appUser.email}`);
        if (savedOrg) {
          try {
            const org = JSON.parse(savedOrg);
            appUser.orgId = org.id;
            appUser.orgName = org.name;
          } catch { localStorage.removeItem(`capiro_org_${appUser.email}`); }
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
    // Clear any stale org cache for this email (e.g. re-registration after account deletion)
    localStorage.removeItem(`capiro_org_${email}`);
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
    const userEmail = user?.email;
    try {
      await amplifySignOut();
    } catch {
      // Ignore errors on sign out
    }
    // Clear cached org data
    if (userEmail) {
      localStorage.removeItem(`capiro_org_${userEmail}`);
    }
    setUser(null);
    setIsNewUser(false);
    setConfirmationPending(null);
  }, [user]);

  const completeOnboarding = useCallback(async (orgData) => {
    setUser(prev => {
      const updated = { ...prev, orgId: orgData.id, orgName: orgData.name };
      // Persist org selection to localStorage
      localStorage.setItem(`capiro_org_${prev.email}`, JSON.stringify({ id: orgData.id, name: orgData.name }));
      // Also persist to DynamoDB
      import("../services/api").then(({ saveUserProfile }) => {
        saveUserProfile({
          email: prev.email,
          userId: prev.id,
          firmId: orgData.id,
          firmName: orgData.name,
          name: prev.name,
          role: prev.role,
          onboardingData: orgData.onboardingData || {},
        }).catch(err => console.error("Failed to save user profile:", err));
      });
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
