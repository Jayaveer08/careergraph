import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { api } from "../api";
import SkillChip from "./SkillChip";
export default function SkillSearch({ selected, onChange }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);
    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);
    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (!query) {
                setResults([]);
                setOpen(false);
                return;
            }
            setLoading(true);
            try {
                const data = await api.searchSkills(query);
                const filtered = data.filter((s) => !selected.find((sel) => sel.id === s.id));
                setResults(filtered);
                setOpen(filtered.length > 0);
            }
            catch {
                setResults([]);
            }
            finally {
                setLoading(false);
            }
        }, 220);
        return () => clearTimeout(timeout);
    }, [query, selected]);
    const add = (skill) => {
        onChange([...selected, skill]);
        setQuery("");
        setResults([]);
        setOpen(false);
    };
    return (_jsxs("div", { children: [_jsx("span", { className: "field-label", children: "Skills you already know" }), selected.length > 0 && (_jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }, children: selected.map((s) => (_jsx(SkillChip, { name: s.name, category: s.category, onRemove: () => onChange(selected.filter((x) => x.id !== s.id)) }, s.id))) })), _jsxs("div", { ref: wrapRef, style: { position: "relative" }, children: [_jsx("input", { placeholder: "Search skills, e.g. Python, React, Docker\u2026", value: query, onChange: (e) => setQuery(e.target.value), onFocus: () => results.length > 0 && setOpen(true) }), loading && (_jsx("div", { style: { position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }, children: _jsx("div", { className: "spinner" }) })), open && results.length > 0 && (_jsx("div", { className: "dropdown", children: results.slice(0, 8).map((s) => (_jsxs("div", { className: "dropdown-item", onMouseDown: () => add(s), children: [_jsx("span", { children: s.name }), _jsx("span", { className: `chip cat-${s.category}`, style: { fontSize: 11 }, children: s.category })] }, s.id))) }))] }), !loading && query && results.length === 0 && (_jsx("div", { className: "state-msg", style: { paddingTop: 10, paddingBottom: 0 }, children: "No matching skills found." }))] }));
}
