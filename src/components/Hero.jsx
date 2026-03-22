import React from "react";
import "../styles/Hero.css";

export default function Hero({ onLoginClick }) {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="pill-badge">
          <span className="pill-badge__dot" />
          Purpose-built for government affairs professionals
        </div>
        <h1 className="hero__headline">
          Stop filing.{" "}
          <span className="hero__headline-accent">Start influencing.</span>
        </h1>
        <p className="hero__subline">
          Capiro automates the mechanical work of congressional submissions — white papers,
          form pre-population, multi-office routing, and confirmed delivery — so you can
          spend your time on strategy, not copy-paste.
        </p>
        <div className="hero__ctas">
          <button className="btn-primary-lg" onClick={onLoginClick}>Start for Free</button>
          <button
            className="btn-secondary-lg"
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
          >
            See How It Works &rarr;
          </button>
        </div>
        <div className="hero__stats">
          <div className="hero__stat">
            <strong>~240K</strong>
            <span>submissions filed per cycle</span>
          </div>
          <div className="hero__stat">
            <strong>$54M</strong>
            <span>in professional time spent on forms annually</span>
          </div>
          <div className="hero__stat">
            <strong>535</strong>
            <span>congressional offices, each with their own portal</span>
          </div>
          <div className="hero__stat">
            <strong>0</strong>
            <span>platforms addressed this — until now</span>
          </div>
        </div>
      </div>
    </section>
  );
}
