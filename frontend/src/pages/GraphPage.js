import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GraphCanvas from "../components/GraphCanvas";
export default function GraphPage() {
    return (_jsxs("div", { className: "page-container", style: { paddingTop: 48 }, children: [_jsxs("div", { style: { marginBottom: 32 }, children: [_jsxs("h1", { className: "page-title", children: ["Skills ", _jsx("span", { className: "gradient-text", children: "Graph" })] }), _jsx("p", { className: "page-subtitle", children: "An interactive map of how skills relate to each other. Click any node to discover what to learn next." })] }), _jsx("div", { style: {
                    display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20,
                }, children: [
                    { label: "Language", color: "#2563eb" },
                    { label: "Frontend", color: "#7c3aed" },
                    { label: "Backend", color: "#0e7490" },
                    { label: "DevOps", color: "#c2410c" },
                    { label: "Cloud", color: "#b45309" },
                    { label: "Data", color: "#065f46" },
                    { label: "AI", color: "#6d28d9" },
                    { label: "Concept", color: "#475569" },
                    { label: "Tooling", color: "#be185d" },
                ].map(({ label, color }) => (_jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-2)" }, children: [_jsx("span", { style: {
                                width: 10, height: 10, borderRadius: "50%",
                                background: color, flexShrink: 0,
                            } }), label] }, label))) }), _jsx(GraphCanvas, {})] }));
}
