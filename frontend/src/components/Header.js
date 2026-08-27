import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../api";
const NAV = [
    { to: "/", label: "SKILL GAP" },
    { to: "/jobs", label: "JOBS" },
    { to: "/companies", label: "COMPANIES" },
    { to: "/graph", label: "GRAPH" },
];
export default function Header() {
    const { pathname } = useLocation();
    const [healthy, setHealthy] = useState(null);
    useEffect(() => {
        api.health()
            .then(() => setHealthy(true))
            .catch(() => setHealthy(false));
    }, []);
    return (_jsx("header", { style: {
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "#f4efe6",
            borderBottom: "1px solid #e2dad0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
        }, children: _jsxs("div", { style: {
                maxWidth: 1120,
                margin: "0 auto",
                padding: "0 28px",
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 32,
            }, children: [_jsxs(Link, { to: "/", style: { textDecoration: "none", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }, children: [_jsx("div", { style: {
                                width: 32, height: 32, borderRadius: 8,
                                background: "#ea3829",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(234, 56, 41, 0.35)",
                            }, children: _jsxs("svg", { width: "18", height: "18", viewBox: "0 0 18 18", fill: "none", children: [_jsx("circle", { cx: "9", cy: "4", r: "2.2", fill: "white" }), _jsx("circle", { cx: "4", cy: "14", r: "1.8", fill: "white" }), _jsx("circle", { cx: "14", cy: "14", r: "1.8", fill: "white" }), _jsx("line", { x1: "9", y1: "6.2", x2: "4", y2: "12.2", stroke: "white", strokeWidth: "1.4" }), _jsx("line", { x1: "9", y1: "6.2", x2: "14", y2: "12.2", stroke: "white", strokeWidth: "1.4" }), _jsx("line", { x1: "4", y1: "14", x2: "14", y2: "14", stroke: "white", strokeWidth: "1.2" })] }) }), _jsx("span", { style: {
                                fontFamily: "'DM Sans', 'Inter', sans-serif",
                                fontWeight: 800,
                                fontSize: 17,
                                letterSpacing: "-0.01em",
                                color: "#1c1917",
                            }, children: "CareerGraph" })] }), _jsx("nav", { style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }, children: NAV.map(({ to, label }) => {
                        const active = pathname === to;
                        return (_jsx(Link, { to: to, style: {
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: active ? "9px 24px" : "9px 18px",
                                borderRadius: active ? 999 : 8,
                                textDecoration: "none",
                                fontSize: 13,
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: active ? "#ffffff" : "#1c1917",
                                background: active ? "#ea3829" : "transparent",
                                boxShadow: active ? "0 6px 18px rgba(234, 56, 41, 0.38)" : "none",
                                transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                                whiteSpace: "nowrap",
                            }, children: label }, to));
                    }) }), _jsxs("div", { style: {
                        display: "flex", alignItems: "center", gap: 7,
                        padding: "5px 12px", borderRadius: 99,
                        background: "#e9e3d8",
                        border: "1px solid #dcd5c7",
                        fontSize: 12,
                        color: "#1c1917",
                        fontWeight: 600,
                        flexShrink: 0,
                    }, children: [_jsx("span", { style: {
                                width: 7, height: 7, borderRadius: "50%",
                                background: healthy === true ? "#16a34a" : healthy === false ? "#dc2626" : "#a8a29e",
                                boxShadow: healthy === true ? "0 0 6px rgba(22, 163, 74, 0.5)" : "none",
                            } }), healthy === null ? "CONNECTING" : healthy ? "DB CONNECTED" : "DB OFFLINE"] })] }) }));
}
