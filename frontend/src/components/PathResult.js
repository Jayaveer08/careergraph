import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function PathResult({ results, loading, error }) {
    if (loading) {
        return (_jsxs("div", { className: "state-msg", children: [_jsx("div", { className: "spinner" }), "Computing skill-gap paths through the graph\u2026"] }));
    }
    if (error)
        return _jsxs("div", { className: "state-msg error", children: ["\u26A0 ", error] });
    if (results === null)
        return null;
    if (results.length === 0) {
        return (_jsxs("div", { className: "card", style: { textAlign: "center", padding: "40px 24px" }, children: [_jsx("div", { style: { fontSize: 36, marginBottom: 12 }, children: "\uD83C\uDF89" }), _jsx("div", { style: { fontWeight: 600, marginBottom: 6 }, children: "No gaps found!" }), _jsx("div", { style: { color: "var(--text-2)", fontSize: 14 }, children: "You already have every required skill for this role, or no connecting path exists yet." })] }));
    }
    return (_jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [_jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }, children: [_jsx("h3", { style: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 16 }, children: "Skills to bridge" }), _jsxs("span", { style: { color: "var(--muted)", fontSize: 13 }, children: [results.length, " gap", results.length !== 1 ? "s" : "", " found"] })] }), results.map((r, i) => (_jsxs("div", { className: "card", style: {
                    borderLeft: "3px solid var(--accent)",
                    animation: `dropIn 0.25s ${i * 0.07}s ease both`,
                }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }, children: [_jsx("span", { style: { fontWeight: 600, fontSize: 15 }, children: r.missing_skill }), _jsxs("span", { className: "hop-badge", children: [r.hops, " hop", r.hops !== 1 ? "s" : ""] })] }), _jsx("div", { style: { fontSize: 12, color: "var(--muted)", marginBottom: 8 }, children: "Learning path:" }), _jsx("div", { className: "path-chain", children: r.path.map((node, j) => (_jsxs("span", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [_jsx("span", { className: "path-node", children: node }), j < r.path.length - 1 && _jsx("span", { className: "path-arrow", children: "\u2192" })] }, j))) })] }, r.missing_skill)))] }));
}
