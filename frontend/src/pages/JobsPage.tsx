import { useEffect, useState } from "react";
import { api, JobDetail, JobRole, Resource } from "../api";

const LEVEL_LABEL: Record<string, string> = { entry: "Entry", mid: "Mid", senior: "Senior" };

const TYPE_ICON: Record<string, string> = {
  course: "🎓",
  video: "🎬",
  book: "📖",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<JobDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    api
      .listJobs()
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const openDetail = async (jobId: string) => {
    setSelected(jobId);
    setDetailLoading(true);
    setDetail(null);
    setResources([]);
    try {
      const d = await api.jobDetail(jobId);
      setDetail(d);
      // Fetch learning resources for the required skills
      const skillIds = d.required_skills.map((s) => s.id).filter(Boolean);
      if (skillIds.length > 0) {
        const res = await api.getResources(skillIds);
        setResources(res);
      }
    } catch { /* noop */ }
    finally { setDetailLoading(false); }
  };

  const close = () => { setSelected(null); setDetail(null); setResources([]); };

  return (
    <div className="page-container" style={{ paddingTop: 48 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 className="page-title">
          Browse <span className="gradient-text">Job Roles</span>
        </h1>
        <p className="page-subtitle">
          Explore all roles in the graph. Click any card to see required skills,
          hiring companies, and learning resources.
        </p>
      </div>

      {loading && <div className="state-msg"><div className="spinner" />Loading jobs…</div>}
      {error && <div className="state-msg error">⚠ {error}</div>}
      {!loading && !error && jobs.length === 0 && (
        <div className="state-msg">No job roles yet — run the seed script.</div>
      )}

      <div className="grid-2">
        {jobs.map((j, i) => (
          <div
            key={j.id}
            className="card card-interactive"
            onClick={() => openDetail(j.id)}
            style={{ animation: `dropIn 0.2s ${i * 0.06}s ease both` }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600,
                lineHeight: 1.3, flex: 1, paddingRight: 12,
              }}>
                {j.title}
              </h3>
              <span className={`badge-${j.level}`}>{LEVEL_LABEL[j.level] ?? j.level}</span>
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              Click to view skills &amp; learning resources →
            </div>
          </div>
        ))}
      </div>

      {/* ─── Side Panel ─── */}
      {selected && (
        <>
          <div className="overlay" onClick={close} />
          <div className="side-panel">
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20 }}>Role Detail</h2>
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

            {detailLoading && (
              <div className="state-msg"><div className="spinner" />Loading details…</div>
            )}

            {detail && (
              <>
                {/* Title + level */}
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, lineHeight: 1.25, marginBottom: 10 }}>
                  {detail.title}
                </h3>
                <span className={`badge-${detail.level}`} style={{ display: "inline-block", marginBottom: 28 }}>
                  {LEVEL_LABEL[detail.level] ?? detail.level}
                </span>

                <hr className="divider" />

                {/* ── Required Skills ── */}
                <div style={{ marginTop: 4, marginBottom: 28 }}>
                  <span className="field-label">Required Skills</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {detail.required_skills
                      .sort((a, b) => b.weight - a.weight)
                      .map((s) => {
                        const badge =
                          s.weight >= 0.85
                            ? { label: "Core Skill", color: "#4f46e5", bg: "#eef2ff", border: "#c7d2fe" }
                            : s.weight >= 0.7
                            ? { label: "Essential", color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" }
                            : s.weight >= 0.55
                            ? { label: "Important", color: "#d97706", bg: "#fffbeb", border: "#fef3c7" }
                            : { label: "Secondary", color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" };

                        return (
                          <div key={s.name}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, marginBottom: 6 }}>
                              <span style={{ fontWeight: 500, color: "var(--text)" }}>{s.name}</span>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 600,
                                  padding: "2px 8px",
                                  borderRadius: 99,
                                  background: badge.bg,
                                  color: badge.color,
                                  border: `1px solid ${badge.border}`,
                                }}
                              >
                                {badge.label}
                              </span>
                            </div>
                            <div className="weight-bar-track">
                              <div className="weight-bar-fill" style={{ width: `${s.weight * 100}%` }} />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* ── Hiring Companies ── */}
                {detail.companies.filter(Boolean).length > 0 && (
                  <>
                    <hr className="divider" />
                    <div style={{ marginBottom: 28 }}>
                      <span className="field-label">Companies Hiring for This Role</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {detail.companies.filter(Boolean).map((c) => (
                          <span
                            key={c}
                            style={{
                              padding: "6px 14px", borderRadius: 99, fontSize: 13,
                              background: "rgba(99,102,241,0.12)", color: "var(--accent-2)",
                              border: "1px solid rgba(99,102,241,0.25)", fontWeight: 500,
                            }}
                          >
                            🏢 {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ── Learning Resources ── */}
                <hr className="divider" />
                <div>
                  <span className="field-label">Learning Resources</span>

                  {resources.length === 0 ? (
                    <div className="state-msg" style={{ paddingTop: 10 }}>
                      No specific resources found for this role's skills yet.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {resources.map((r) => (
                        <a
                          key={r.id}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "block",
                            padding: "14px 16px",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius)",
                            textDecoration: "none",
                            color: "var(--text)",
                            transition: "border-color 0.15s, background 0.15s, transform 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLAnchorElement;
                            el.style.borderColor = "rgba(99,102,241,0.45)";
                            el.style.background = "rgba(99,102,241,0.06)";
                            el.style.transform = "translateX(3px)";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLAnchorElement;
                            el.style.borderColor = "var(--border)";
                            el.style.background = "rgba(255,255,255,0.03)";
                            el.style.transform = "translateX(0)";
                          }}
                        >
                          {/* Row 1: icon + name + type */}
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <span style={{ fontSize: 22, flexShrink: 0 }}>
                              {TYPE_ICON[r.type] ?? "📄"}
                            </span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{r.name}</div>
                              <span
                                style={{
                                  fontSize: 11, padding: "2px 8px", borderRadius: 99, marginTop: 4,
                                  display: "inline-block",
                                  background: "rgba(168,85,247,0.15)", color: "#d8b4fe",
                                  border: "1px solid rgba(168,85,247,0.25)",
                                  textTransform: "capitalize",
                                }}
                              >
                                {r.type}
                              </span>
                            </div>
                            <span style={{ color: "var(--accent-2)", fontSize: 16, flexShrink: 0 }}>↗</span>
                          </div>
                          {/* Row 2: teaches */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {r.teaches.map((skill) => (
                              <span
                                key={skill}
                                style={{
                                  fontSize: 11, padding: "2px 8px", borderRadius: 99,
                                  background: "rgba(6,182,212,0.1)", color: "#67e8f9",
                                  border: "1px solid rgba(6,182,212,0.2)",
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
