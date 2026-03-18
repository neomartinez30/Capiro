import React from "react";
import FeatureCard from "./FeatureCard";
import BRAND from "../config/brand";
import "../styles/Features.css";

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BRAND.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Structured Submissions",
    desc: "Standardize how legislative information is submitted with intelligent workflows that adapt to each office's requirements.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BRAND.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Automated Processing",
    desc: "Reduce manual burden for congressional offices with AI‑driven categorization, comparison, and decision support.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BRAND.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0022 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: "Policy Intelligence",
    desc: "Build a structured intelligence layer from workflow data that enables faster, better‑informed decisions at scale.",
  },
];

export default function Features() {
  return (
    <section id="features" className="features">
      <div className="features__header">
        <p className="features__eyebrow">Platform Capabilities</p>
        <h2 className="features__title">
          Infrastructure for legislative workflows
        </h2>
      </div>

      <div className="features__grid">
        {FEATURES.map((f, i) => (
          <FeatureCard key={i} {...f} delay={0.1 + i * 0.15} />
        ))}
      </div>
    </section>
  );
}
