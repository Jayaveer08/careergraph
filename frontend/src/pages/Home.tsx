import { useState } from "react";
import SkillSearch from "../components/SkillSearch";
import JobPicker from "../components/JobPicker";
import PathResult from "../components/PathResult";
import { api, Resource, Skill, SkillGapResult } from "../api";

export default function SkillGapPage() {
  const [knownSkills, setKnownSkills] = useState<Skill[]>([]);
  const [targetJob, setTargetJob] = useState("");
  const [results, setResults] = useState<SkillGapResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);

  const canSubmit = knownSkills.length > 0 && targetJob !== "";

  const findPath = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setResources([]);
    try {
      const data = await api.skillGapPath(knownSkills.map((s) => s.id), targetJob);
      setResults(data);
      // Fetch resources for missing skills
      if (data.length > 0) {
        const missingIds = data.map((r) => r.missing_skill.toLowerCase().replace(/\s+/g, "-"));
        try {
          const res = await api.getResources(missingIds);
          setResources(res);
        } catch { /* non-fatal */ }
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ paddingTop: 48 }}>
      {/* Hero */}
      <div style={{ marginBottom: 48 }}>
        <h1 className="page-title">
          Find your{" "}
          <span className="gradient-text">skill gap</span>
        </h1>
        <p className="page-subtitle">
          Tell us what you know and where you want to go. CareerGraph traces the
          shortest path through the skills graph to get you there.
        </p>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Step 1 */}
        <div className="card">
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
          }}>
            <span style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "#2563eb",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
            }}>1</span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600 }}>
              Add skills you already know
            </h2>
          </div>
          <SkillSearch selected={knownSkills} onChange={setKnownSkills} />
        </div>

        {/* Step 2 */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "#3b82f6",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
            }}>2</span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600 }}>
              Pick your target role
            </h2>
          </div>
          <JobPicker value={targetJob} onChange={setTargetJob} />
        </div>

        {/* CTA */}
        <button
          className="btn btn-primary"
          disabled={!canSubmit || loading}
          onClick={findPath}
          style={{ width: "100%", padding: "16px", fontSize: 16 }}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ width: 18, height: 18, borderTopColor: "#fff" }} />
              Traversing graph…
            </>
          ) : (
            "Find my skill gap"
          )}
        </button>

        {/* Results */}
        {(results !== null || loading || error) && (
          <div>
            <PathResult results={results} loading={loading} error={error} />
          </div>
        )}

        {/* Learning resources */}
        {resources.length > 0 && (
          <div className="card" style={{ borderColor: "rgba(168,85,247,0.3)" }}>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 16,
            }}>
              📚 Recommended learning resources
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {resources.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    textDecoration: "none",
                    color: "var(--text)",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(99,102,241,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{r.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 3 }}>
                      Teaches: {r.teaches.join(", ")}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11, padding: "3px 8px", borderRadius: 99,
                      background: "rgba(99,102,241,0.15)", color: "var(--accent-2)",
                      flexShrink: 0, marginLeft: 12,
                    }}
                  >
                    {r.type}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
