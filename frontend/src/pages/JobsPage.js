import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../api";
const LEVEL_LABEL = { entry: "Entry", mid: "Mid", senior: "Senior" };
const TYPE_ICON = {
    course: "🎓",
    video: "🎬",
    book: "📖",
};
export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(null);
    const [detail, setDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [resources, setResources] = useState([]);
    useEffect(() => {
        api
            .listJobs()
            .then(setJobs)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);
    const openDetail = async (jobId) => {
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
        }
        catch { /* noop */ }
        finally {
            setDetailLoading(false);
        }
    };
    const close = () => { setSelected(null); setDetail(null); setResources([]); };
    return (_jsxs("div", { className: "page-container", style: { paddingTop: 48 }, children: [_jsxs("div", { style: { marginBottom: 40 }, children: [_jsxs("h1", { className: "page-title", children: ["Browse ", _jsx("span", { className: "gradient-text", children: "Job Roles" })] }), _jsx("p", { className: "page-subtitle", children: "Explore all roles in the graph. Click any card to see required skills, hiring companies, and learning resources." })] }), loading && _jsxs("div", { className: "state-msg", children: [_jsx("div", { className: "spinner" }), "Loading jobs\u2026"] }), error && _jsxs("div", { className: "state-msg error", children: ["\u26A0 ", error] }), !loading && !error && jobs.length === 0 && (_jsx("div", { className: "state-msg", children: "No job roles yet \u2014 run the seed script." })), _jsx("div", { className: "grid-2", children: jobs.map((j, i) => (_jsxs("div", { className: "card card-interactive", onClick: () => openDetail(j.id), style: { animation: `dropIn 0.2s ${i * 0.06}s ease both` }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }, children: [_jsx("h3", { style: {
                                        fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600,
                                        lineHeight: 1.3, flex: 1, paddingRight: 12,
                                    }, children: j.title }), _jsx("span", { className: `badge-${j.level}`, children: LEVEL_LABEL[j.level] ?? j.level })] }), _jsx("div", { style: { color: "var(--muted)", fontSize: 13 }, children: "Click to view skills & learning resources \u2192" })] }, j.id))) }), selected && (_jsxs(_Fragment, { children: [_jsx("div", { className: "overlay", onClick: close }), _jsxs("div", { className: "side-panel", children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }, children: [_jsx("h2", { style: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 20 }, children: "Role Detail" }), _jsx("button", { onClick: close, style: {
                                            background: "var(--surface)", border: "1px solid var(--border)",
                                            color: "var(--text-2)", borderRadius: "var(--radius-sm)",
                                            cursor: "pointer", padding: "6px 14px", fontSize: 13,
                                        }, children: "\u2715 Close" })] }), detailLoading && (_jsxs("div", { className: "state-msg", children: [_jsx("div", { className: "spinner" }), "Loading details\u2026"] })), detail && (_jsxs(_Fragment, { children: [_jsx("h3", { style: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, lineHeight: 1.25, marginBottom: 10 }, children: detail.title }), _jsx("span", { className: `badge-${detail.level}`, style: { display: "inline-block", marginBottom: 28 }, children: LEVEL_LABEL[detail.level] ?? detail.level }), _jsx("hr", { className: "divider" }), _jsxs("div", { style: { marginTop: 4, marginBottom: 28 }, children: [_jsx("span", { className: "field-label", children: "Required Skills" }), _jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: detail.required_skills
                                                    .sort((a, b) => b.weight - a.weight)
                                                    .map((s) => {
                                                    const badge = s.weight >= 0.85
                                                        ? { label: "Core Skill", color: "#4f46e5", bg: "#eef2ff", border: "#c7d2fe" }
                                                        : s.weight >= 0.7
                                                            ? { label: "Essential", color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" }
                                                            : s.weight >= 0.55
                                                                ? { label: "Important", color: "#d97706", bg: "#fffbeb", border: "#fef3c7" }
                                                                : { label: "Secondary", color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" };
                                                    return (_jsxs("div", { children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, marginBottom: 6 }, children: [_jsx("span", { style: { fontWeight: 500, color: "var(--text)" }, children: s.name }), _jsx("span", { style: {
                                                                            fontSize: 11,
                                                                            fontWeight: 600,
                                                                            padding: "2px 8px",
                                                                            borderRadius: 99,
                                                                            background: badge.bg,
                                                                            color: badge.color,
                                                                            border: `1px solid ${badge.border}`,
                                                                        }, children: badge.label })] }), _jsx("div", { className: "weight-bar-track", children: _jsx("div", { className: "weight-bar-fill", style: { width: `${s.weight * 100}%` } }) })] }, s.name));
                                                }) })] }), detail.companies.filter(Boolean).length > 0 && (_jsxs(_Fragment, { children: [_jsx("hr", { className: "divider" }), _jsxs("div", { style: { marginBottom: 28 }, children: [_jsx("span", { className: "field-label", children: "Companies Hiring for This Role" }), _jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: detail.companies.filter(Boolean).map((c) => (_jsxs("span", { style: {
                                                                padding: "6px 14px", borderRadius: 99, fontSize: 13,
                                                                background: "rgba(99,102,241,0.12)", color: "var(--accent-2)",
                                                                border: "1px solid rgba(99,102,241,0.25)", fontWeight: 500,
                                                            }, children: ["\uD83C\uDFE2 ", c] }, c))) })] })] })), _jsx("hr", { className: "divider" }), _jsxs("div", { children: [_jsx("span", { className: "field-label", children: "Learning Resources" }), resources.length === 0 ? (_jsx("div", { className: "state-msg", style: { paddingTop: 10 }, children: "No specific resources found for this role's skills yet." })) : (_jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: resources.map((r) => (_jsxs("a", { href: r.url, target: "_blank", rel: "noopener noreferrer", style: {
                                                        display: "block",
                                                        padding: "14px 16px",
                                                        background: "rgba(255,255,255,0.03)",
                                                        border: "1px solid var(--border)",
                                                        borderRadius: "var(--radius)",
                                                        textDecoration: "none",
                                                        color: "var(--text)",
                                                        transition: "border-color 0.15s, background 0.15s, transform 0.15s",
                                                    }, onMouseEnter: (e) => {
                                                        const el = e.currentTarget;
                                                        el.style.borderColor = "rgba(99,102,241,0.45)";
                                                        el.style.background = "rgba(99,102,241,0.06)";
                                                        el.style.transform = "translateX(3px)";
                                                    }, onMouseLeave: (e) => {
                                                        const el = e.currentTarget;
                                                        el.style.borderColor = "var(--border)";
                                                        el.style.background = "rgba(255,255,255,0.03)";
                                                        el.style.transform = "translateX(0)";
                                                    }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }, children: [_jsx("span", { style: { fontSize: 22, flexShrink: 0 }, children: TYPE_ICON[r.type] ?? "📄" }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { fontWeight: 600, fontSize: 14, lineHeight: 1.3 }, children: r.name }), _jsx("span", { style: {
                                                                                fontSize: 11, padding: "2px 8px", borderRadius: 99, marginTop: 4,
                                                                                display: "inline-block",
                                                                                background: "rgba(168,85,247,0.15)", color: "#d8b4fe",
                                                                                border: "1px solid rgba(168,85,247,0.25)",
                                                                                textTransform: "capitalize",
                                                                            }, children: r.type })] }), _jsx("span", { style: { color: "var(--accent-2)", fontSize: 16, flexShrink: 0 }, children: "\u2197" })] }), _jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: r.teaches.map((skill) => (_jsx("span", { style: {
                                                                    fontSize: 11, padding: "2px 8px", borderRadius: 99,
                                                                    background: "rgba(6,182,212,0.1)", color: "#67e8f9",
                                                                    border: "1px solid rgba(6,182,212,0.2)",
                                                                }, children: skill }, skill))) })] }, r.id))) }))] })] }))] })] }))] }));
}
