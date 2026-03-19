import React, { useState } from "react";
import GridBackground from "./components/GridBackground";
import Particles from "./components/Particles";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import DashboardPage from "./pages/DashboardPage";
import "./styles/global.css";

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("landing"); // "landing" | "dashboard"

  // ─── TODO: Replace with real Cognito auth state ───────────────
  // import { useAuthenticator } from '@aws-amplify/ui-react';
  // const { user, signOut } = useAuthenticator();
  // const isAuthenticated = !!user;

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    // TODO: await signOut();
    setCurrentPage("landing");
  };

  // ── Dashboard ────────────────────────────────────────────────
  if (currentPage === "dashboard") {
    return <DashboardPage onLogout={handleLogout} />;
  }

  // ── Landing page ─────────────────────────────────────────────
  return (
    <div>
      <GridBackground />
      <Particles />
      <Navbar onLoginClick={() => setLoginOpen(true)} />
      <Hero onLoginClick={() => setLoginOpen(true)} />
      <Features />
      <Footer />
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
