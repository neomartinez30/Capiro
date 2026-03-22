import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import COGNITO_CONFIG from "../config/cognito";
import BRAND from "../config/brand";
import CapiroLogo from "./CapiroLogo";
import "../styles/LoginModal.css";

export default function LoginModal({ isOpen, initialMode = "login", onClose }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setMode(initialMode); }, [initialMode]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const user = await signIn({ email, password });
        navigate(user.orgId ? "/app" : "/onboarding");
        onClose();
      } else {
        await signUp({ email, password, name });
        navigate("/onboarding");
        onClose();
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = () => {
    alert("[Placeholder] Forgot password flow would use Cognito's resetPassword API.");
  };

  const handleSSO = () => {
    alert(`[Placeholder] SSO would redirect to:\nhttps://${COGNITO_CONFIG.domain}/oauth2/authorize`);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-card__accent-bar" />
        <div className="modal-card__body">
          <div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <CapiroLogo color={BRAND.primary} height={26} />
            </div>
            <h2 className="modal__heading">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="modal__subheading">
              {mode === "login"
                ? "Sign in to access your legislative workflows"
                : "Join Capiro to streamline submissions"}
            </p>
          </div>

          {error && (
            <div style={{ padding: "8px 12px", borderRadius: 6, background: "#FEF2F2", color: "#DC2626", fontSize: 13, marginBottom: 8 }}>
              {error}
            </div>
          )}

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
            </div>
            {mode === "login" && (
              <div className="modal__forgot">
                <button onClick={handleForgot}>Forgot password?</button>
              </div>
            )}
            <button className="btn-submit" onClick={handleSubmit} disabled={loading || (!email || !password)}>
              {loading ? (
                <span className="btn-submit__spinner"><span className="spinner" />Connecting...</span>
              ) : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </div>

          <div className="modal__divider"><div className="modal__divider-line" />or<div className="modal__divider-line" /></div>

          <button className="btn-sso" onClick={handleSSO}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BRAND.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Continue with SSO
          </button>

          <p className="modal__toggle">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
