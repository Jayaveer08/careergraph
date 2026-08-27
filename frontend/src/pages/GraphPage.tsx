import GraphCanvas from "../components/GraphCanvas";

export default function GraphPage() {
  return (
    <div className="page-container" style={{ paddingTop: 48 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">
          Skills <span className="gradient-text">Graph</span>
        </h1>
        <p className="page-subtitle">
          An interactive map of how skills relate to each other. Click any node
          to discover what to learn next.
        </p>
      </div>

      {/* Legend */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20,
      }}>
        {[
          { label: "Language", color: "#2563eb" },
          { label: "Frontend",  color: "#7c3aed" },
          { label: "Backend",   color: "#0e7490" },
          { label: "DevOps",    color: "#c2410c" },
          { label: "Cloud",     color: "#b45309" },
          { label: "Data",      color: "#065f46" },
          { label: "AI",        color: "#6d28d9" },
          { label: "Concept",   color: "#475569" },
          { label: "Tooling",   color: "#be185d" },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-2)" }}>
            <span style={{
              width: 10, height: 10, borderRadius: "50%",
              background: color, flexShrink: 0,
            }} />
            {label}
          </div>
        ))}
      </div>

      <GraphCanvas />
    </div>
  );
}
