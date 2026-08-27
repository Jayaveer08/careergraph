import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../api";
export default function CompaniesPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(null);
    const [detail, setDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    useEffect(() => {
        api
            .listCompanies()
            .then(setCompanies)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);
    const openDetail = async (companyId) => {
        setSelected(companyId);
        setDetailLoading(true);
        setDetail(null);
        try {
            const d = await api.companyDetail(companyId);
            setDetail(d);
        }
        catch { /* noop */ }
        finally {
            setDetailLoading(false);
        }
    };
    const close = () => { setSelected(null); setDetail(null); };
    // Group by industry
    const byIndustry = {};
    companies.forEach((c) => {
        var _a;
        (byIndustry[_a = c.industry] ?? (byIndustry[_a] = [])).push(c);
    });
    const INDUSTRY_ICONS = {
        "AI/Agents": "🤖",
        "AI Research": "🔬",
        "Cloud Infra": "☁️",
        "Fintech": "💳",
        "Consumer Product": "📱",
    };
    return (_jsxs("div", { className: "page-container", style: { paddingTop: 48 }, children: [_jsxs("div", { style: { marginBottom: 40 }, children: [_jsxs("h1", { className: "page-title", children: ["Explore ", _jsx("span", { className: "gradient-text", children: "Companies" })] }), _jsx("p", { className: "page-subtitle", children: "Discover which companies compete for the same talent pool \u2014 powered by skill-overlap traversal in the graph." })] }), loading && _jsxs("div", { className: "state-msg", children: [_jsx("div", { className: "spinner" }), "Loading companies\u2026"] }), error && _jsxs("div", { className: "state-msg error", children: ["\u26A0 ", error] }), Object.entries(byIndustry).map(([industry, cos]) => (_jsxs("div", { style: { marginBottom: 40 }, children: [_jsxs("div", { style: {
                            display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
                        }, children: [_jsx("span", { style: { fontSize: 22 }, children: INDUSTRY_ICONS[industry] ?? "🏢" }), _jsx("h2", { style: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600 }, children: industry }), _jsxs("span", { style: { color: "var(--muted)", fontSize: 13 }, children: [cos.length, " compan", cos.length === 1 ? "y" : "ies"] })] }), _jsx("div", { className: "grid-2", children: cos.map((c, i) => (_jsxs("div", { className: "card card-interactive", onClick: () => openDetail(c.id), style: { animation: `dropIn 0.2s ${i * 0.07}s ease both` }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }, children: [_jsx("div", { style: {
                                                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                                                background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 20, border: "1px solid var(--border)",
                                            }, children: INDUSTRY_ICONS[c.industry] ?? "🏢" }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 600, fontSize: 15 }, children: c.name }), _jsx("div", { style: { color: "var(--muted)", fontSize: 12, marginTop: 2 }, children: c.industry })] })] }), _jsx("div", { style: { color: "var(--muted)", fontSize: 13, marginTop: 8 }, children: "View roles & competitors \u2192" })] }, c.id))) })] }, industry))), selected && (_jsxs(_Fragment, { children: [_jsx("div", { className: "overlay", onClick: close }), _jsxs("div", { className: "side-panel", children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }, children: [_jsx("h2", { style: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 20 }, children: "Company Profile" }), _jsx("button", { onClick: close, style: {
                                            background: "var(--surface)", border: "1px solid var(--border)",
                                            color: "var(--text-2)", borderRadius: "var(--radius-sm)",
                                            cursor: "pointer", padding: "6px 14px", fontSize: 13,
                                        }, children: "\u2715 Close" })] }), detailLoading && _jsxs("div", { className: "state-msg", children: [_jsx("div", { className: "spinner" }), "Loading\u2026"] }), detail && (_jsxs(_Fragment, { children: [_jsxs("div", { style: { marginBottom: 4 }, children: [_jsx("h3", { style: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 24 }, children: detail.name }), _jsxs("div", { style: { color: "var(--text-2)", fontSize: 14, marginTop: 4 }, children: [INDUSTRY_ICONS[detail.industry] ?? "🏢", " ", detail.industry] })] }), detail.top_skills.length > 0 && (_jsxs("div", { style: { marginTop: 24 }, children: [_jsx("span", { className: "field-label", children: "Skills used across roles" }), _jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: detail.top_skills.slice(0, 15).map((s) => (_jsx("span", { style: {
                                                        padding: "4px 10px", borderRadius: 99, fontSize: 12,
                                                        background: "rgba(255,255,255,0.06)", color: "var(--text-2)",
                                                        border: "1px solid var(--border)",
                                                    }, children: s }, s))) })] })), detail.job_roles.filter(r => r.id).length > 0 && (_jsxs("div", { style: { marginTop: 24 }, children: [_jsx("span", { className: "field-label", children: "Open Roles" }), _jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [...new Map(detail.job_roles.filter(r => r.id).map(r => [r.id, r])).values()].map((r) => (_jsxs("div", { style: {
                                                        padding: "10px 14px",
                                                        background: "rgba(255,255,255,0.03)",
                                                        borderRadius: "var(--radius)",
                                                        border: "1px solid var(--border)",
                                                        fontSize: 14,
                                                    }, children: [r.title, _jsx("span", { className: `badge-${r.level}`, style: { marginLeft: 10 }, children: r.level })] }, r.id))) })] })), detail.competitors.length > 0 && (_jsxs("div", { style: { marginTop: 28 }, children: [_jsx("span", { className: "field-label", children: "Talent-market competitors" }), _jsx("div", { style: { fontSize: 12, color: "var(--muted)", marginBottom: 10 }, children: "Companies competing for the same skill pools:" }), _jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: detail.competitors.map((c) => (_jsxs("div", { style: {
                                                        display: "flex", justifyContent: "space-between", alignItems: "center",
                                                        padding: "10px 14px",
                                                        background: "rgba(168,85,247,0.06)",
                                                        borderRadius: "var(--radius)",
                                                        border: "1px solid rgba(168,85,247,0.18)",
                                                        fontSize: 14,
                                                    }, children: [_jsx("span", { children: c.name }), _jsxs("span", { style: { color: "var(--muted)", fontSize: 12 }, children: [c.shared_skills, " shared skills"] })] }, c.id))) })] }))] }))] })] }))] }));
}
