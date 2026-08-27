import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../api";
const LEVEL_LABEL = {
    entry: "Entry",
    mid: "Mid",
    senior: "Senior",
};
export default function JobPicker({ value, onChange }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        api
            .listJobs()
            .then(setJobs)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);
    if (loading) {
        return (_jsxs("div", { className: "state-msg", children: [_jsx("div", { className: "spinner" }), "Loading job roles\u2026"] }));
    }
    if (error)
        return _jsxs("div", { className: "state-msg error", children: ["\u26A0 ", error] });
    if (jobs.length === 0) {
        return (_jsx("div", { className: "state-msg", children: "No job roles yet \u2014 run the seed script first." }));
    }
    return (_jsxs("div", { children: [_jsx("span", { className: "field-label", children: "Target job role" }), _jsx("div", { style: { display: "grid", gap: 10 }, children: jobs.map((j) => {
                    const active = value === j.id;
                    return (_jsxs("div", { onClick: () => onChange(j.id), style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "14px 18px",
                            background: active ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
                            border: `1px solid ${active ? "rgba(99,102,241,0.5)" : "var(--border)"}`,
                            borderRadius: "var(--radius)",
                            cursor: "pointer",
                            transition: "all 0.16s",
                        }, children: [_jsx("span", { style: { fontWeight: active ? 600 : 400, fontSize: 14 }, children: j.title }), _jsx("span", { className: `badge-${j.level}`, children: LEVEL_LABEL[j.level] ?? j.level })] }, j.id));
                }) })] }));
}
