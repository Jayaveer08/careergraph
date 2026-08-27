import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { api } from "../api";
import RecommendPanel from "./RecommendPanel";
const CATEGORY_COLORS = {
    language: "#4f46e5",
    frontend: "#7c3aed",
    backend: "#0891b2",
    devops: "#ea580c",
    cloud: "#d97706",
    data: "#059669",
    ai: "#9333ea",
    concept: "#64748b",
    tooling: "#db2777",
};
export default function GraphCanvas() {
    const [graph, setGraph] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(null);
    const containerRef = useRef(null);
    const [dims, setDims] = useState({ w: 800, h: 600 });
    useEffect(() => {
        if (!containerRef.current)
            return;
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
    const handleNodeClick = useCallback((node) => {
        setSelected({ id: node.id, name: node.name, category: node.category });
    }, []);
    const nodeCanvasObject = useCallback((node, ctx, globalScale) => {
        const label = node.name;
        const fontSize = Math.max(10 / globalScale, 3);
        const r = 6;
        const color = CATEGORY_COLORS[node.category] ?? "#2563eb";
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
        return (_jsx("div", { className: "graph-container", style: { display: "flex", alignItems: "center", justifyContent: "center" }, children: _jsxs("div", { className: "state-msg", children: [_jsx("div", { className: "spinner" }), "Loading skill graph\u2026"] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "graph-container", style: { display: "flex", alignItems: "center", justifyContent: "center" }, children: _jsxs("div", { className: "state-msg error", children: ["\u26A0 ", error] }) }));
    }
    return (_jsxs("div", { style: { display: "flex", gap: 20, alignItems: "flex-start" }, children: [_jsx("div", { className: "graph-container", ref: containerRef, style: { flex: 1 }, children: graph && (_jsx(ForceGraph2D, { width: dims.w, height: dims.h, graphData: graph, nodeId: "id", linkSource: "source", linkTarget: "target", backgroundColor: "#f8fafc", linkColor: () => "#cbd5e1", linkWidth: 1.2, nodeCanvasObject: nodeCanvasObject, nodeCanvasObjectMode: () => "replace", onNodeClick: handleNodeClick, cooldownTicks: 120 })) }), selected && (_jsxs("div", { className: "card-glass", style: { width: 280, flexShrink: 0 }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17 }, children: selected.name }), _jsx("span", { className: `chip cat-${selected.category}`, style: { marginTop: 6 }, children: selected.category })] }), _jsx("button", { onClick: () => setSelected(null), style: {
                                    background: "var(--surface)", border: "1px solid var(--border)",
                                    color: "var(--text-2)", borderRadius: "var(--radius-sm)",
                                    cursor: "pointer", padding: "4px 10px", fontSize: 13,
                                }, children: "\u2715" })] }), _jsx("hr", { className: "divider" }), _jsx(RecommendPanel, { skillId: selected.id, skillName: selected.name })] }))] }));
}
