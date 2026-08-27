import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import SkillSearch from "../components/SkillSearch";
import JobPicker from "../components/JobPicker";
import PathResult from "../components/PathResult";
import { api } from "../api";
export default function SkillGapPage() {
    const [knownSkills, setKnownSkills] = useState([]);
    const [targetJob, setTargetJob] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resources, setResources] = useState([]);
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
                }
                catch { /* non-fatal */ }
            }
        }
        catch (e) {
            setError(e.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "page-container", style: { paddingTop: 48 }, children: [_jsxs("div", { style: { marginBottom: 48 }, children: [_jsxs("h1", { className: "page-title", children: ["Find your", " ", _jsx("span", { className: "gradient-text", children: "skill gap" })] }), _jsx("p", { className: "page-subtitle", children: "Tell us what you know and where you want to go. CareerGraph traces the shortest path through the skills graph to get you there." })] }), _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 24 }, children: [_jsxs("div", { className: "card", children: [_jsxs("div", { style: {
                                    display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
                                }, children: [_jsx("span", { style: {
                                            width: 28, height: 28, borderRadius: "50%",
                                            background: "#2563eb",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
                                        }, children: "1" }), _jsx("h2", { style: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600 }, children: "Add skills you already know" })] }), _jsx(SkillSearch, { selected: knownSkills, onChange: setKnownSkills })] }), _jsxs("div", { className: "card", children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }, children: [_jsx("span", { style: {
                                            width: 28, height: 28, borderRadius: "50%",
                                            background: "#3b82f6",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
                                        }, children: "2" }), _jsx("h2", { style: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600 }, children: "Pick your target role" })] }), _jsx(JobPicker, { value: targetJob, onChange: setTargetJob })] }), _jsx("button", { className: "btn btn-primary", disabled: !canSubmit || loading, onClick: findPath, style: { width: "100%", padding: "16px", fontSize: 16 }, children: loading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "spinner", style: { width: 18, height: 18, borderTopColor: "#fff" } }), "Traversing graph\u2026"] })) : ("Find my skill gap") }), (results !== null || loading || error) && (_jsx("div", { children: _jsx(PathResult, { results: results, loading: loading, error: error }) })), resources.length > 0 && (_jsxs("div", { className: "card", style: { borderColor: "rgba(168,85,247,0.3)" }, children: [_jsx("h3", { style: {
                                    fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 16,
                                }, children: "\uD83D\uDCDA Recommended learning resources" }), _jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: resources.map((r) => (_jsxs("a", { href: r.url, target: "_blank", rel: "noopener noreferrer", style: {
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        padding: "12px 16px",
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "var(--radius)",
                                        textDecoration: "none",
                                        color: "var(--text)",
                                        transition: "border-color 0.15s, background 0.15s",
                                    }, onMouseEnter: (e) => {
                                        e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
                                    }, onMouseLeave: (e) => {
                                        e.currentTarget.style.borderColor = "var(--border)";
                                    }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontWeight: 500, fontSize: 14 }, children: r.name }), _jsxs("div", { style: { color: "var(--muted)", fontSize: 12, marginTop: 3 }, children: ["Teaches: ", r.teaches.join(", ")] })] }), _jsx("span", { style: {
                                                fontSize: 11, padding: "3px 8px", borderRadius: 99,
                                                background: "rgba(99,102,241,0.15)", color: "var(--accent-2)",
                                                flexShrink: 0, marginLeft: 12,
                                            }, children: r.type })] }, r.id))) })] }))] })] }));
}
