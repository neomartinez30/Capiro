import React from "react";
import "../styles/Features.css";

export default function Features() {
  return (
    <section id="features" className="features">
      <div className="features__header">
        <p className="features__eyebrow">Platform in Action</p>
        <h2 className="features__title">See what Capiro does - not just what it promises</h2>
        <p className="features__subtitle">
          Two core capabilities that replace hundreds of hours of manual work every submission cycle.
        </p>
      </div>

      {/* Feature 1: AI White Paper Drafting */}
      <div className="feature-showcase">
        <div className="feature-showcase__text">
          <span className="feature-showcase__badge">Core Capability</span>
          <h3 className="feature-showcase__title">AI White Paper Drafting</h3>
          <p className="feature-showcase__desc">
            Co-write compelling white papers with an AI assistant trained on legislative conventions.
            Capiro pulls from client profiles, real-time intelligence, and prior NDAA language to
            generate structured drafts you refine with full formatting tools and team collaboration.
          </p>
          <ul className="feature-showcase__list">
            <li>AI-generated structured drafts from your documents</li>
            <li>Real-time team collaboration and inline comments</li>
            <li>Full formatting toolbar with word and character tracking</li>
          </ul>
        </div>
        <div className="feature-showcase__media">
          <div className="feature-screenshot">
            <img src="/white-paper.png" alt="AI White Paper Drafting - collaborative editor with AI assistant" />
          </div>
        </div>
      </div>

      {/* Feature 2: Multi-Office Submission Routing */}
      <div className="feature-showcase feature-showcase--reverse">
        <div className="feature-showcase__text">
          <span className="feature-showcase__badge">Core Capability</span>
          <h3 className="feature-showcase__title">Multi-Office Submission Routing</h3>
          <p className="feature-showcase__desc">
            Select from a live directory of all congressional offices with real-time deadlines
            and unique form requirements. Capiro's AI agent pre-populates every field across every
            selected office and submits simultaneously.
          </p>
          <ul className="feature-showcase__list">
            <li>Live deadline tracking for every senate office</li>
            <li>Filter by state, party, committee, and deadline status</li>
            <li>AI agent fills and submits to all offices at once</li>
          </ul>
        </div>
        <div className="feature-showcase__media">
          <div className="feature-screenshot feature-screenshot--stacked">
            <img src="/multi-office.png" alt="Multi-Office Selection" className="feature-img-main" />
            <img src="/multi-office-agent.png" alt="AI Form Agent" className="feature-img-overlay" />
          </div>
        </div>
      </div>
    </section>
  );
}
