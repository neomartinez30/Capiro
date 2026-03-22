import React, { useState, useEffect } from "react";
import CapiroLogo from "./CapiroLogo";
import "../styles/Navbar.css";

export default function Navbar({ onLoginClick, onSignupClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <CapiroLogo color="#fff" height={22} />
      <div className="navbar__actions">
        <button className="btn-ghost" onClick={onLoginClick}>Sign In</button>
        <button className="btn-accent" onClick={onSignupClick || onLoginClick}>Get Started</button>
      </div>
    </nav>
  );
}
