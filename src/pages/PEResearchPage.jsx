import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts";
import { PROGRAM_ELEMENTS, SIGNAL_COLORS, searchProgramElements, getPEById } from "../data/programData";
import Icon from "../components/dashboard/Icons";
import "../styles/Research.css";

export default function PEResearchPage() {
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [signalFilter, setSignalFilter] = useState("All");
  const [selectedPE, setSelectedPE] = useState(null);

  const services = ["All", ...new Set(PROGRAM_ELEMENTS.map(p => p.service))];
  const signals = ["All", ...new Set(PROGRAM_ELEMENTS.map(p => p.signal))];

  const filtered = useMemo(() => {
    let results = searchProgramElements(query);
    if (serviceFilter !== "All") results = results.filter(p => p.service === serviceFilter);
    if (signalFilter !== "All") results = results.filter(p => p.signal === signalFilter);
    return results;
  }, [query, serviceFilter, signalFilter]);

  if (selectedPE) {
    return <PEDetailView pe={selectedPE} onBack={() => setSelectedPE(null)} />;
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: "var(--sp-4)" }}>
        <div>
          <h1 className="page-header__title">PE Research — Program Offices</h1>
          <p className="page-header__subtitle">
            Program Element lookup, budget analysis, and program manager coordination
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="research-search" style={{ marginBottom: "var(--sp-4)" }}>
        <Icon name="search" size={18} color="var(--text-3)" />
        <input
          type="text"
          placeholder="Search by PE number, program name, keyword, or service branch..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: "var(--sp-3)", marginBottom: "var(--sp-4)", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "var(--text-2)" }}>Service:</span>
          <div className="rs-chip-group">
            {services.map(s => (
              <button
                key={s} className={`rs-chip ${serviceFilter === s ? "rs-chip--active" : ""}`}
                onClick={() => setServiceFilter(s)}
              >{s}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "var(--text-2)" }}>Signal:</span>
          <div className="rs-chip-group">
            {signals.map(s => {
              const sc = SIGNAL_COLORS[s];
              return (
                <button
                  key={s} className={`rs-chip ${signalFilter === s ? "rs-chip--active" : ""}`}
                  onClick={() => setSignalFilter(s)}
                  style={signalFilter === s && sc ? { background: sc.bg, color: sc.text, borderColor: sc.text } : {}}
                >{s === "All" ? "All" : sc?.label || s}</button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 13, color: "var(--signal-blue)", fontWeight: 500, marginBottom: "var(--sp-4)" }}>
        {filtered.length} program element{filtered.length !== 1 ? "s" : ""} found
      </div>

      {/* PE Cards Grid */}
      <div className="pe-grid">
        {filtered.map(pe => (
          <PECard key={pe.id} pe={pe} onClick={() => setSelectedPE(pe)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-3)" }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>No program elements found</p>
          <p style={{ fontSize: 13 }}>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

/* ── PE Card ── */
function PECard({ pe, onClick }) {
  const signal = SIGNAL_COLORS[pe.signal] || { bg: "#F3F4F6", text: "#6B7280", label: pe.signal };
  const latestEnacted = pe.budgetHistory.filter(b => b.enacted !== null).slice(-1)[0];

  return (
    <div className="pe-card" onClick={onClick}>
      <div className="pe-card__header">
        <div className="pe-card__number">{pe.peNumber}</div>
        <div className="pe-card__service">{pe.service}</div>
      </div>
      <div className="pe-card__name">{pe.name}</div>
      <div className="pe-card__desc">{pe.description}</div>
      <div className="pe-card__signal" style={{ background: signal.bg, color: signal.text }}>
        {signal.label}
      </div>

      {/* Budget snapshot — last 3 years */}
      {pe.budgetHistory.slice(0, 3).map((b, i) => (
        <div key={i} className="pe-card__budget-row">
          <span className="pe-card__budget-fy">{b.fy}</span>
          <span className="pe-card__budget-val">${b.requested.toFixed(1)}M req</span>
          <span className="pe-card__budget-val">{b.enacted !== null ? `$${b.enacted.toFixed(1)}M enacted` : "—"}</span>
          {b.delta !== null ? (
            <span className={`pe-card__budget-delta ${b.delta >= 0 ? "pe-card__budget-delta--positive" : "pe-card__budget-delta--negative"}`}>
              {b.delta >= 0 ? "+" : ""}{b.delta.toFixed(1)}M
            </span>
          ) : <span className="pe-card__budget-delta" style={{ color: "var(--text-3)" }}>TBD</span>}
        </div>
      ))}

      <div className="pe-card__pm">
        <strong>PM:</strong> {pe.programManager.name} — {pe.programManager.office}
      </div>
    </div>
  );
}

/* ── PE Detail View ── */
function PEDetailView({ pe, onBack }) {
  const signal = SIGNAL_COLORS[pe.signal] || { bg: "#F3F4F6", text: "#6B7280", label: pe.signal };

  const chartData = pe.budgetHistory.map(b => ({
    fy: b.fy,
    requested: b.requested,
    enacted: b.enacted,
  }));

  return (
    <div style={{ maxWidth: 1000 }}>
      <button className="back-btn" onClick={onBack}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6"/></svg>
        Back to PE directory
      </button>

      {/* Hero */}
      <div style={{
        background: "var(--capiro-blue)", borderRadius: "var(--radius-lg)",
        padding: "var(--sp-6)", color: "#fff", marginBottom: "var(--sp-6)",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--sp-3)" }}>
          <div>
            <span style={{
              fontSize: 12, fontFamily: "var(--font-mono)", background: "rgba(255,255,255,0.15)",
              padding: "3px 10px", borderRadius: "var(--radius-sm)", marginBottom: 8, display: "inline-block",
            }}>{pe.peNumber}</span>
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: "8px 0 4px", letterSpacing: "-0.02em" }}>{pe.name}</h2>
            <p style={{ fontSize: 13, opacity: 0.75 }}>{pe.service} | {pe.account}</p>
          </div>
          <div style={{
            background: signal.bg, color: signal.text, padding: "6px 14px",
            borderRadius: "var(--radius-full)", fontSize: 12, fontWeight: 600,
          }}>{signal.label}</div>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.85 }}>{pe.description}</p>
      </div>

      {/* Budget Signal */}
      <div className="info-section">
        <div style={{
          background: signal.bg, border: `1px solid ${signal.text}20`,
          borderRadius: "var(--radius-lg)", padding: "var(--sp-4) var(--sp-5)", marginBottom: "var(--sp-4)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: signal.text, marginBottom: 4 }}>
            Budget Signal: {signal.label}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, margin: 0 }}>{pe.signalLabel}</p>
        </div>
      </div>

      {/* Budget History Chart */}
      <div className="info-section">
        <div className="info-section__title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          Budget History — Requested vs. Enacted ($M)
        </div>
        <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", padding: "var(--sp-4)" }}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 10 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="fy" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} tickFormatter={v => `$${v}M`} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid var(--border)" }} formatter={(val) => val !== null ? [`$${val.toFixed(1)}M`] : ["—"]} />
              <Bar dataKey="requested" name="Requested" fill="rgba(58,111,247,0.5)" radius={[4,4,0,0]} barSize={28} />
              <Bar dataKey="enacted" name="Enacted" radius={[4,4,0,0]} barSize={28}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.enacted !== null ? "#059669" : "rgba(156,163,175,0.2)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <div className="chart-legend__item">
              <div className="chart-legend__dot" style={{ background: "rgba(58,111,247,0.5)" }} />
              Requested
            </div>
            <div className="chart-legend__item">
              <div className="chart-legend__dot" style={{ background: "#059669" }} />
              Enacted
            </div>
          </div>
        </div>
      </div>

      {/* Budget Table */}
      <div className="info-section">
        <div className="info-section__title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          Detailed Budget Data
        </div>
        <div style={{
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg-soft)" }}>
                {["Fiscal Year", "Requested ($M)", "Enacted ($M)", "Delta ($M)", "Signal"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pe.budgetHistory.map((b, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 16px", fontWeight: 600 }}>{b.fy}</td>
                  <td style={{ padding: "10px 16px" }}>${b.requested.toFixed(1)}</td>
                  <td style={{ padding: "10px 16px" }}>{b.enacted !== null ? `$${b.enacted.toFixed(1)}` : "—"}</td>
                  <td style={{ padding: "10px 16px", fontWeight: 600, color: b.delta === null ? "var(--text-3)" : b.delta >= 0 ? "var(--success)" : "var(--danger)" }}>
                    {b.delta !== null ? `${b.delta >= 0 ? "+" : ""}$${b.delta.toFixed(1)}` : "TBD"}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    {b.delta !== null ? (
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: "var(--radius-full)",
                        background: b.delta >= 20 ? "#ECFDF5" : b.delta >= 0 ? "#EFF6FF" : "#FEF2F2",
                        color: b.delta >= 20 ? "#059669" : b.delta >= 0 ? "#2563EB" : "#DC2626",
                      }}>
                        {b.delta >= 20 ? "Strong Plus-Up" : b.delta >= 0 ? "Plus-Up" : "Below Request"}
                      </span>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Program Manager + Committees grid */}
      <div className="info-grid" style={{ marginBottom: "var(--sp-6)" }}>
        <div className="info-section">
          <div className="info-section__title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            Program Manager
          </div>
          <div className="staff-card">
            <div className="staff-card__avatar">
              {pe.programManager.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="staff-card__info">
              <div className="staff-card__name">{pe.programManager.name}</div>
              <div className="staff-card__role">{pe.programManager.office}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>
                Last contact: {pe.programManager.lastContact}
              </div>
            </div>
          </div>
          <button style={{
            marginTop: "var(--sp-2)", padding: "7px 16px", borderRadius: "var(--radius-md)",
            background: "var(--signal-blue)", color: "#fff", border: "none", fontSize: 12,
            fontWeight: 500, fontFamily: "var(--font-system)", cursor: "pointer", width: "100%",
          }}>
            Schedule PM Coordination Call
          </button>
        </div>

        <div className="info-section">
          <div className="info-section__title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
            Oversight Committees
          </div>
          {pe.committees.map((c, i) => (
            <div key={i} style={{
              padding: "8px 12px", marginBottom: 4, background: "var(--bg-soft)",
              borderRadius: "var(--radius-md)", fontSize: 12, color: "var(--text)",
            }}>
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* Appropriation & Classification */}
      <div className="info-grid" style={{ marginBottom: "var(--sp-6)" }}>
        <div className="info-card">
          <div className="info-card__label">Appropriation Account</div>
          <div className="info-card__value">{pe.appropriation}</div>
        </div>
        <div className="info-card">
          <div className="info-card__label">Classification</div>
          <div className="info-card__value">{pe.classification}</div>
        </div>
      </div>

      {/* Related PEs */}
      <div className="info-section">
        <div className="info-section__title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><polyline points="16,3 21,3 21,8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21,16 21,21 16,21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
          Related Program Elements
        </div>
        <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
          {pe.relatedPEs.map(rpe => (
            <span key={rpe} style={{
              padding: "4px 12px", borderRadius: "var(--radius-full)",
              background: "var(--signal-soft)", color: "var(--signal-blue)",
              fontSize: 12, fontWeight: 500, fontFamily: "var(--font-mono)",
            }}>
              {rpe.replace("pe_", "")}
            </span>
          ))}
        </div>
      </div>

      {/* Capiro Analysis */}
      <div className="info-section">
        <div style={{
          background: "linear-gradient(135deg, #fff 0%, rgba(232,239,255,0.3) 100%)",
          border: "1px solid rgba(58,111,247,0.15)",
          borderRadius: "var(--radius-lg)", padding: "var(--sp-5)",
        }}>
          <div className="info-section__title" style={{ marginBottom: "var(--sp-3)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--signal-blue)" strokeWidth="2"><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/></svg>
            Capiro Budget Analysis
          </div>
          <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, margin: "0 0 var(--sp-3)" }}>
            <strong style={{ color: "var(--text)" }}>{pe.peNumber} — {pe.name}</strong> shows a{" "}
            <strong style={{ color: signal.text }}>{signal.label.toLowerCase()}</strong> funding trajectory.
            {pe.signal === "strong_growth" || pe.signal === "top_priority" ? (
              <> Congressional plus-ups have been <strong>consistent and growing</strong> over the past 3 fiscal years, indicating strong bipartisan support. This program element is an <strong style={{ color: "var(--success)" }}>excellent candidate for a plus-up request</strong> in FY2027.</>
            ) : pe.signal === "healthy_growth" ? (
              <> Moderate but steady above-request enactments suggest reliable support. A <strong>targeted plus-up request</strong> with strong justification has a reasonable chance of success.</>
            ) : pe.signal === "declining" ? (
              <> Recent below-request marks and declining baseline suggest potential program restructuring. <strong style={{ color: "var(--danger)" }}>Caution is advised</strong> — additional justification and stakeholder alignment recommended before pursuing a plus-up.</>
            ) : (
              <> Mixed signals in recent fiscal years require careful analysis. A targeted approach with specific technical justification is recommended.</>
            )}
          </p>
          <div style={{ display: "flex", gap: "var(--sp-2)" }}>
            <button style={{
              padding: "7px 16px", borderRadius: "var(--radius-md)", background: "var(--signal-blue)",
              color: "#fff", border: "none", fontSize: 12, fontWeight: 500, fontFamily: "var(--font-system)", cursor: "pointer",
            }}>
              Generate Full PE Brief
            </button>
            <button style={{
              padding: "7px 16px", borderRadius: "var(--radius-md)", background: "transparent",
              color: "var(--signal-blue)", border: "1px solid rgba(58,111,247,0.3)", fontSize: 12,
              fontWeight: 500, fontFamily: "var(--font-system)", cursor: "pointer",
            }}>
              Link to Client Engagement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
