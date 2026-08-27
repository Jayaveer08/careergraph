import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function SkillChip({ name, category, onRemove }) {
    return (_jsxs("span", { className: `chip cat-${category}`, children: [name, onRemove && (_jsx("button", { className: "chip-remove", onClick: onRemove, "aria-label": `Remove ${name}`, children: "\u00D7" }))] }));
}
