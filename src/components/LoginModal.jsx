import React, { useState, useEffect } from "react";
import COGNITO_CONFIG from "../config/cognito";
import BRAND from "../config/brand";
import "../styles/LoginModal.css";

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSubmit = () => {
    setLoading(true);

    // ─── TODO: Replace with actual AWS Cognito authentication ───
    // import { signIn, signUp } from 'aws-amplify/auth';
    //
    // if (mode === 'login') {
    //   const { isSignedIn } = await signIn({ username: email, password });
    //   if (isSignedIn) onSuccess?.();
    // } else {
    //   const { isSignUpComplete } = await signUp({
    //     username: email, password,
    //     options: { userAttributes: { name } },
    //   });
    // }

    console.log(`[Cognito Placeholder] ${mode}:`, { email, password, name });
    setTimeout(() => {
      setLoading(false);
      // Placeholder: simulate successful login → navigate to dashboard
      if (mode === "login") {
        onSuccess?.();
      } else {
        alert(
          `[Placeholder] Account creation would connect to AWS Cognito.\n\n` +
          `User Pool: ${COGNITO_CONFIG.userPoolId}\nRegion: ${COGNITO_CONFIG.region}`
        );
      }
    }, 1500);
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
            <span className="modal__logo-text" style={{fontSize:"22px",fontWeight:700,color:"#01226A",letterSpacing:"-0.5px"}}>Capiro</span>
            <h2 className="modal__heading">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="modal__subheading">
              {mode === "login"
                ? "Sign in to access your legislative workflows"
                : "Join Capiro to streamline submissions"}
            </p>
          </div>

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
              <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {mode === "login" && (
              <div className="modal__forgot">
                <button onClick={handleForgot}>Forgot password?</button>
              </div>
            )}
            <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <span className="btn-submit__spinner"><span className="spinner" />Connecting...</span>
              ) : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </div>

          <div className="modal__divider"><div className="modal__divider-line" />or<div className="modal__divider-line" /></div>

          <button className="btn-sso" onClick={handleSSO}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BRAND.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Continue with SSO
          </button>

          <p className="modal__toggle">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
