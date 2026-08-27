import { useEffect, useState } from "react";
import { api, Company, CompanyDetail } from "../api";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<CompanyDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    api
      .listCompanies()
      .then(setCompanies)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const openDetail = async (companyId: string) => {
    setSelected(companyId);
    setDetailLoading(true);
    setDetail(null);
    try {
      const d = await api.companyDetail(companyId);
      setDetail(d);
    } catch { /* noop */ }
    finally { setDetailLoading(false); }
  };

  const close = () => { setSelected(null); setDetail(null); };

  // Group by industry
  const byIndustry: Record<string, Company[]> = {};
  companies.forEach((c) => {
    (byIndustry[c.industry] ??= []).push(c);
  });

  const INDUSTRY_ICONS: Record<string, string> = {
    "AI/Agents": "🤖",
    "AI Research": "🔬",
    "Cloud Infra": "☁️",
    "Fintech": "💳",
    "Consumer Product": "📱",
  };

  return (
    <div className="page-container" style={{ paddingTop: 48 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 className="page-title">
          Explore <span className="gradient-text">Companies</span>
        </h1>
        <p className="page-subtitle">
          Discover which companies compete for the same talent pool — powered by
          skill-overlap traversal in the graph.
        </p>
      </div>

      {loading && <div className="state-msg"><div className="spinner" />Loading companies…</div>}
      {error && <div className="state-msg error">⚠ {error}</div>}

      {/* Grouped by industry */}
      {Object.entries(byIndustry).map(([industry, cos]) => (
        <div key={industry} style={{ marginBottom: 40 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
          }}>
            <span style={{ fontSize: 22 }}>{INDUSTRY_ICONS[industry] ?? "🏢"}</span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600 }}>
              {industry}
            </h2>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>
              {cos.length} compan{cos.length === 1 ? "y" : "ies"}
            </span>
          </div>

          <div className="grid-2">
            {cos.map((c, i) => (
              <div
                key={c.id}
                className="card card-interactive"
                onClick={() => openDetail(c.id)}
                style={{ animation: `dropIn 0.2s ${i * 0.07}s ease both` }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, border: "1px solid var(--border)",
                  }}>
                    {INDUSTRY_ICONS[c.industry] ?? "🏢"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>{c.industry}</div>
                  </div>
                </div>
                <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>
                  View roles &amp; competitors →
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Side panel */}
      {selected && (
        <>
          <div className="overlay" onClick={close} />
          <div className="side-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20 }}>Company Profile</h2>
              <button
                onClick={close}
                style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  color: "var(--text-2)", borderRadius: "var(--radius-sm)",
                  cursor: "pointer", padding: "6px 14px", fontSize: 13,
                }}
              >
                ✕ Close
              </button>
            </div>

            {detailLoading && <div className="state-msg"><div className="spinner" />Loading…</div>}

            {detail && (
              <>
                <div style={{ marginBottom: 4 }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24 }}>{detail.name}</h3>
                  <div style={{ color: "var(--text-2)", fontSize: 14, marginTop: 4 }}>
                    {INDUSTRY_ICONS[detail.industry] ?? "🏢"} {detail.industry}
                  </div>
                </div>

                {/* Top skills */}
                {detail.top_skills.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <span className="field-label">Skills used across roles</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {detail.top_skills.slice(0, 15).map((s) => (
                        <span
                          key={s}
                          style={{
                            padding: "4px 10px", borderRadius: 99, fontSize: 12,
                            background: "rgba(255,255,255,0.06)", color: "var(--text-2)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hiring roles */}
                {detail.job_roles.filter(r => r.id).length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <span className="field-label">Open Roles</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[...new Map(detail.job_roles.filter(r => r.id).map(r => [r.id, r])).values()].map((r) => (
                        <div
                          key={r.id}
                          style={{
                            padding: "10px 14px",
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: "var(--radius)",
                            border: "1px solid var(--border)",
                            fontSize: 14,
                          }}
                        >
                          {r.title}
                          <span className={`badge-${r.level}`} style={{ marginLeft: 10 }}>
                            {r.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Competitors */}
                {detail.competitors.length > 0 && (
                  <div style={{ marginTop: 28 }}>
                    <span className="field-label">Talent-market competitors</span>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
                      Companies competing for the same skill pools:
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {detail.competitors.map((c) => (
                        <div
                          key={c.id}
                          style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "10px 14px",
                            background: "rgba(168,85,247,0.06)",
                            borderRadius: "var(--radius)",
                            border: "1px solid rgba(168,85,247,0.18)",
                            fontSize: 14,
                          }}
                        >
                          <span>{c.name}</span>
                          <span style={{ color: "var(--muted)", fontSize: 12 }}>
                            {c.shared_skills} shared skills
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
