const BASE_URL = import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "https://careergraph-72qj.onrender.com";
// ─── HTTP helper ────────────────────────────────────────────
async function request(path, options) {
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
    health: () => request("/health"),
    searchSkills: (q, limit = 20) => request(`/skills?q=${encodeURIComponent(q)}&limit=${limit}`),
    listJobs: () => request("/jobs"),
    jobDetail: (jobId) => request(`/jobs/${jobId}`),
    listCompanies: () => request("/companies"),
    companyDetail: (companyId) => request(`/companies/${companyId}`),
    skillGapPath: (knownSkillIds, targetJobId) => request("/skill-gap-path", {
        method: "POST",
        body: JSON.stringify({
            known_skill_ids: knownSkillIds,
            target_job_id: targetJobId,
        }),
    }),
    recommend: (skillId, limit = 8) => request(`/recommend/${skillId}?limit=${limit}`),
    getGraph: () => request("/graph"),
    getResources: (skillIds) => request(`/resources?skill_ids=${skillIds.join(",")}`),
};
