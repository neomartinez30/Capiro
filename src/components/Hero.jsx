import React, { useState } from "react";
import "../styles/Hero.css";

export default function Hero({ onLoginClick }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Open mailto with the user's email pre-filled
      window.location.href = `mailto:info@capiro.ai?subject=${encodeURIComponent('Waitlist Request')}&body=${encodeURIComponent(`Hi Capiro team,\n\nI'd like to join the waitlist for early access.\n\nEmail: ${email}\n\nThanks!`)}`;
      setSubmitted(true);
    }
  };

  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="pill-badge">
          <span className="pill-badge__dot" />
          Now accepting early access requests
        </div>

        <h1 className="hero__headline">
          AI Workflows for{" "}
          <span className="hero__headline-accent">congressional submissions</span>
        </h1>

        <p className="hero__subline">
          Capiro standardizes and automates how legislative information is submitted,
          processed, and understood — so practitioners spend time on strategy, not copy-paste.
        </p>

        {/* Waitlist CTA */}
        <div className="hero__waitlist">
          {!submitted ? (
            <form className="waitlist-form" onSubmit={handleWaitlist}>
              <input
                type="email"
                className="waitlist-input"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="waitlist-btn">
                Join the Waitlist
              </button>
            </form>
          ) : (
            <div className="waitlist-confirmed">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>You&rsquo;re on the list. We&rsquo;ll be in touch.</span>
            </div>
          )}
          <p className="waitlist-note">
            Early access opens Q2 2026 &middot; No credit card required
          </p>
        </div>

        {/* Request Demo CTA */}
        <div className="hero__demo">
          <a
            href="mailto:info@capiro.ai?subject=Demo%20Request&body=Hi%20Capiro%20team%2C%0A%0AI%E2%80%99d%20like%20to%20request%20a%20demo.%0A%0AName%3A%20%0ACompany%3A%20%0ARole%3A%20%0A%0AThanks!"
            className="hero__demo-btn"
          >
            Request a Demo
          </a>
        </div>

        <div className="hero__stats">
          <div className="hero__stat">
            <strong>~240K</strong>
            <span>submissions filed per cycle</span>
          </div>
          <div className="hero__stat">
            <strong>$54M</strong>
            <span>professional time lost to forms annually</span>
          </div>
          <div className="hero__stat">
            <strong>535</strong>
            <span>offices, each with a different portal</span>
          </div>
          <div className="hero__stat">
            <strong>0</strong>
            <span>platforms built for this — until now</span>
          </div>
        </div>
      </div>
    </section>
  );
}
