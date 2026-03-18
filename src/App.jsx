import React, { useState } from "react";
import GridBackground from "./components/GridBackground";
import Particles from "./components/Particles";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import "./styles/global.css";

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div>
      <GridBackground />
      <Particles />
      <Navbar onLoginClick={() => setLoginOpen(true)} />
      <Hero onLoginClick={() => setLoginOpen(true)} />
      <Features />
      <Footer />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
