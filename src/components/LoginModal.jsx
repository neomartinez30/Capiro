import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BRAND from "../config/brand";
import CapiroLogo from "./CapiroLogo";
import "../styles/LoginModal.css";

export default function LoginModal({ isOpen, initialMode = "login", onClose }) {
  const [mode, setMode] = useState(initialMode); // login | signup | confirm
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const { signIn, signUp, confirmSignUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setMode(initialMode); }, [initialMode]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // If user is already signed in, redirect immediately
  useEffect(() => {
    if (user && isOpen) {
      navigate(user.orgId ? "/app" : "/onboarding");
      onClose();
    }
  }, [user, isOpen]);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const u = await signIn({ email, password });
        navigate(u.orgId ? "/app" : "/onboarding");
        onClose();
      } else if (mode === "signup") {
        const result = await signUp({ email, password, name });
        if (result?.needsConfirmation) {
          setPendingEmail(email);
          setMode("confirm");
        } else {
          navigate("/onboarding");
          onClose();
        }
      }
    } catch (err) {
      const msg = err.message || "Something went wrong";
      if (msg === "CONFIRM_SIGN_UP") {
        setPendingEmail(email);
        setMode("confirm");
      } else if (msg.includes("UserAlreadyAuthenticatedException") || msg.includes("already signed in")) {
        navigate("/app");
        onClose();
      } else {
        setError(friendlyError(msg));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setError("");
    setLoading(true);
    try {
      await confirmSignUp({ email: pendingEmail, code: confirmCode });
      // Now sign in
      const u = await signIn({ email: pendingEmail, password });
      navigate(u.orgId ? "/app" : "/onboarding");
      onClose();
    } catch (err) {
      setError(friendlyError(err.message || "Invalid code"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || user) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-card__accent-bar" />
        <div className="modal-card__body">
          <div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <CapiroLogo color={BRAND.primary} height={26} />
            </div>

            {mode === "confirm" ? (
              <>
                <h2 className="modal__heading">Check your email</h2>
                <p className="modal__subheading">
                  We sent a verification code to <strong>{pendingEmail}</strong>
                </p>
              </>
            ) : (
              <>
                <h2 className="modal__heading">
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="modal__subheading">
                  {mode === "login"
                    ? "Sign in to access your legislative workflows"
                    : "Join Capiro to streamline submissions"}
                </p>
              </>
            )}
          </div>

          {error && (
            <div style={{ padding: "8px 12px", borderRadius: 6, background: "#FEF2F2", color: "#DC2626", fontSize: 13, marginBottom: 8 }}>
              {error}
            </div>
          )}

          {/* Confirmation Code Form */}
          {mode === "confirm" && (
            <div className="modal__form">
              <div>
                <label className="form-label">Verification Code</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={confirmCode}
                  onChange={(e) => setConfirmCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                  autoComplete="one-time-code"
                  maxLength={6}
                  style={{ letterSpacing: "0.3em", textAlign: "center", fontSize: 18 }}
                />
              </div>
              <button className="btn-submit" onClick={handleConfirm} disabled={loading || confirmCode.length < 6}>
                {loading ? (
                  <span className="btn-submit__spinner"><span className="spinner" />Verifying...</span>
                ) : "Verify & Continue"}
              </button>
              <p className="modal__toggle">
                Didn't get the code?{" "}
                <button onClick={() => { setMode("signup"); setError(""); }}>
                  Try again
                </button>
              </p>
            </div>
          )}

          {/* Login / Signup Form */}
          {mode !== "confirm" && (
            <>
              <div className="modal__form">
                {mode === "signup" && (
                  <div>
                    <label className="form-label">Full Name</label>
                    <input className="form-input" type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                )}
                <div>
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="you@organization.gov" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Password</label>
                  <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
                  {mode === "signup" && (
                    <p style={{ marginTop: 4, fontSize: 11, color: "var(--text-3)" }}>
                      Min 8 characters, uppercase, lowercase, and a number
                    </p>
                  )}
                </div>
                <button className="btn-submit" onClick={handleSubmit} disabled={loading || !email || !password || (mode === "signup" && !name)}>
                  {loading ? (
                    <span className="btn-submit__spinner"><span className="spinner" />Connecting...</span>
                  ) : mode === "login" ? "Sign In" : "Create Account"}
                </button>
              </div>

              <p className="modal__toggle">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Map Cognito error codes to user-friendly messages
function friendlyError(msg) {
  if (msg.includes("UserNotFoundException") || msg.includes("user does not exist")) {
    return "No account found with this email. Would you like to sign up?";
  }
  if (msg.includes("NotAuthorizedException") || msg.includes("Incorrect")) {
    return "Incorrect email or password. Please try again.";
  }
  if (msg.includes("UsernameExistsException") || msg.includes("already exists")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (msg.includes("InvalidPasswordException") || msg.includes("password")) {
    return "Password must be at least 8 characters with uppercase, lowercase, and a number.";
  }
  if (msg.includes("CodeMismatchException")) {
    return "Invalid verification code. Please check and try again.";
  }
  if (msg.includes("ExpiredCodeException")) {
    return "Verification code has expired. Please request a new one.";
  }
  if (msg.includes("LimitExceededException") || msg.includes("limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  return msg;
}
