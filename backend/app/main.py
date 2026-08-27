from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app import queries
from app.db import check_health

app = FastAPI(title="CareerGraph API")

# Loosen this to your deployed frontend origin before you ship.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    ok = check_health()
    if not ok:
        raise HTTPException(status_code=503, detail="Database unreachable")
    return {"status": "ok"}


@app.get("/skills")
def get_skills(q: str = Query("", min_length=0), limit: int = 10):
    return queries.search_skills(q, limit)


@app.get("/jobs")
def get_jobs():
    return queries.list_job_roles()


@app.get("/jobs/{job_id}")
def get_job_detail(job_id: str):
    result = queries.job_role_detail(job_id)
    if not result:
        raise HTTPException(status_code=404, detail="Job role not found")
    return result[0]


@app.get("/companies")
def get_companies():
    return queries.list_companies()


@app.get("/companies/{company_id}")
def get_company_detail(company_id: str, limit: int = 5):
    competitors = queries.company_clusters_by_skill_overlap(company_id, limit)
    # Also fetch the company's own job roles
    result = queries.run_company_detail(company_id)
    if not result:
        raise HTTPException(status_code=404, detail="Company not found")
    return {**result[0], "competitors": competitors}


class SkillGapRequest(BaseModel):
    known_skill_ids: list[str]
    target_job_id: str


@app.post("/skill-gap-path")
def skill_gap_path(req: SkillGapRequest):
    return queries.skill_gap_path(req.known_skill_ids, req.target_job_id)


@app.get("/recommend/{skill_id}")
def recommend(skill_id: str, limit: int = 8):
    return queries.recommend_adjacent_skills(skill_id, limit)


@app.get("/companies/{company_id}/clusters")
def company_clusters(company_id: str, limit: int = 5):
    return queries.company_clusters_by_skill_overlap(company_id, limit)


@app.get("/graph")
def get_graph():
    """Returns all skill nodes + RELATED_TO edges for the graph visualizer."""
    return queries.get_graph_data()


@app.get("/resources")
def get_resources(skill_ids: str = Query("")):
    """Returns learning resources for the given comma-separated skill IDs."""
    ids = [s.strip() for s in skill_ids.split(",") if s.strip()]
    if not ids:
        return []
    return queries.get_resources_for_skills(ids)
