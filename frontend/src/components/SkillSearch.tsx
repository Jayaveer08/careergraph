import { useEffect, useRef, useState } from "react";
import { api, Skill } from "../api";
import SkillChip from "./SkillChip";

interface Props {
  selected: Skill[];
  onChange: (skills: Skill[]) => void;
}

export default function SkillSearch({ selected, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query) { setResults([]); setOpen(false); return; }
      setLoading(true);
      try {
        const data = await api.searchSkills(query);
        const filtered = data.filter((s) => !selected.find((sel) => sel.id === s.id));
        setResults(filtered);
        setOpen(filtered.length > 0);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 220);
    return () => clearTimeout(timeout);
  }, [query, selected]);

  const add = (skill: Skill) => {
    onChange([...selected, skill]);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div>
      <span className="field-label">Skills you already know</span>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {selected.map((s) => (
            <SkillChip
              key={s.id}
              name={s.name}
              category={s.category}
              onRemove={() => onChange(selected.filter((x) => x.id !== s.id))}
            />
          ))}
        </div>
      )}

      {/* Input with dropdown */}
      <div ref={wrapRef} style={{ position: "relative" }}>
        <input
          placeholder="Search skills, e.g. Python, React, Docker…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        {loading && (
          <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
            <div className="spinner" />
          </div>
        )}

        {open && results.length > 0 && (
          <div className="dropdown">
            {results.slice(0, 8).map((s) => (
              <div key={s.id} className="dropdown-item" onMouseDown={() => add(s)}>
                <span>{s.name}</span>
                <span className={`chip cat-${s.category}`} style={{ fontSize: 11 }}>
                  {s.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && query && results.length === 0 && (
        <div className="state-msg" style={{ paddingTop: 10, paddingBottom: 0 }}>
          No matching skills found.
        </div>
      )}
    </div>
  );
}
