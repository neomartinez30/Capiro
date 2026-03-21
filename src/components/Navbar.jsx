import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";

export default function Navbar({ onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <span className="navbar__logo-text" style={{fontSize:"22px",fontWeight:700,color:"#fff",letterSpacing:"-0.5px"}}>Capiro</span>
      <div className="navbar__actions">
        <button className="btn-ghost" onClick={onLoginClick}>Sign In</button>
        <button className="btn-accent" onClick={onLoginClick}>Get Started</button>
      </div>
    </nav>
  );
}
