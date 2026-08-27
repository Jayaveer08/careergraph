const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "https://careergraph-72qj.onrender.com";

// ─── Interfaces ────────────────────────────────────────────
export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface JobRole {
  id: string;
  title: string;
  level: string;
}

export interface JobDetail {
  id: string;
  title: string;
  level: string;
  required_skills: { id: string; name: string; weight: number }[];
  companies: string[];
}

export interface SkillGapResult {
  missing_skill: string;
  hops: number;
  path: string[];
}

export interface Company {
  id: string;
  name: string;
  industry: string;
}

export interface CompanyDetail extends Company {
  job_roles: JobRole[];
  top_skills: string[];
  competitors: { id: string; name: string; shared_skills: number }[];
}

export interface GraphData {
  nodes: { id: string; name: string; category: string }[];
  links: { source: string; target: string }[];
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  url: string;
  teaches: string[];
}

// ─── HTTP helper ────────────────────────────────────────────
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

// ─── API surface ────────────────────────────────────────────
export const api = {
  health: () => request<{ status: string }>("/health"),

  searchSkills: (q: string, limit = 20) =>
    request<Skill[]>(`/skills?q=${encodeURIComponent(q)}&limit=${limit}`),

  listJobs: () => request<JobRole[]>("/jobs"),
  jobDetail: (jobId: string) => request<JobDetail>(`/jobs/${jobId}`),

  listCompanies: () => request<Company[]>("/companies"),
  companyDetail: (companyId: string) =>
    request<CompanyDetail>(`/companies/${companyId}`),

  skillGapPath: (knownSkillIds: string[], targetJobId: string) =>
    request<SkillGapResult[]>("/skill-gap-path", {
      method: "POST",
      body: JSON.stringify({
        known_skill_ids: knownSkillIds,
        target_job_id: targetJobId,
      }),
    }),

  recommend: (skillId: string, limit = 8) =>
    request<(Skill & { shared_jobs: number })[]>(
      `/recommend/${skillId}?limit=${limit}`
    ),

  getGraph: () => request<GraphData>("/graph"),

  getResources: (skillIds: string[]) =>
    request<Resource[]>(`/resources?skill_ids=${skillIds.join(",")}`),
};
