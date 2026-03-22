import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import GridBackground from "./components/GridBackground";
import Particles from "./components/Particles";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import LandingSections from "./components/LandingSections";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardLayout from "./pages/DashboardLayout";
import "./styles/global.css";

function LandingPage() {
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [loginMode, setLoginMode] = React.useState("login");
  const { user, loading } = useAuth();

  // While checking for existing Cognito session, show nothing (prevents flash)
  if (loading) return <div style={{ minHeight: "100vh", background: "var(--lp-bg, #0a1628)" }} />;
  if (user) return <Navigate to={user.orgId ? "/app" : "/onboarding"} replace />;

  const openLogin = (mode = "login") => { setLoginMode(mode); setLoginOpen(true); };

  return (
    <div>
      <GridBackground />
      <Particles />
      <Navbar onLoginClick={() => openLogin("login")} onSignupClick={() => openLogin("signup")} />
      <Hero onLoginClick={() => openLogin("signup")} />
      <Features />
      <LandingSections onLoginClick={() => openLogin("signup")} />
      <Footer />
      <LoginModal
        isOpen={loginOpen}
        initialMode={loginMode}
        onClose={() => setLoginOpen(false)}
      />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight: "100vh", background: "var(--bg, #F4F6F8)" }} />;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function OnboardingGuard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight: "100vh", background: "var(--bg, #F4F6F8)" }} />;
  if (!user) return <Navigate to="/" replace />;
  // If user has no org, force onboarding (unless already there)
  if (!user.orgId) return <Navigate to="/onboarding" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={
            <ProtectedRoute><OnboardingPage /></ProtectedRoute>
          } />
          <Route path="/app/*" element={
            <OnboardingGuard><DashboardLayout /></OnboardingGuard>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
