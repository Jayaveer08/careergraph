import { useCallback, useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { api, GraphData } from "../api";
import RecommendPanel from "./RecommendPanel";

const CATEGORY_COLORS: Record<string, string> = {
  language:  "#4f46e5",
  frontend:  "#7c3aed",
  backend:   "#0891b2",
  devops:    "#ea580c",
  cloud:     "#d97706",
  data:      "#059669",
  ai:        "#9333ea",
  concept:   "#64748b",
  tooling:   "#db2777",
};

export default function GraphCanvas() {
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ id: string; name: string; category: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 600 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      setDims({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    api
      .getGraph()
      .then(setGraph)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    setSelected({ id: node.id, name: node.name, category: node.category });
  }, []);

  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name as string;
    const fontSize = Math.max(10 / globalScale, 3);
    const r = 6;
    const color = CATEGORY_COLORS[node.category as string] ?? "#2563eb";
    const isSelected = selected?.id === node.id;

    // Selection ring
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 5, 0, 2 * Math.PI);
      ctx.fillStyle = color + "22";
      ctx.fill();
    }

    // Node fill
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = isSelected ? "#0f172a" : "#ffffff";
    ctx.lineWidth = isSelected ? 2 : 1.5;
    ctx.stroke();

    // Label
    if (globalScale > 0.6) {
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = "#334155";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(label, node.x, node.y + r + 2);
    }
  }, [selected]);

  if (loading) {
    return (
      <div className="graph-container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="state-msg"><div className="spinner" />Loading skill graph…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="graph-container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="state-msg error">⚠ {error}</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      {/* Graph */}
      <div className="graph-container" ref={containerRef} style={{ flex: 1 }}>
        {graph && (
          <ForceGraph2D
            width={dims.w}
            height={dims.h}
            graphData={graph}
            nodeId="id"
            linkSource="source"
            linkTarget="target"
            backgroundColor="#f8fafc"
            linkColor={() => "#cbd5e1"}
            linkWidth={1.2}
            nodeCanvasObject={nodeCanvasObject}
            nodeCanvasObjectMode={() => "replace"}
            onNodeClick={handleNodeClick}
            cooldownTicks={120}
          />
        )}
      </div>

      {/* Sidebar for selected node */}
      {selected && (
        <div className="card-glass" style={{ width: 280, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17 }}>
                {selected.name}
              </div>
              <span className={`chip cat-${selected.category}`} style={{ marginTop: 6 }}>
                {selected.category}
              </span>
            </div>
            <button
              onClick={() => setSelected(null)}
              style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                color: "var(--text-2)", borderRadius: "var(--radius-sm)",
                cursor: "pointer", padding: "4px 10px", fontSize: 13,
              }}
            >
              ✕
            </button>
          </div>
          <hr className="divider" />
          <RecommendPanel skillId={selected.id} skillName={selected.name} />
        </div>
      )}
    </div>
  );
}
