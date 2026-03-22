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
      </svg>
    ),
    title: "AI White Paper Drafting",
    desc: "Co-write submission documents in-platform. Capiro\u2019s AI pulls from client profiles, PE line data, USASpending history, and prior NDAA language to draft structured white papers that match legislative conventions.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BRAND.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "Multi-Office Submission Routing",
    desc: "Select target offices from a maintained directory with live deadlines. AI generates per-office submissions with district-specific language, then routes to all offices simultaneously.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BRAND.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    title: "Human-in-the-Loop, Always",
    desc: "Every submission is surfaced for review before delivery. Nothing leaves without your explicit approval. AI handles the mechanical work — you own the final call.",
  },
];

export default function Features() {
  return (
    <section id="features" className="features">
      <div className="features__header">
        <p className="features__eyebrow">Platform Capabilities</p>
        <h2 className="features__title">From raw client data to confirmed multi-office submission — in one workflow</h2>
      </div>
      <div className="features__grid">
        {FEATURES.map((f, i) => (
          <FeatureCard key={i} {...f} delay={0.1 + i * 0.15} />
        ))}
      </div>
    </section>
  );
}
