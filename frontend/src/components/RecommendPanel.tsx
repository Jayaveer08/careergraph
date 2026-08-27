import { useEffect, useState } from "react";
import { api, Skill } from "../api";
import SkillChip from "./SkillChip";

interface Props {
  skillId: string;
  skillName: string;
}

export default function RecommendPanel({ skillId, skillName }: Props) {
  const [recs, setRecs] = useState<(Skill & { shared_jobs: number })[]>([]);
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
    return (
      <div className="state-msg">
        <div className="spinner" />
        Finding related skills…
      </div>
    );
  }

  if (recs.length === 0) {
    return (
      <div className="state-msg">No recommendations found for this skill.</div>
    );
  }

  return (
    <div>
      <span className="field-label">Skills that often appear with {skillName}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
        {recs.map((r) => (
          <div
            key={r.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <SkillChip name={r.name} category={r.category} />
            <span style={{ fontSize: 11, color: "var(--muted)" }}>
              {r.shared_jobs} job{r.shared_jobs !== 1 ? "s" : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
