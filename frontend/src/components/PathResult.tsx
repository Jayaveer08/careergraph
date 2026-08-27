import { SkillGapResult } from "../api";

interface Props {
  results: SkillGapResult[] | null;
  loading: boolean;
  error: string | null;
}

export default function PathResult({ results, loading, error }: Props) {
  if (loading) {
    return (
      <div className="state-msg">
        <div className="spinner" />
        Computing skill-gap paths through the graph…
      </div>
    );
  }
  if (error) return <div className="state-msg error">⚠ {error}</div>;
  if (results === null) return null;
  if (results.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "40px 24px" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>No gaps found!</div>
        <div style={{ color: "var(--text-2)", fontSize: 14 }}>
          You already have every required skill for this role, or no connecting path exists yet.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16 }}>
          Skills to bridge
        </h3>
        <span style={{ color: "var(--muted)", fontSize: 13 }}>
          {results.length} gap{results.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {results.map((r, i) => (
        <div
          key={r.missing_skill}
          className="card"
          style={{
            borderLeft: "3px solid var(--accent)",
            animation: `dropIn 0.25s ${i * 0.07}s ease both`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{r.missing_skill}</span>
            <span className="hop-badge">{r.hops} hop{r.hops !== 1 ? "s" : ""}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
            Learning path:
          </div>
          <div className="path-chain">
            {r.path.map((node, j) => (
              <span key={j} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="path-node">{node}</span>
                {j < r.path.length - 1 && <span className="path-arrow">→</span>}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
