import { useEffect, useState } from "react";
import { api, JobRole } from "../api";

interface Props {
  value: string;
  onChange: (jobId: string) => void;
}

const LEVEL_LABEL: Record<string, string> = {
  entry: "Entry",
  mid: "Mid",
  senior: "Senior",
};

export default function JobPicker({ value, onChange }: Props) {
  const [jobs, setJobs] = useState<JobRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listJobs()
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="state-msg">
        <div className="spinner" />
        Loading job roles…
      </div>
    );
  }
  if (error) return <div className="state-msg error">⚠ {error}</div>;
  if (jobs.length === 0) {
    return (
      <div className="state-msg">
        No job roles yet — run the seed script first.
      </div>
    );
  }

  return (
    <div>
      <span className="field-label">Target job role</span>
      <div style={{ display: "grid", gap: 10 }}>
        {jobs.map((j) => {
          const active = value === j.id;
          return (
            <div
              key={j.id}
              onClick={() => onChange(j.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                background: active ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? "rgba(99,102,241,0.5)" : "var(--border)"}`,
                borderRadius: "var(--radius)",
                cursor: "pointer",
                transition: "all 0.16s",
              }}
            >
              <span style={{ fontWeight: active ? 600 : 400, fontSize: 14 }}>{j.title}</span>
              <span className={`badge-${j.level}`}>{LEVEL_LABEL[j.level] ?? j.level}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
