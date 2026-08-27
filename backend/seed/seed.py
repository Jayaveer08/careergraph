"""
Loads seed data into CognoDB. Safe to re-run: everything uses MERGE, so
running this twice doesn't create duplicate nodes or relationships.

Usage:
    cd backend
    python -m seed.seed
"""

from neo4j import GraphDatabase
from app.config import NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD
from seed.data import SKILLS, RELATED_TO, JOB_ROLES, COMPANIES, RESOURCES


def load_skills(tx):
    tx.run(
        """
        UNWIND $skills AS skill
        MERGE (s:Skill {id: skill.id})
        SET s.name = skill.name, s.category = skill.category
        """,
        skills=SKILLS,
    )


def load_related_to(tx):
    pairs = [{"a": a, "b": b} for a, b in RELATED_TO]
    tx.run(
        """
        UNWIND $pairs AS pair
        MATCH (a:Skill {id: pair.a})
        MATCH (b:Skill {id: pair.b})
        MERGE (a)-[:RELATED_TO]-(b)
        """,
        pairs=pairs,
    )


def load_job_roles(tx):
    for job in JOB_ROLES:
        tx.run(
            """
            MERGE (j:JobRole {id: $id})
            SET j.title = $title, j.level = $level
            WITH j
            UNWIND $requires AS req
            MATCH (s:Skill {id: req[0]})
            MERGE (j)-[r:REQUIRES]->(s)
            SET r.weight = req[1]
            """,
            id=job["id"], title=job["title"], level=job["level"],
            requires=job["requires"],
        )


def load_companies(tx):
    for company in COMPANIES:
        tx.run(
            """
            MERGE (c:Company {id: $id})
            SET c.name = $name, c.industry = $industry
            WITH c
            UNWIND $hires_for AS job_id
            MATCH (j:JobRole {id: job_id})
            MERGE (c)-[:HIRES_FOR]->(j)
            """,
            id=company["id"], name=company["name"], industry=company["industry"],
            hires_for=company["hires_for"],
        )


def load_resources(tx):
    for res in RESOURCES:
        tx.run(
            """
            MERGE (r:Resource {id: $id})
            SET r.name = $name, r.type = $type, r.url = $url
            WITH r
            UNWIND $teaches AS skill_id
            MATCH (s:Skill {id: skill_id})
            MERGE (r)-[:TEACHES]->(s)
            """,
            id=res["id"], name=res["name"], type=res["type"], url=res["url"],
            teaches=res["teaches"],
        )


def ensure_constraints(tx):
    # Uniqueness constraints double as indexes -- makes MERGE lookups fast
    # and keeps re-runs safe.
    for label, prop in [
        ("Skill", "id"), ("JobRole", "id"), ("Company", "id"), ("Resource", "id"),
    ]:
        tx.run(f"CREATE CONSTRAINT IF NOT EXISTS FOR (n:{label}) REQUIRE n.{prop} IS UNIQUE")


def main():
    if not NEO4J_URI or not NEO4J_PASSWORD:
        raise SystemExit(
            "NEO4J_URI / NEO4J_PASSWORD not set. Copy .env.example to .env and fill it in."
        )

    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    with driver.session() as session:
        print("Ensuring constraints...")
        session.execute_write(ensure_constraints)
        print(f"Loading {len(SKILLS)} skills...")
        session.execute_write(load_skills)
        print(f"Loading {len(RELATED_TO)} RELATED_TO edges...")
        session.execute_write(load_related_to)
        print(f"Loading {len(JOB_ROLES)} job roles...")
        session.execute_write(load_job_roles)
        print(f"Loading {len(COMPANIES)} companies...")
        session.execute_write(load_companies)
        print(f"Loading {len(RESOURCES)} resources...")
        session.execute_write(load_resources)
    driver.close()
    print("Seed complete.")


if __name__ == "__main__":
    main()
