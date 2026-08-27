"""
All Cypher lives here, parameterized. Nothing in this file ever
string-concatenates user input into a query.
"""

from app.db import run_query


def get_graph_data():
    """
    Returns all Skill nodes and RELATED_TO edges for the force-directed
    graph visualization. This query is trivially awkward in SQL (multiple
    self-joins on the skill adjacency table) but a one-liner in Cypher.
    """
    nodes = run_query(
        """
        MATCH (s:Skill)
        RETURN s.id AS id, s.name AS name, s.category AS category
        """
    )
    edges = run_query(
        """
        MATCH (a:Skill)-[:RELATED_TO]-(b:Skill)
        WHERE a.id < b.id
        RETURN a.id AS source, b.id AS target
        """
    )
    return {"nodes": nodes, "links": edges}


def get_resources_for_skills(skill_ids: list[str]):
    """
    Multi-hop: Resource -[:TEACHES]-> Skill -[:REQUIRES]<- JobRole.
    Returns learning resources that teach any skill in the given list.
    """
    return run_query(
        """
        MATCH (r:Resource)-[:TEACHES]->(s:Skill)
        WHERE s.id IN $skill_ids
        RETURN r.id AS id, r.name AS name, r.type AS type,
               r.url AS url, collect(s.name) AS teaches
        """,
        {"skill_ids": skill_ids},
    )


def search_skills(q: str, limit: int = 10):
    return run_query(
        """
        MATCH (s:Skill)
        WHERE toLower(s.name) CONTAINS toLower($q)
        RETURN s.id AS id, s.name AS name, s.category AS category
        ORDER BY s.name
        LIMIT $limit
        """,
        {"q": q, "limit": limit},
    )


def list_job_roles():
    return run_query(
        """
        MATCH (j:JobRole)
        RETURN j.id AS id, j.title AS title, j.level AS level
        ORDER BY j.title
        """
    )


def job_role_detail(job_id: str):
    return run_query(
        """
        MATCH (j:JobRole {id: $job_id})-[r:REQUIRES]->(s:Skill)
        OPTIONAL MATCH (c:Company)-[:HIRES_FOR]->(j)
        RETURN j.id AS id, j.title AS title, j.level AS level,
               collect(DISTINCT {id: s.id, name: s.name, weight: r.weight}) AS required_skills,
               collect(DISTINCT c.name) AS companies
        """,
        {"job_id": job_id},
    )


def list_companies():
    return run_query(
        """
        MATCH (c:Company)
        RETURN c.id AS id, c.name AS name, c.industry AS industry
        ORDER BY c.name
        """
    )


def run_company_detail(company_id: str):
    return run_query(
        """
        MATCH (c:Company {id: $company_id})
        OPTIONAL MATCH (c)-[:HIRES_FOR]->(j:JobRole)-[:REQUIRES]->(s:Skill)
        RETURN c.id AS id, c.name AS name, c.industry AS industry,
               collect(DISTINCT {id: j.id, title: j.title, level: j.level}) AS job_roles,
               collect(DISTINCT s.name) AS top_skills
        """,
        {"company_id": company_id},
    )


# --- The three "killer" queries the assignment wants ---

def skill_gap_path(known_skill_ids: list[str], target_job_id: str):
    """
    Multi-hop traversal (2+ hops): for each skill required by the target job
    that the person doesn't already have, find the shortest RELATED_TO path
    from something they DO know to that missing skill. This is the
    'how do I get from what I know to what this job needs' query.
    """
    return run_query(
        """
        MATCH (j:JobRole {id: $target_job_id})-[:REQUIRES]->(missing:Skill)
        WHERE NOT missing.id IN $known_skill_ids
        MATCH (known:Skill) WHERE known.id IN $known_skill_ids
        MATCH p = shortestPath((known)-[:RELATED_TO*1..4]-(missing))
        WITH missing, p, length(p) AS hops
        ORDER BY hops ASC
        WITH missing, collect(p)[0] AS best_path, min(hops) AS shortest_hops
        RETURN missing.name AS missing_skill,
               shortest_hops AS hops,
               [n IN nodes(best_path) | n.name] AS path
        ORDER BY shortest_hops ASC
        """,
        {"known_skill_ids": known_skill_ids, "target_job_id": target_job_id},
    )


def recommend_adjacent_skills(skill_id: str, limit: int = 8):
    """
    'Relational-awkward' query: recommend skills that co-occur most often
    with this one across job postings (a graph-neighbor / collaborative-
    filtering style aggregation that requires walking Skill -> JobRole ->
    other Skill and counting shared-job frequency — painful as SQL joins,
    natural as a Cypher pattern match).
    """
    return run_query(
        """
        MATCH (s:Skill {id: $skill_id})<-[:REQUIRES]-(j:JobRole)-[:REQUIRES]->(other:Skill)
        WHERE other.id <> $skill_id
        RETURN other.id AS id, other.name AS name, count(DISTINCT j) AS shared_jobs
        ORDER BY shared_jobs DESC
        LIMIT $limit
        """,
        {"skill_id": skill_id, "limit": limit},
    )


def company_clusters_by_skill_overlap(company_id: str, limit: int = 5):
    """
    Companies whose job roles require overlapping skill sets with this
    company's roles -> a "who's my talent-market competitor" query.
    """
    return run_query(
        """
        MATCH (c1:Company {id: $company_id})-[:HIRES_FOR]->(:JobRole)-[:REQUIRES]->(s:Skill)
              <-[:REQUIRES]-(:JobRole)<-[:HIRES_FOR]-(c2:Company)
        WHERE c1 <> c2
        RETURN c2.id AS id, c2.name AS name, count(DISTINCT s) AS shared_skills
        ORDER BY shared_skills DESC
        LIMIT $limit
        """,
        {"company_id": company_id, "limit": limit},
    )
