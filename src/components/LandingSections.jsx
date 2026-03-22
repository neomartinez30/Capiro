import React from "react";
import "../styles/LandingSections.css";

/* ── Problem Section ── */
function ProblemSection() {
  const steps = [
    { n: 1, title: "Finding the portals", desc: "No centralized directory exists. Each of 535 offices publishes — or doesn\u2019t publish — its own submission URL on its own schedule." },
    { n: 2, title: "Drafting the white paper", desc: "PE line numbers, PBR figures, USASpending history, prior NDAA language — all pulled manually from disconnected federal data sources." },
    { n: 3, title: "Filling every form by hand", desc: "Google Forms, Word docs, SharePoint portals, proprietary web systems — no two offices use the same format. No reuse is possible." },
    { n: 4, title: "Rewriting district language 15 times", desc: "Every form asks how the request benefits that member\u2019s state or district. The answer must be unique for every single office." },
  ];

  return (
    <section className="ls-section ls-problem">
      <div className="ls-container">
        <p className="ls-label">The Problem</p>
        <h2 className="ls-title">Washington runs on copy-paste. That ends here.</h2>
        <p className="ls-body">
          Every year, thousands of lobbyists manually copy the same information into
          hundreds of slightly different congressional forms — in inconsistent formats,
          under staggered deadlines, with no shared infrastructure on either side.
        </p>
        <div className="ls-problem-grid">
          {steps.map((s) => (
            <div key={s.n} className="ls-problem-card">
              <div className="ls-step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="ls-callout">
          <div className="ls-callout-text">
            <p className="ls-callout-quote">&ldquo;I wish there were a platform that could streamline this whole process.&rdquo;</p>
            <p className="ls-callout-cite">— Michael Curcio, Chief of Staff, Rep. Mark Messmer</p>
          </div>
          <div className="ls-callout-stat">
            <strong>$54M</strong>
            <span>in professional billing time lost to form-filling every year</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ── */
function HowItWorks() {
  const steps = [
    { num: "1", title: "Build the client profile", desc: "Drop in the client\u2019s URL. Capiro scrapes and structures a baseline profile — company description, issue areas, organizational footprint. Enrich it with white papers, past submissions, and reference documents.", tag: "One-time setup", tagType: "human" },
    { num: "2", title: "Create submission topics", desc: "Define each request: submission type (NDAA, Appropriations, or both), request type (Funding, Report Language, Bill Language), and the relevant federal agency and program.", tag: "Practitioner judgment", tagType: "human" },
    { num: "AI", title: "Co-write the white paper in-platform", desc: "Capiro\u2019s AI drafting assistant pulls from the client profile, real-time intelligence feeds, PE line data, USASpending history, and prior NDAA language. You edit; Capiro drafts.", tag: "AI-assisted \u00B7 Human-edited", tagType: "ai" },
    { num: "4", title: "Select target offices from the directory", desc: "A maintained, current directory of all congressional offices — with submission portal status, live deadlines, subcommittee memberships, and member priorities.", tag: "Live directory \u00B7 Auto-maintained", tagType: "auto" },
    { num: "AI", title: "AI generates per-office submissions", desc: "Every field across every selected office is pre-populated simultaneously. The district connection statement is AI-generated fresh for each member, using their state context and known priorities.", tag: "AI-generated \u00B7 Character-limit enforced", tagType: "ai" },
    { num: "6", title: "Human review before every send", desc: "Every submission is surfaced to you for review before delivery. Nothing leaves without your explicit approval. This is a core product principle.", tag: "Human gate \u00B7 No exceptions", tagType: "human" },
    { num: "AI", title: "Submit to all offices simultaneously", desc: "Adopted offices receive submissions in a structured Capiro inbox. Non-adopted offices are handled by Capiro\u2019s AI agent, which navigates the portal and submits.", tag: "All channels covered", tagType: "auto" },
    { num: "8", title: "Submission history builds automatically", desc: "Every confirmed submission is logged against the client and topic. Future forms that ask \u201Cwhat other offices have you submitted this to?\u201D auto-populate from your history.", tag: "Compounding intelligence", tagType: "auto" },
  ];

  return (
    <section id="how-it-works" className="ls-section ls-workflow">
      <div className="ls-container">
        <p className="ls-label">The Solution</p>
        <h2 className="ls-title">From raw client data to confirmed multi-office submission — in one workflow.</h2>
        <p className="ls-body">
          Capiro takes a government affairs professional from intake to delivery without breaking their flow.
          Every step is integrated. Nothing lives in a spreadsheet, an email thread, or a browser tab farm.
        </p>
        <div className="ls-steps">
          {steps.map((s, i) => (
            <div key={i} className="ls-step">
              <div className={`ls-step-icon ${s.num === "AI" ? "ls-step-icon--ai" : ""}`}>
                {s.num}
              </div>
              <div className="ls-step-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className={`ls-tag ls-tag--${s.tagType}`}>{s.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── AI Transparency ── */
function AITransparency() {
  const principles = [
    { icon: "\uD83D\uDD0D", title: "Full Transparency", desc: "Every AI-generated field is visible to you before submission. No black boxes, no hidden logic." },
    { icon: "\u270B", title: "Human-in-the-Loop, Always", desc: "No submission leaves the platform without explicit practitioner approval. The human review gate is a hard product constraint." },
    { icon: "\uD83D\uDCCB", title: "AI Trained on Legislative Conventions", desc: "Capiro\u2019s drafting AI is purpose-trained on NDAA and Appropriations submission language — not generic content." },
    { icon: "\uD83D\uDD12", title: "Data Stays Yours", desc: "Client profiles, white papers, and submission history are yours. Capiro does not use your client data to train shared models." },
    { icon: "\uD83D\uDCCA", title: "Auditable Submission Record", desc: "Every submission is logged with a timestamp, delivery method, and confirmed status. Full, searchable record." },
    { icon: "\u2696\uFE0F", title: "Expertise Is Not Automated", desc: "Capiro does not automate which members to approach or what language will resonate. Those things require expertise." },
  ];

  return (
    <section id="ai-transparency" className="ls-section ls-ai">
      <div className="ls-container">
        <p className="ls-label ls-label--gold">AI Governance &amp; Transparency</p>
        <h2 className="ls-title">AI does the mechanical work. You make every decision that matters.</h2>
        <p className="ls-body" style={{ color: "rgba(255,255,255,0.55)" }}>
          Roughly 80% of the submission workflow is mechanical and can be automated.
          The remaining 20% — the strategic judgment, the language refinement, the final approval — belongs to the practitioner. Always.
        </p>
        <div className="ls-ai-bar">
          <div className="ls-ai-bar-labels">
            <span>Capiro handles (80%)</span>
            <span>You own (20%)</span>
          </div>
          <div className="ls-ai-bar-track">
            <div className="ls-ai-bar-fill" />
          </div>
          <div className="ls-ai-bar-detail">
            <span>Copying &middot; Pasting &middot; Formatting &middot; Routing &middot; Localizing &middot; Tracking</span>
            <span>Strategy &middot; Judgment &middot; Relationships &middot; Final approval</span>
          </div>
        </div>
        <div className="ls-principle-grid">
          {principles.map((p, i) => (
            <div key={i} className="ls-principle">
              <div className="ls-principle-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Competitive Table ── */
function CompetitiveSection() {
  const rows = [
    { cap: "Bill & legislative tracking", bg: "\u2713 Core feature", q: "\u2713 Core feature", fn: "\u2713 Core feature", c: "\u2713 Integrated layer" },
    { cap: "Stakeholder CRM", bg: "\u2717 Not available", q: "\u2713 Available", fn: "\u2713 Available", c: "\u2713 Native, linked to submissions" },
    { cap: "Congressional portal directory with live deadlines", bg: "\u2717", q: "\u2717", fn: "\u2717", c: "\u2713 Maintained, per-office deadlines" },
    { cap: "White paper / document drafting", bg: "\u2717", q: "\u2717", fn: "\u2717", c: "\u2713 AI-assisted, trained on legislative language" },
    { cap: "AI form pre-population from white paper", bg: "\u2717", q: "\u2717", fn: "\u2717", c: "\u2713 Core submission workflow" },
    { cap: "Multi-office submission routing", bg: "\u2717", q: "\u2717", fn: "\u2717", c: "\u2713 Select, generate, review, submit" },
    { cap: "District language localization per member", bg: "\u2717", q: "\u2717", fn: "\u2717", c: "\u2713 AI-generated per office" },
    { cap: "Automated portal submission (AI agent)", bg: "\u2717", q: "\u2717", fn: "\u2717", c: "\u2713 Navigates portal, populates, submits" },
    { cap: "Submission history tracking across offices", bg: "\u2717", q: "\u2717", fn: "\u2717", c: "\u2713 Auto-fills \u201Cother offices\u201D field" },
    { cap: "Congressional office structured inbox", bg: "\u2717", q: "\u2717", fn: "\u2717", c: "\u2713 For offices that adopt Capiro" },
  ];

  return (
    <section id="why-capiro" className="ls-section ls-comp">
      <div className="ls-container">
        <p className="ls-label">Why Capiro</p>
        <h2 className="ls-title">The existing market built excellent tools for everything except the actual submission.</h2>
        <p className="ls-body">
          Bloomberg Government, Quorum, and FiscalNote provide real value for legislative tracking.
          None of them touch submission execution — the act of getting a request from white paper to congressional inbox.
        </p>
        <div className="ls-table-wrap">
          <table className="ls-table">
            <thead>
              <tr>
                <th>Capability</th>
                <th>Bloomberg Gov</th>
                <th>Quorum</th>
                <th>FiscalNote</th>
                <th className="ls-th-cap">Capiro</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="ls-td-cap">{r.cap}</td>
                  <td className={r.bg.startsWith("\u2713") ? "ls-check" : "ls-cross"}>{r.bg}</td>
                  <td className={r.q.startsWith("\u2713") ? "ls-check" : "ls-cross"}>{r.q}</td>
                  <td className={r.fn.startsWith("\u2713") ? "ls-check" : "ls-cross"}>{r.fn}</td>
                  <td className="ls-cap-check">{r.c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ── Defensible Moats ── */
function MoatsSection() {
  const moats = [
    { icon: "\uD83D\uDD01", title: "Two-Sided Network Effect", desc: "Every congressional office that adopts Capiro\u2019s inbox makes it faster for every lobbyist. More offices = more value for submitters.", label: "Network \u00B7 Gets stronger over time" },
    { icon: "\uD83D\uDCC8", title: "Compounding Intelligence", desc: "Each submission enriches your client profiles, improves targeting, and pre-populates future forms with your history.", label: "Data \u00B7 Proprietary to each firm" },
    { icon: "\uD83D\uDCC2", title: "The Only Portal Directory", desc: "No public, current database of all congressional submission portals with per-office deadlines exists anywhere. Capiro maintains this.", label: "Infrastructure \u00B7 Maintained continuously" },
    { icon: "\uD83E\uDDE0", title: "Domain-Specific AI", desc: "Capiro\u2019s AI is trained on NDAA and Appropriations language conventions. Generic LLM products cannot replicate this without years of domain data.", label: "AI specialization \u00B7 Legislative-native" },
    { icon: "\uD83C\uDF10", title: "Free Tier as Network Seed", desc: "Every free-tier submission introduces Capiro to a congressional office. Every free-tier user is a conversion opportunity.", label: "GTM \u00B7 Viral adoption flywheel" },
    { icon: "\u23F1\uFE0F", title: "Calendar-Locked Switching Costs", desc: "A firm that runs one cycle through Capiro has profiles, white papers, and history already built. Switching means rebuilding all of it.", label: "Retention \u00B7 Annual lock-in by design" },
  ];

  return (
    <section className="ls-section ls-moats">
      <div className="ls-container">
        <p className="ls-label">Defensible Advantages</p>
        <h2 className="ls-title">The advantages that compound with every submission.</h2>
        <p className="ls-body">
          Capiro is not just a better tool — it is a network that gets more valuable the more it is used.
        </p>
        <div className="ls-moat-grid">
          {moats.map((m, i) => (
            <div key={i} className="ls-moat-card">
              <span className="ls-moat-icon">{m.icon}</span>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
              <span className="ls-moat-label">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Year-Round Value ── */
function YearRound() {
  const phases = [
    { when: "Oct \u2013 Dec", title: "Off-Cycle Preparation", desc: "Client profile building, white paper development, topic strategy, relationship tracking, and opportunity identification.", active: false },
    { when: "Jan \u2013 Mar \u2605", title: "Submission Season", desc: "Portal directory with live deadlines, AI form pre-population, multi-office routing, district localization, human review gates, and tracking.", active: true },
    { when: "Apr \u2013 May", title: "Office Triage", desc: "Structured submission inbox, comparative review tools, member priority alignment, and request synthesis for adopted offices.", active: false },
    { when: "Apr \u2013 Dec", title: "Post-Submission Strategy", desc: "Champion identification, member priority ranking, follow-up tracking, conference monitoring, and outcome attribution.", active: false },
  ];

  return (
    <section className="ls-section ls-year">
      <div className="ls-container" style={{ textAlign: "center" }}>
        <p className="ls-label">Year-Round Platform</p>
        <h2 className="ls-title">Submission season is the entry point. The value is twelve months long.</h2>
        <div className="ls-year-grid">
          {phases.map((p, i) => (
            <div key={i} className={`ls-year-phase ${p.active ? "ls-year-phase--active" : ""}`}>
              <div className="ls-year-when">{p.when}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ── */
function Testimonials() {
  const cards = [
    { quote: "I wish there were a platform that could streamline this whole process.", initials: "MC", name: "Michael Curcio", role: "Chief of Staff, Rep. Mark Messmer", date: "March 4, 2026" },
    { quote: "Everything in this work is driven by where Congress is in the timeline. Organizations that align with the calendar have influence.", initials: "MS", name: "Madison Sparber", role: "Legislative Assistant, Sen. Ted Cruz\u2019s Office", date: "March 20, 2026" },
    { quote: "I would pay for this platform today if it were available.", initials: "SL", name: "Senior Lobbyist (\u00D72, independent)", role: "Washington Government Affairs Practitioners", date: "Early 2026" },
  ];

  return (
    <section className="ls-section ls-testimonials">
      <div className="ls-container" style={{ textAlign: "center" }}>
        <p className="ls-label">Field Evidence</p>
        <h2 className="ls-title">The people who live this problem said it themselves.</h2>
        <div className="ls-testimonial-grid">
          {cards.map((c, i) => (
            <div key={i} className="ls-testimonial-card">
              <blockquote>&ldquo;{c.quote}&rdquo;</blockquote>
              <div className="ls-cite">
                <span className="ls-cite-dot">{c.initials}</span>
                <span>
                  <strong>{c.name}</strong><br />
                  {c.role}<br />
                  <em>{c.date}</em>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ── */
function Pricing({ onLoginClick }) {
  return (
    <section id="pricing" className="ls-section ls-pricing">
      <div className="ls-container" style={{ textAlign: "center" }}>
        <p className="ls-label">Pricing</p>
        <h2 className="ls-title">Start free. Scale when you&rsquo;re ready.</h2>
        <p className="ls-body" style={{ margin: "0 auto 48px" }}>
          Every practitioner deserves access to the infrastructure. The free tier gets you into the network.
        </p>
        <div className="ls-pricing-grid">
          <div className="ls-pricing-card">
            <p className="ls-plan-name">Free Tier</p>
            <p className="ls-price">$0</p>
            <p className="ls-price-sub">Always free &middot; No credit card required</p>
            <ul>
              <li>Standardized submission form interface</li>
              <li>Congressional office directory with deadlines</li>
              <li>Manual submission to any office</li>
              <li>PDF delivery to non-portal offices</li>
              <li>Submission confirmation and tracking</li>
            </ul>
            <button className="ls-btn-plan ls-btn-outline" onClick={onLoginClick}>Get Started Free</button>
          </div>
          <div className="ls-pricing-card ls-pricing-card--featured">
            <p className="ls-plan-name">Professional</p>
            <p className="ls-price">Contact Us</p>
            <p className="ls-price-sub">Per seat &middot; Annual subscription</p>
            <ul>
              <li>Full client profile workspace</li>
              <li>AI white paper co-drafting</li>
              <li>Multi-office routing and simultaneous submission</li>
              <li>AI per-office form pre-population</li>
              <li>District language localization per member</li>
              <li>Automated portal submission (AI agent)</li>
              <li>Submission history and auto-fill</li>
              <li>Year-round intelligence and tracking</li>
            </ul>
            <button className="ls-btn-plan ls-btn-filled" onClick={onLoginClick}>Request a Demo</button>
          </div>
          <div className="ls-pricing-card">
            <p className="ls-plan-name">Congressional Office</p>
            <p className="ls-price">Free</p>
            <p className="ls-price-sub">For member offices that adopt Capiro</p>
            <ul>
              <li>Structured submission inbox</li>
              <li>Standardized intake format across all submitters</li>
              <li>Comparative review tools</li>
              <li>Member priority alignment tagging</li>
              <li>Multi-year submission history</li>
            </ul>
            <button className="ls-btn-plan ls-btn-outline" onClick={onLoginClick}>Learn More</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ── */
function FinalCTA({ onLoginClick }) {
  return (
    <section id="get-started" className="ls-section ls-cta">
      <div className="ls-container" style={{ textAlign: "center" }}>
        <p className="ls-label ls-label--gold">Get Started</p>
        <h2 className="ls-title">The 60-second demo moment speaks for itself.</h2>
        <p className="ls-body" style={{ margin: "0 auto 44px", color: "rgba(255,255,255,0.55)" }}>
          A lobbyist selects fifteen congressional offices, sees pre-populated submissions tailored
          to each, and submits to all of them simultaneously. That is what Capiro recovers.
        </p>
        <div className="ls-cta-buttons">
          <button className="btn-primary-lg" onClick={onLoginClick}>Start for Free</button>
          <button className="btn-secondary-lg" onClick={onLoginClick}>Request a Demo</button>
        </div>
      </div>
    </section>
  );
}

/* ── Export All Sections ── */
export default function LandingSections({ onLoginClick }) {
  return (
    <>
      <ProblemSection />
      <HowItWorks />
      <AITransparency />
      <CompetitiveSection />
      <MoatsSection />
      <YearRound />
      <Testimonials />
      <Pricing onLoginClick={onLoginClick} />
      <FinalCTA onLoginClick={onLoginClick} />
    </>
  );
}
