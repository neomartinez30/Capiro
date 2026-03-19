import React from "react";
import "../styles/Hero.css";

export default function Hero({ onLoginClick }) {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="pill-badge">
          <span className="pill-badge__dot" />
          Agentic Congressional Workflows
        </div>
        <h1 className="hero__headline">
          Structure. Clarity.{" "}
          <span className="hero__headline-accent">Intelligence.</span>
        </h1>
        <p className="hero__subline">
          Capiro standardizes and automates how legislative information is
          submitted, processed, and understood across government.
        </p>
        <div className="hero__ctas">
          <button className="btn-primary-lg" onClick={onLoginClick}>Request Access</button>
          <button
            className="btn-secondary-lg"
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
          >
            Learn More
          </button>
        </div>
        <div className="hero__scroll-hint">
          <p className="hero__scroll-label">Scroll to explore</p>
          <div className="hero__scroll-line" />
        </div>
      </div>
    </section>
  );
}
