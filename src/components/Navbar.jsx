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

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <CapiroLogo color="#01226A" height={24} />
      <div className="navbar__links">
        <button className="navbar__link" onClick={() => scrollTo("how-it-works")}>How It Works</button>
        <button className="navbar__link" onClick={() => scrollTo("ai-transparency")}>AI &amp; Transparency</button>
        <button className="navbar__link" onClick={() => scrollTo("pricing")}>Pricing</button>
      </div>
      <div className="navbar__actions">
        <button className="btn-ghost" onClick={onLoginClick}>Sign In</button>
        <button className="btn-accent" onClick={() => scrollTo("get-started")}>Join Waitlist</button>
      </div>
    </nav>
  );
}
