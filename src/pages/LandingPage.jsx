import React from "react";
import LoginModal from "../components/LoginModal";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function LandingPage() {
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [loginMode, setLoginMode] = React.useState("login");
  const { user } = useAuth();

  if (user) return <Navigate to={user.orgId ? "/app" : "/onboarding"} replace />;

  const openLogin = (mode = "login") => { setLoginMode(mode); setLoginOpen(true); };

  return (
    <>
      <style>{landingCSS}</style>

      {/* ANNOUNCEMENT BAR */}
      <div className="announcement">
        FY2027 submission season is open. &nbsp;<a href="#get-started">Get started free →</a>
      </div>

      {/* NAV */}
      <nav className="lp-nav">
        <div className="nav-inner">
          <a href="#" className="logo">Capiro</a>
          <ul className="nav-links">
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#ai-transparency">AI & Transparency</a></li>
            <li><a href="#why-capiro">Why Capiro</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#get-started" className="btn-nav" onClick={e => { e.preventDefault(); openLogin("signup"); }}>Get Started Free</a></li>
          </ul>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="lp-container">
          <div className="hero-badge">
            <span className="dot" />
            Purpose-built for government affairs professionals
          </div>
          <h1>Stop filing.<br />Start <em>influencing.</em></h1>
          <p className="hero-sub">
            Capiro automates the mechanical work of congressional submissions — white papers, form pre-population, multi-office routing, and confirmed delivery — so you can spend your time on strategy, not copy-paste.
          </p>
          <div className="hero-actions">
            <a href="#" className="btn-primary-lp" onClick={e => { e.preventDefault(); openLogin("signup"); }}>Start for Free</a>
            <a href="#how-it-works" className="btn-ghost">See How It Works →</a>
          </div>
          <div className="hero-stat-bar">
            <div className="hero-stat"><strong>~240K</strong><span>submissions filed per cycle</span></div>
            <div className="hero-stat"><strong>$54M</strong><span>in professional time spent on forms annually</span></div>
            <div className="hero-stat"><strong>535</strong><span>congressional offices, each with their own portal</span></div>
            <div className="hero-stat"><strong>0</strong><span>platforms addressed this — until now</span></div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem-section">
        <div className="lp-container">
          <p className="section-label">The Problem</p>
          <div className="two-col">
            <div>
              <h2 className="section-title">Washington runs on copy-paste. That ends here.</h2>
              <p className="section-body">
                Every year, thousands of lobbyists manually copy the same information into hundreds of slightly different congressional forms — in inconsistent formats, under staggered deadlines, with no shared infrastructure on either side. The process hasn't materially changed in decades.
              </p>
            </div>
            <div>
              <div className="problem-steps">
                {[
                  { n: 1, title: "Finding the portals", desc: "No centralized directory exists. Each of 535 offices publishes — or doesn't publish — its own submission URL on its own schedule." },
                  { n: 2, title: "Drafting the white paper", desc: "PE line numbers, PBR figures, USASpending history, prior NDAA language — all pulled manually from disconnected federal data sources." },
                  { n: 3, title: "Filling every form by hand", desc: "Google Forms, Word docs, SharePoint portals, proprietary web systems — no two offices use the same format. No reuse is possible." },
                  { n: 4, title: "Rewriting district language 15 times", desc: "Every form asks how the request benefits that member's state or district. The answer must be unique for every single office." },
                ].map(s => (
                  <div key={s.n} className="problem-card">
                    <div className="step-num"><span className="step-num-circle">{s.n}</span>Step {s.n}</div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="problem-callout">
            <blockquote>
              "I wish there were a platform that could streamline this whole process."
              <cite>— Michael Curcio, Chief of Staff, Rep. Mark Messmer · March 4, 2026</cite>
            </blockquote>
            <div className="cost-box">
              <strong>$54M</strong>
              <span>in professional billing time<br/>lost to form-filling every year</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works">
        <div className="lp-container">
          <p className="section-label">The Solution</p>
          <div className="two-col">
            <div>
              <h2 className="section-title">From raw client data to confirmed multi-office submission — in one workflow.</h2>
              <p className="section-body">
                Capiro takes a government affairs professional from intake to delivery without breaking their flow. Every step is integrated. Nothing lives in a spreadsheet, an email thread, or a browser tab farm.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.7 }}>
                The platform serves two sides of the same broken process simultaneously — the firms and organizations submitting requests, and the congressional offices receiving and reviewing them. Both sides benefit from the same infrastructure.
              </p>
            </div>
          </div>

          <div className="workflow-steps">
            {[
              { n: "1", title: "Build the client profile", desc: "Drop in the client's URL. Capiro scrapes and structures a baseline profile — company description, issue areas, organizational footprint. Enrich it with white papers, past submissions, and reference documents.", tag: "One-time setup", tagType: "human" },
              { n: "2", title: "Create submission topics", desc: "Define each request: submission type (NDAA, Appropriations, or both), request type (Funding, Report Language, Bill Language), and the relevant federal agency and program.", tag: "Practitioner judgment", tagType: "human" },
              { n: "AI", title: "Co-write the white paper in-platform", desc: "Capiro's AI drafting assistant pulls from the client profile, real-time intelligence feeds, PE line data, USASpending history, and prior NDAA language. You edit; Capiro drafts.", tag: "AI-assisted · Human-edited", tagType: "ai", gold: true },
              { n: "4", title: "Select target offices from the directory", desc: "A maintained, current directory of all congressional offices — with submission portal status, live deadlines, subcommittee memberships, and member priorities.", tag: "Live directory · Auto-maintained", tagType: "auto" },
              { n: "AI", title: "AI generates per-office submissions", desc: "Every field across every selected office is pre-populated simultaneously. The district connection statement is AI-generated fresh for each member.", tag: "AI-generated · Character-limit enforced", tagType: "ai", gold: true },
              { n: "6", title: "Human review before every send", desc: "Every submission is surfaced to you for review before delivery. Nothing leaves without your explicit approval. This is a core product principle.", tag: "Human gate · No exceptions", tagType: "human" },
              { n: "AI", title: "Submit to all offices simultaneously", desc: "Adopted offices receive submissions in a structured Capiro inbox. Non-adopted offices are handled by Capiro's AI agent, which navigates the portal and submits.", tag: "All channels covered", tagType: "auto", gold: true },
              { n: "8", title: "Submission history builds automatically", desc: "Every confirmed submission is logged. Future forms that ask 'what other offices have you submitted this to?' auto-populate from your history.", tag: "Compounding intelligence", tagType: "auto" },
            ].map((s, i) => (
              <div key={i} className="workflow-step">
                <div className={`step-icon${s.gold ? " gold" : ""}`}>{s.n}</div>
                <div className="step-content">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <span className={`step-tag ${s.tagType}`}>{s.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI TRANSPARENCY */}
      <section id="ai-transparency" className="ai-section">
        <div className="lp-container">
          <p className="section-label">AI Governance & Transparency</p>
          <div className="two-col">
            <div>
              <h2 className="section-title">AI does the mechanical work. You make every decision that matters.</h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,.65)", lineHeight: 1.7, maxWidth: 520 }}>
                Capiro's position on AI is clear and unchanging: roughly 80% of the submission workflow is mechanical and can be automated. The remaining 20% — the strategic judgment, the language refinement, the final approval — belongs to the practitioner. Always.
              </p>
            </div>
            <div className="ai-80-20">
              <div className="ai-bar-wrap">
                <div className="ai-bar-label"><span>Capiro handles (80%)</span><span>You own (20%)</span></div>
                <div className="ai-bar"><div className="ai-bar-fill" /></div>
                <div style={{ marginTop: 16, fontSize: 13, color: "rgba(255,255,255,.4)" }}>Copying · Pasting · Formatting · Routing · Localizing · Tracking</div>
                <div style={{ marginTop: 6, fontSize: 13, color: "rgba(255,255,255,.4)" }}>Strategy · Judgment · Relationships · Final approval</div>
              </div>
            </div>
          </div>

          <div className="ai-principle-grid">
            {[
              { icon: "🔍", title: "Full Transparency", desc: "Every AI-generated field is visible to you before submission. No black boxes, no hidden logic." },
              { icon: "✋", title: "Human-in-the-Loop, Always", desc: "No submission leaves the platform without explicit practitioner approval. The human review gate is a hard product constraint." },
              { icon: "📋", title: "AI Trained on Legislative Conventions", desc: "Capiro's drafting AI is purpose-trained on NDAA and Appropriations submission language — not generic content." },
              { icon: "🔒", title: "Data Stays Yours", desc: "Client profiles, white papers, and submission history are yours. Capiro does not use your client data to train shared models." },
              { icon: "📊", title: "Auditable Submission Record", desc: "Every submission is logged with a timestamp, delivery method, and confirmed status." },
              { icon: "⚖️", title: "Expertise Is Not Automated", desc: "Capiro does not automate which members to approach or what language will resonate. Those things require expertise." },
            ].map((p, i) => (
              <div key={i} className="ai-principle">
                <div className="ai-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPETITIVE GAP */}
      <section id="why-capiro" className="comp-section">
        <div className="lp-container">
          <p className="section-label">Why Capiro</p>
          <div className="two-col">
            <div>
              <h2 className="section-title">The existing market built excellent tools for everything except the actual submission.</h2>
              <p className="section-body">
                Bloomberg Government, Quorum, and FiscalNote provide real value for legislative tracking, stakeholder management, and policy intelligence. None of them touch submission execution. That is the gap Capiro fills.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 15, color: "var(--ink-muted)", lineHeight: 1.7 }}>
                The government affairs technology market is not empty. It is simply incomplete. Capiro is not competing with your existing stack — it is adding the layer that was always missing.
              </p>
            </div>
          </div>

          <div className="comp-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Capability</th><th>Bloomberg Gov</th><th>Quorum</th><th>FiscalNote</th><th style={{ color: "var(--gold-light)" }}>Capiro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Bill & legislative tracking", "✓ Core feature", "✓ Core feature", "✓ Core feature", "✓ Integrated layer"],
                  ["Stakeholder CRM", "✗", "✓ Available", "✓ Available", "✓ Native, linked to submissions"],
                  ["Congressional portal directory", "✗", "✗", "✗", "✓ Maintained, per-office deadlines"],
                  ["White paper drafting", "✗", "✗", "✗", "✓ AI-assisted, legislative language"],
                  ["AI form pre-population", "✗", "✗", "✗", "✓ Core submission workflow"],
                  ["Multi-office submission routing", "✗", "✗", "✗", "✓ Select, generate, review, submit"],
                  ["District language localization", "✗", "✗", "✗", "✓ AI-generated per office"],
                  ["Automated portal submission", "✗", "✗", "✗", "✓ AI agent navigates & submits"],
                  ["Submission history tracking", "✗", "✗", "✗", "✓ Auto-fills cross-office fields"],
                  ["Congressional office inbox", "✗", "✗", "✗", "✓ For adopted offices"],
                ].map((row, i) => (
                  <tr key={i}>
                    <td>{row[0]}</td>
                    <td className={row[1].startsWith("✓") ? "check" : "cross"}>{row[1]}</td>
                    <td className={row[2].startsWith("✓") ? "check" : "cross"}>{row[2]}</td>
                    <td className={row[3].startsWith("✓") ? "check" : "cross"}>{row[3]}</td>
                    <td className="cap-check">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* MOATS */}
      <section>
        <div className="lp-container">
          <p className="section-label">Defensible Advantages</p>
          <h2 className="section-title">The advantages that compound with every submission.</h2>
          <div className="moat-grid">
            {[
              { icon: "🔁", title: "Two-Sided Network Effect", desc: "Every congressional office that adopts Capiro makes it faster for every lobbyist. More offices = more value.", label: "Network · Gets stronger over time" },
              { icon: "📈", title: "Compounding Intelligence", desc: "Each submission enriches client profiles and pre-populates future forms. Three cycles in, you operate at a different level.", label: "Data · Proprietary to each firm" },
              { icon: "📂", title: "The Only Portal Directory", desc: "No public, current database of all congressional submission portals exists. Capiro maintains this as a core asset.", label: "Infrastructure · Maintained continuously" },
              { icon: "🧠", title: "Domain-Specific AI", desc: "Trained on NDAA and Appropriations conventions — not general writing. Generic LLMs cannot replicate this.", label: "AI specialization · Legislative-native" },
              { icon: "🌐", title: "Free Tier as Network Seed", desc: "Every free-tier submission introduces Capiro to a congressional office. The product market-makes itself.", label: "GTM · Viral adoption flywheel" },
              { icon: "⏱️", title: "Calendar-Locked Switching Costs", desc: "One cycle through Capiro means your profiles, papers, and history are built. Switching means rebuilding all of it.", label: "Retention · Annual lock-in by design" },
            ].map((m, i) => (
              <div key={i} className="moat-card">
                <span className="moat-icon-span">{m.icon}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
                <p className="moat-label">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YEAR-ROUND VALUE */}
      <section style={{ background: "var(--cream-lp)", padding: "96px 32px" }}>
        <div className="lp-container" style={{ textAlign: "center" }}>
          <p className="section-label">Year-Round Platform</p>
          <h2 className="section-title">Submission season is the entry point. The value is twelve months long.</h2>
          <div className="year-grid">
            {[
              { when: "Oct – Dec", title: "Off-Cycle Preparation", desc: "Client profile building, white paper development, topic strategy, relationship tracking, and opportunity identification.", active: false },
              { when: "Jan – Mar ★", title: "Submission Season", desc: "Portal directory with live deadlines, AI form pre-population, multi-office routing, district localization, and submission delivery.", active: true },
              { when: "Apr – May", title: "Office Triage", desc: "Structured submission inbox, comparative review tools, member priority alignment, and request synthesis for adopted offices.", active: false },
              { when: "Apr – Dec", title: "Post-Submission Strategy", desc: "Champion identification, member priority ranking, follow-up tracking, conference monitoring, and outcome attribution.", active: false },
            ].map((p, i) => (
              <div key={i} className={`year-phase${p.active ? " active" : ""}`}>
                <div className="when">{p.when}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section>
        <div className="lp-container">
          <p className="section-label" style={{ textAlign: "center" }}>Field Evidence</p>
          <h2 className="section-title" style={{ textAlign: "center" }}>The people who live this problem said it themselves.</h2>
          <div className="testimonial-row">
            {[
              { quote: "I wish there were a platform that could streamline this whole process.", name: "Michael Curcio", role: "Chief of Staff, Rep. Mark Messmer", date: "March 4, 2026", initials: "MC" },
              { quote: "Everything in this work is driven by where Congress is in the timeline. Organizations that align with the calendar have influence.", name: "Madison Sparber", role: "Legislative Assistant, Sen. Ted Cruz's Office", date: "March 20, 2026", initials: "MS" },
              { quote: "I would pay for this platform today if it were available.", name: "Senior Lobbyist (×2)", role: "Washington Government Affairs Practitioners", date: "Early 2026", initials: "SL" },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <blockquote>"{t.quote}"</blockquote>
                <cite>
                  <span className="cite-dot">{t.initials}</span>
                  <span><strong>{t.name}</strong><br/>{t.role}<br/>{t.date}</span>
                </cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing-section">
        <div className="lp-container" style={{ textAlign: "center" }}>
          <p className="section-label">Pricing</p>
          <h2 className="section-title">Start free. Scale when you're ready.</h2>
          <p className="section-body" style={{ margin: "0 auto" }}>
            Every practitioner deserves access to the infrastructure. The free tier gets you into the network.
          </p>
          <div className="pricing-grid">
            <div className="pricing-card">
              <p className="plan-name">Free Tier</p>
              <p className="price">$0</p>
              <p className="price-sub">Always free · No credit card required</p>
              <ul>
                <li>Standardized submission form interface</li>
                <li>Congressional office directory with deadlines</li>
                <li>Manual submission to any office</li>
                <li>PDF delivery to non-portal offices</li>
                <li>Submission confirmation and tracking</li>
              </ul>
              <a href="#" className="btn-plan outline" onClick={e => { e.preventDefault(); openLogin("signup"); }}>Get Started Free</a>
            </div>
            <div className="pricing-card featured">
              <p className="plan-name">Professional</p>
              <p className="price">Contact Us</p>
              <p className="price-sub">Per seat · Annual subscription</p>
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
              <a href="#" className="btn-plan filled" onClick={e => { e.preventDefault(); openLogin("signup"); }}>Request a Demo</a>
            </div>
            <div className="pricing-card">
              <p className="plan-name">Congressional Office</p>
              <p className="price">Free</p>
              <p className="price-sub">For member offices that adopt Capiro</p>
              <ul>
                <li>Structured submission inbox</li>
                <li>Standardized intake format</li>
                <li>Comparative review tools</li>
                <li>Member priority alignment tagging</li>
                <li>Multi-year submission history</li>
              </ul>
              <a href="#" className="btn-plan outline" onClick={e => { e.preventDefault(); openLogin("signup"); }}>Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="get-started" className="final-cta">
        <div className="lp-container">
          <p className="section-label">Get Started</p>
          <h2 className="section-title">The 60-second demo moment speaks for itself.</h2>
          <p className="section-body">
            A lobbyist selects fifteen congressional offices, sees pre-populated submissions tailored to each, and submits simultaneously. The alternative is fifteen browser windows and thirty to sixty hours. That is what Capiro recovers.
          </p>
          <div className="hero-actions">
            <a href="#" className="btn-primary-lp" onClick={e => { e.preventDefault(); openLogin("signup"); }}>Start for Free</a>
            <a href="#" className="btn-ghost" onClick={e => { e.preventDefault(); openLogin("login"); }}>Request a Demo</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand"><a href="#" className="logo">Capiro</a><p>The congressional submission platform for government affairs professionals.</p></div>
            <div className="footer-links"><h4>Product</h4><ul><li><a href="#how-it-works">How It Works</a></li><li><a href="#ai-transparency">AI & Transparency</a></li><li><a href="#pricing">Pricing</a></li><li><a href="#">For Congressional Offices</a></li></ul></div>
            <div className="footer-links"><h4>Company</h4><ul><li><a href="#">About</a></li><li><a href="#">Thesis</a></li><li><a href="#">Contact</a></li></ul></div>
            <div className="footer-links"><h4>Legal</h4><ul><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms of Service</a></li><li><a href="#">AI Use Policy</a></li></ul></div>
          </div>
          <hr className="footer-divider" />
          <p>© 2026 Capiro, Inc. · capiro.ai · Built for the people who move Washington forward.</p>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      <LoginModal isOpen={loginOpen} initialMode={loginMode} onClose={() => setLoginOpen(false)} />
    </>
  );
}

/* ── All Landing Page CSS ── */
const landingCSS = `
  :root {
    --ink: #0d1117; --ink-soft: #2c3340; --ink-muted: #5a6375;
    --cream-lp: #f9f7f4; --white-lp: #ffffff;
    --blue-lp: #1a3a5c; --blue-mid: #2556a0; --blue-light-lp: #3b7dd8;
    --gold: #c8973a; --gold-light: #f0c76b;
    --border-lp: #e4e0d9; --radius-lp: 10px; --max-lp: 1120px;
    --shadow-sm-lp: 0 1px 4px rgba(0,0,0,.06);
    --shadow-md-lp: 0 4px 20px rgba(0,0,0,.09);
    --shadow-lg-lp: 0 16px 48px rgba(0,0,0,.12);
  }
  .announcement { background: var(--gold); text-align: center; padding: 10px 20px; font-size: 13px; font-weight: 600; color: var(--ink); }
  .announcement a { color: var(--ink); text-decoration: underline; }
  .lp-nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-lp); }
  .nav-inner { max-width: var(--max-lp); margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 64px; }
  .logo { font-family: 'Playfair Display', serif, Georgia, serif; font-size: 22px; font-weight: 700; color: var(--blue-lp); letter-spacing: -.3px; text-decoration: none; }
  .nav-links { display: flex; align-items: center; gap: 32px; list-style: none; padding: 0; margin: 0; }
  .nav-links a { font-size: 14px; font-weight: 500; color: var(--ink-soft); text-decoration: none; transition: color .2s; }
  .nav-links a:hover { color: var(--blue-lp); }
  .btn-nav { background: var(--blue-lp) !important; color: #fff !important; padding: 9px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; transition: background .2s !important; cursor: pointer; }
  .btn-nav:hover { background: var(--blue-mid) !important; }
  .hero { background: linear-gradient(160deg, #0d1f35 0%, #1a3a5c 55%, #2556a0 100%); padding: 100px 32px 96px; text-align: center; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(59,125,216,.18) 0%, transparent 70%); }
  .lp-container { max-width: var(--max-lp); margin: 0 auto; position: relative; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(200,151,58,.15); border: 1px solid rgba(200,151,58,.4); color: var(--gold-light); border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 28px; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold-light); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
  .hero h1 { font-family: 'Playfair Display', serif, Georgia, serif; font-size: clamp(38px, 5.5vw, 68px); font-weight: 700; color: #fff; line-height: 1.1; letter-spacing: -.02em; max-width: 840px; margin: 0 auto 24px; }
  .hero h1 em { font-style: italic; color: var(--gold-light); }
  .hero-sub { font-size: clamp(16px, 2vw, 20px); color: rgba(255,255,255,.72); max-width: 600px; margin: 0 auto 44px; line-height: 1.6; }
  .hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .btn-primary-lp { background: var(--gold); color: var(--ink); padding: 15px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; text-decoration: none; transition: transform .15s, box-shadow .15s; box-shadow: 0 4px 20px rgba(200,151,58,.4); cursor: pointer; }
  .btn-primary-lp:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(200,151,58,.5); }
  .btn-ghost { background: transparent; color: rgba(255,255,255,.85); padding: 15px 28px; border-radius: 8px; font-size: 15px; font-weight: 500; text-decoration: none; border: 1px solid rgba(255,255,255,.25); transition: border-color .2s, color .2s; }
  .btn-ghost:hover { border-color: rgba(255,255,255,.55); color: #fff; }
  .hero-stat-bar { display: flex; gap: 0; justify-content: center; flex-wrap: wrap; margin-top: 64px; border-top: 1px solid rgba(255,255,255,.1); padding-top: 40px; }
  .hero-stat { padding: 0 40px; text-align: center; border-right: 1px solid rgba(255,255,255,.12); }
  .hero-stat:last-child { border-right: none; }
  .hero-stat strong { display: block; font-size: clamp(28px, 4vw, 44px); font-weight: 800; color: var(--gold-light); line-height: 1; }
  .hero-stat span { display: block; font-size: 13px; color: rgba(255,255,255,.55); margin-top: 6px; }
  section { padding: 96px 32px; }
  .section-label { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--blue-light-lp); margin-bottom: 12px; }
  .section-title { font-family: 'Playfair Display', serif, Georgia, serif; font-size: clamp(28px, 3.5vw, 42px); font-weight: 700; color: var(--ink); line-height: 1.15; letter-spacing: -.02em; margin-bottom: 20px; }
  .section-body { font-size: 17px; color: var(--ink-muted); max-width: 600px; line-height: 1.7; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
  .problem-section { background: var(--cream-lp); }
  .problem-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-top: 0; }
  .problem-card { background: var(--white-lp); border: 1px solid var(--border-lp); border-radius: var(--radius-lp); padding: 28px; box-shadow: var(--shadow-sm-lp); }
  .step-num { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-muted); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .step-num-circle { width: 22px; height: 22px; border-radius: 50%; background: #f0ebe3; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; color: var(--ink-soft); font-weight: 700; }
  .problem-card h3 { font-size: 16px; font-weight: 600; color: var(--ink); margin-bottom: 10px; }
  .problem-card p { font-size: 14px; color: var(--ink-muted); line-height: 1.6; }
  .problem-callout { background: var(--blue-lp); border-radius: var(--radius-lp); padding: 40px 48px; margin-top: 48px; color: #fff; display: flex; gap: 40px; align-items: center; flex-wrap: wrap; }
  .problem-callout blockquote { font-family: 'Playfair Display', serif, Georgia, serif; font-style: italic; font-size: clamp(18px, 2.5vw, 24px); line-height: 1.4; flex: 1; min-width: 240px; }
  .problem-callout cite { font-size: 13px; color: rgba(255,255,255,.6); font-style: normal; display: block; margin-top: 16px; }
  .cost-box { text-align: center; flex-shrink: 0; }
  .cost-box strong { display: block; font-size: 48px; font-weight: 800; color: var(--gold-light); line-height: 1; }
  .cost-box span { font-size: 13px; color: rgba(255,255,255,.55); margin-top: 6px; display: block; }
  .workflow-steps { display: flex; flex-direction: column; gap: 0; margin-top: 56px; position: relative; }
  .workflow-steps::before { content: ''; position: absolute; left: 19px; top: 12px; bottom: 12px; width: 2px; background: linear-gradient(to bottom, var(--blue-light-lp), var(--gold)); }
  .workflow-step { display: flex; gap: 28px; align-items: flex-start; padding: 28px 28px 28px 0; position: relative; }
  .workflow-step:not(:last-child) { border-bottom: 1px solid var(--border-lp); }
  .step-icon { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; background: var(--blue-lp); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; position: relative; z-index: 1; box-shadow: 0 0 0 4px #fff; }
  .step-icon.gold { background: var(--gold); color: var(--ink); }
  .step-content { flex: 1; padding-top: 8px; }
  .step-content h3 { font-size: 17px; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
  .step-content p { font-size: 15px; color: var(--ink-muted); line-height: 1.6; }
  .step-tag { display: inline-block; margin-top: 10px; font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; }
  .step-tag.ai { background: #e8f0fb; color: var(--blue-mid); }
  .step-tag.human { background: #fef3e0; color: #8a5c00; }
  .step-tag.auto { background: #edf7ed; color: #2d7a2d; }
  .ai-section { background: #0d1f35; color: #fff; }
  .ai-section .section-title { color: #fff; }
  .ai-section .section-label { color: var(--gold-light); }
  .ai-principle-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-top: 52px; }
  .ai-principle { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: var(--radius-lp); padding: 28px; transition: background .2s; }
  .ai-principle:hover { background: rgba(255,255,255,.1); }
  .ai-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(200,151,58,.15); border: 1px solid rgba(200,151,58,.3); display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 18px; }
  .ai-principle h3 { font-size: 16px; font-weight: 600; margin-bottom: 10px; }
  .ai-principle p { font-size: 14px; color: rgba(255,255,255,.6); line-height: 1.6; }
  .ai-80-20 { padding: 40px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); border-radius: var(--radius-lp); }
  .ai-bar-wrap { min-width: 220px; }
  .ai-bar-label { display: flex; justify-content: space-between; font-size: 13px; color: rgba(255,255,255,.5); margin-bottom: 10px; }
  .ai-bar { height: 12px; border-radius: 100px; background: rgba(255,255,255,.08); overflow: hidden; }
  .ai-bar-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, var(--blue-light-lp) 0%, var(--gold) 80%); width: 80%; }
  .comp-section { background: var(--cream-lp); }
  .comp-table-wrap { overflow-x: auto; margin-top: 48px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  thead tr { background: var(--blue-lp); }
  thead th { padding: 16px 20px; text-align: left; color: rgba(255,255,255,.85); font-weight: 600; font-size: 13px; }
  thead th:first-child { border-radius: 8px 0 0 0; }
  thead th:last-child { border-radius: 0 8px 0 0; }
  tbody tr { border-bottom: 1px solid var(--border-lp); background: var(--white-lp); }
  tbody tr:nth-child(even) { background: #faf9f7; }
  td { padding: 14px 20px; color: var(--ink-soft); }
  td:first-child { font-weight: 500; color: var(--ink); }
  .check { color: #22863a; font-weight: 700; }
  .cross { color: #c0392b; }
  .cap-check { color: var(--blue-mid); font-weight: 700; }
  .moat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 28px; margin-top: 40px; }
  .moat-card { border: 1px solid var(--border-lp); border-radius: var(--radius-lp); padding: 32px; transition: box-shadow .2s, transform .15s; }
  .moat-card:hover { box-shadow: var(--shadow-md-lp); transform: translateY(-3px); }
  .moat-icon-span { font-size: 28px; margin-bottom: 16px; display: block; }
  .moat-card h3 { font-size: 18px; font-weight: 700; color: var(--ink); margin-bottom: 10px; }
  .moat-card p { font-size: 15px; color: var(--ink-muted); line-height: 1.6; }
  .moat-label { margin-top: 16px; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--blue-mid); }
  .year-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0; margin-top: 52px; border: 1px solid var(--border-lp); border-radius: var(--radius-lp); overflow: hidden; }
  .year-phase { padding: 28px 24px; border-right: 1px solid var(--border-lp); text-align: left; }
  .year-phase:last-child { border-right: none; }
  .year-phase.active { background: var(--blue-lp); color: #fff; }
  .when { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 8px; color: var(--gold); }
  .year-phase.active .when { color: var(--gold-light); }
  .year-phase h3 { font-size: 15px; font-weight: 600; margin-bottom: 10px; }
  .year-phase p { font-size: 13px; color: var(--ink-muted); line-height: 1.6; }
  .year-phase.active p { color: rgba(255,255,255,.65); }
  .testimonial-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 28px; margin-top: 56px; }
  .testimonial-card { background: var(--cream-lp); border: 1px solid var(--border-lp); border-radius: var(--radius-lp); padding: 32px; }
  .testimonial-card blockquote { font-family: 'Playfair Display', serif, Georgia, serif; font-style: italic; font-size: 18px; color: var(--ink); line-height: 1.5; margin-bottom: 20px; }
  .testimonial-card cite { font-size: 13px; color: var(--ink-muted); font-style: normal; display: flex; align-items: center; gap: 10px; }
  .cite-dot { width: 36px; height: 36px; border-radius: 50%; background: var(--blue-lp); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }
  .pricing-section { background: var(--cream-lp); }
  .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 56px; }
  .pricing-card { background: var(--white-lp); border: 1px solid var(--border-lp); border-radius: var(--radius-lp); padding: 36px; box-shadow: var(--shadow-sm-lp); text-align: left; }
  .pricing-card.featured { background: var(--blue-lp); border-color: var(--blue-lp); box-shadow: var(--shadow-lg-lp); transform: scale(1.03); }
  .plan-name { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--blue-light-lp); margin-bottom: 12px; }
  .pricing-card.featured .plan-name { color: var(--gold-light); }
  .price { font-size: 36px; font-weight: 800; color: var(--ink); margin-bottom: 4px; line-height: 1; }
  .pricing-card.featured .price { color: #fff; }
  .price-sub { font-size: 13px; color: var(--ink-muted); margin-bottom: 24px; }
  .pricing-card.featured .price-sub { color: rgba(255,255,255,.55); }
  .pricing-card ul { list-style: none; margin-bottom: 32px; padding: 0; }
  .pricing-card ul li { font-size: 14px; color: var(--ink-soft); padding: 8px 0; border-bottom: 1px solid var(--border-lp); display: flex; align-items: flex-start; gap: 10px; }
  .pricing-card.featured ul li { color: rgba(255,255,255,.8); border-color: rgba(255,255,255,.12); }
  .pricing-card ul li::before { content: '✓'; font-weight: 700; color: var(--blue-light-lp); flex-shrink: 0; }
  .pricing-card.featured ul li::before { color: var(--gold-light); }
  .btn-plan { display: block; text-align: center; padding: 14px; border-radius: 8px; font-size: 15px; font-weight: 600; text-decoration: none; transition: .2s; cursor: pointer; }
  .btn-plan.outline { border: 1.5px solid var(--blue-lp); color: var(--blue-lp); background: transparent; }
  .btn-plan.outline:hover { background: var(--blue-lp); color: #fff; }
  .btn-plan.filled { background: var(--gold); color: var(--ink); box-shadow: 0 4px 16px rgba(200,151,58,.35); }
  .btn-plan.filled:hover { background: #d9a03f; }
  .final-cta { background: linear-gradient(135deg, #0d1f35 0%, #1a3a5c 100%); text-align: center; }
  .final-cta .section-label { color: var(--gold-light); }
  .final-cta .section-title { color: #fff; margin: 0 auto 20px; max-width: 700px; }
  .final-cta .section-body { color: rgba(255,255,255,.6); margin: 0 auto 44px; }
  .lp-footer { background: var(--ink); color: rgba(255,255,255,.4); padding: 40px 32px; font-size: 13px; }
  .lp-footer a { color: rgba(255,255,255,.5); text-decoration: none; }
  .lp-footer a:hover { color: rgba(255,255,255,.8); }
  .footer-inner { max-width: var(--max-lp); margin: 0 auto; }
  .footer-top { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 32px; margin-bottom: 40px; text-align: left; }
  .footer-brand .logo { color: rgba(255,255,255,.85); font-size: 20px; }
  .footer-brand p { margin-top: 10px; font-size: 13px; color: rgba(255,255,255,.35); max-width: 260px; }
  .footer-links h4 { color: rgba(255,255,255,.6); font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 12px; }
  .footer-links ul { list-style: none; padding: 0; }
  .footer-links ul li { margin-bottom: 8px; }
  .footer-divider { border: none; border-top: 1px solid rgba(255,255,255,.08); margin-bottom: 20px; }
  @media (max-width: 768px) {
    .two-col { grid-template-columns: 1fr; gap: 40px; }
    .hero-stat { padding: 16px 24px; border-right: none; border-bottom: 1px solid rgba(255,255,255,.1); }
    .nav-links { display: none; }
  }
`;
