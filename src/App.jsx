import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GridBackground from "./components/GridBackground";
import Particles from "./components/Particles";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import DashboardPage from "./pages/DashboardPage";
import LobbyistProfilePage from "./pages/LobbyistProfilePage";
import FirmProfilePage from "./pages/FirmProfilePage";
import ClientProfilePage from "./pages/ClientProfilePage";
import "./styles/global.css";

function LandingPage({ onLoginClick }) {
  return (
    <div>
      <GridBackground />
      <Particles />
      <Navbar onLoginClick={onLoginClick} />
      <Hero onLoginClick={onLoginClick} />
      <Features />
      <Footer />
    </div>
  );
}

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ─── TODO: Replace with real Cognito auth state ───────────────
  // import { useAuthenticator } from '@aws-amplify/ui-react';
  // const { user, signOut } = useAuthenticator();
  // const isAuthenticated = !!user;

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // TODO: await signOut();
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LandingPage onLoginClick={() => setLoginOpen(true)} />
            )
          }
        />

        {/* Dashboard shell wraps all authenticated routes */}
        <Route
          path="/dashboard"
          element={<DashboardPage onLogout={handleLogout} />}
        />
        <Route
          path="/profiles/lobbyist"
          element={<DashboardPage onLogout={handleLogout} page="lobbyist-profile" />}
        />
        <Route
          path="/profiles/lobbyist/:id"
          element={<DashboardPage onLogout={handleLogout} page="lobbyist-profile" />}
        />
        <Route
          path="/profiles/firm"
          element={<DashboardPage onLogout={handleLogout} page="firm-profile" />}
        />
        <Route
          path="/profiles/firm/:id"
          element={<DashboardPage onLogout={handleLogout} page="firm-profile" />}
        />
        <Route
          path="/profiles/client"
          element={<DashboardPage onLogout={handleLogout} page="client-profile" />}
        />
        <Route
          path="/profiles/client/:id"
          element={<DashboardPage onLogout={handleLogout} page="client-profile" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </BrowserRouter>
  );
}
