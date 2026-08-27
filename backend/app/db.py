from contextlib import contextmanager
from neo4j import GraphDatabase
from neo4j.exceptions import ServiceUnavailable, AuthError
from fastapi import HTTPException

from app.config import NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD

_driver = None


def get_driver():
    """Lazily create a single shared driver instance."""
    global _driver
    if _driver is None:
        if not NEO4J_URI or not NEO4J_PASSWORD:
            raise HTTPException(
                status_code=503,
                detail="Database is not configured. Check NEO4J_URI / NEO4J_PASSWORD env vars.",
            )
        _driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    return _driver


@contextmanager
def get_session():
    """
    Context manager that yields a Neo4j session and converts connection
    failures into clean 503s instead of raw driver exceptions bubbling up.
    """
    try:
        driver = get_driver()
        session = driver.session()
    except (ServiceUnavailable, AuthError) as e:
        raise HTTPException(status_code=503, detail=f"Database unreachable: {e}")
    try:
        yield session
    except (ServiceUnavailable, AuthError) as e:
        raise HTTPException(status_code=503, detail=f"Database unreachable: {e}")
    finally:
        session.close()


def run_query(query: str, params: dict | None = None):
    """Run a single parameterized Cypher query and return records as list of dicts."""
    with get_session() as session:
        result = session.run(query, params or {})
        return [record.data() for record in result]


def check_health() -> bool:
    try:
        with get_session() as session:
            session.run("RETURN 1")
        return True
    except HTTPException:
        return False
