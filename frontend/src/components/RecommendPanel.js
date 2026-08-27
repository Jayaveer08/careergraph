import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../api";
import SkillChip from "./SkillChip";
export default function RecommendPanel({ skillId, skillName }) {
    const [recs, setRecs] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        api
            .recommend(skillId)
            .then(setRecs)
            .catch(() => setRecs([]))
            .finally(() => setLoading(false));
    }, [skillId]);
    if (loading) {
        return (_jsxs("div", { className: "state-msg", children: [_jsx("div", { className: "spinner" }), "Finding related skills\u2026"] }));
    }
    if (recs.length === 0) {
        return (_jsx("div", { className: "state-msg", children: "No recommendations found for this skill." }));
    }
    return (_jsxs("div", { children: [_jsxs("span", { className: "field-label", children: ["Skills that often appear with ", skillName] }), _jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }, children: recs.map((r) => (_jsxs("div", { style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }, children: [_jsx(SkillChip, { name: r.name, category: r.category }), _jsxs("span", { style: { fontSize: 11, color: "var(--muted)" }, children: [r.shared_jobs, " job", r.shared_jobs !== 1 ? "s" : ""] })] }, r.id))) })] }));
}
