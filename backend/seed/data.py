"""
Realistic seed data for CareerGraph. Small enough to load in seconds on the
CognoDB free tier, big enough to make the multi-hop / recommendation queries
actually return interesting results.

IDs are slugs so REQUIRES/RELATED_TO edges below can reference them directly.
Extend these lists freely -- the loader is idempotent (uses MERGE), so
re-running seed.py after adding more entries is safe.
"""

SKILLS = [
    {"id": "python", "name": "Python", "category": "language"},
    {"id": "javascript", "name": "JavaScript", "category": "language"},
    {"id": "typescript", "name": "TypeScript", "category": "language"},
    {"id": "java", "name": "Java", "category": "language"},
    {"id": "sql", "name": "SQL", "category": "data"},
    {"id": "react", "name": "React", "category": "frontend"},
    {"id": "nodejs", "name": "Node.js", "category": "backend"},
    {"id": "fastapi", "name": "FastAPI", "category": "backend"},
    {"id": "spring-boot", "name": "Spring Boot", "category": "backend"},
    {"id": "docker", "name": "Docker", "category": "devops"},
    {"id": "kubernetes", "name": "Kubernetes", "category": "devops"},
    {"id": "aws", "name": "AWS", "category": "cloud"},
    {"id": "system-design", "name": "System Design", "category": "concept"},
    {"id": "dsa", "name": "Data Structures & Algorithms", "category": "concept"},
    {"id": "ml-fundamentals", "name": "ML Fundamentals", "category": "ai"},
    {"id": "pytorch", "name": "PyTorch", "category": "ai"},
    {"id": "nlp", "name": "NLP", "category": "ai"},
    {"id": "llm-apis", "name": "LLM APIs", "category": "ai"},
    {"id": "mongodb", "name": "MongoDB", "category": "data"},
    {"id": "postgres", "name": "PostgreSQL", "category": "data"},
    {"id": "graph-db", "name": "Graph Databases", "category": "data"},
    {"id": "rest-api-design", "name": "REST API Design", "category": "concept"},
    {"id": "git", "name": "Git", "category": "tooling"},
    {"id": "ci-cd", "name": "CI/CD", "category": "devops"},
    {"id": "testing", "name": "Automated Testing", "category": "concept"},
]

RELATED_TO = [
    # (skill_a, skill_b) -- undirected conceptual adjacency, used for the
    # skill-gap shortest-path traversal.
    ("javascript", "typescript"),
    ("typescript", "react"),
    ("javascript", "nodejs"),
    ("nodejs", "fastapi"),
    ("python", "fastapi"),
    ("python", "ml-fundamentals"),
    ("ml-fundamentals", "pytorch"),
    ("ml-fundamentals", "nlp"),
    ("nlp", "llm-apis"),
    ("java", "spring-boot"),
    ("sql", "postgres"),
    ("sql", "mongodb"),
    ("postgres", "graph-db"),
    ("docker", "kubernetes"),
    ("docker", "ci-cd"),
    ("aws", "kubernetes"),
    ("aws", "docker"),
    ("dsa", "system-design"),
    ("rest-api-design", "fastapi"),
    ("rest-api-design", "spring-boot"),
    ("git", "ci-cd"),
    ("testing", "ci-cd"),
    ("react", "rest-api-design"),
]

JOB_ROLES = [
    {
        "id": "backend-swe-1",
        "title": "Backend Software Engineer (Entry Level)",
        "level": "entry",
        "requires": [
            ("python", 0.9), ("fastapi", 0.8), ("sql", 0.7),
            ("rest-api-design", 0.8), ("git", 0.6), ("testing", 0.5),
        ],
    },
    {
        "id": "fullstack-swe-1",
        "title": "Full Stack Engineer (Entry Level)",
        "level": "entry",
        "requires": [
            ("javascript", 0.9), ("typescript", 0.7), ("react", 0.9),
            ("nodejs", 0.6), ("rest-api-design", 0.7), ("git", 0.6),
        ],
    },
    {
        "id": "ml-engineer-1",
        "title": "Machine Learning Engineer (Entry Level)",
        "level": "entry",
        "requires": [
            ("python", 0.9), ("ml-fundamentals", 0.9), ("pytorch", 0.7),
            ("sql", 0.5), ("docker", 0.4),
        ],
    },
    {
        "id": "nlp-engineer-1",
        "title": "NLP Engineer",
        "level": "mid",
        "requires": [
            ("python", 0.9), ("nlp", 0.9), ("llm-apis", 0.8),
            ("ml-fundamentals", 0.7), ("pytorch", 0.6),
        ],
    },
    {
        "id": "devops-engineer-1",
        "title": "DevOps Engineer (Entry Level)",
        "level": "entry",
        "requires": [
            ("docker", 0.9), ("kubernetes", 0.7), ("aws", 0.8),
            ("ci-cd", 0.8), ("git", 0.6),
        ],
    },
    {
        "id": "java-backend-1",
        "title": "Java Backend Developer (Entry Level)",
        "level": "entry",
        "requires": [
            ("java", 0.9), ("spring-boot", 0.9), ("sql", 0.7),
            ("rest-api-design", 0.7), ("testing", 0.5),
        ],
    },
    {
        "id": "swe2-fullstack",
        "title": "Software Engineer II, Full Stack",
        "level": "mid",
        "requires": [
            ("typescript", 0.8), ("react", 0.8), ("nodejs", 0.7),
            ("system-design", 0.7), ("aws", 0.5), ("ci-cd", 0.5),
        ],
    },
]

COMPANIES = [
    {"id": "wexa-ai", "name": "Wexa AI", "industry": "AI/Agents",
     "hires_for": ["ml-engineer-1", "nlp-engineer-1", "fullstack-swe-1"]},
    {"id": "orbit-systems", "name": "Orbit Systems", "industry": "Cloud Infra",
     "hires_for": ["devops-engineer-1", "backend-swe-1", "swe2-fullstack"]},
    {"id": "flowbank", "name": "FlowBank Technologies", "industry": "Fintech",
     "hires_for": ["java-backend-1", "backend-swe-1"]},
    {"id": "pixel-forge", "name": "Pixel Forge", "industry": "Consumer Product",
     "hires_for": ["fullstack-swe-1", "swe2-fullstack"]},
    {"id": "lattice-labs", "name": "Lattice Labs", "industry": "AI Research",
     "hires_for": ["ml-engineer-1", "nlp-engineer-1"]},
]

RESOURCES = [
    {"id": "res-fastapi-course", "name": "FastAPI for Backend Engineers", "type": "course",
     "url": "https://example.com/fastapi-course", "teaches": ["fastapi", "rest-api-design"]},
    {"id": "res-pytorch-fundamentals", "name": "PyTorch Fundamentals", "type": "course",
     "url": "https://example.com/pytorch", "teaches": ["pytorch", "ml-fundamentals"]},
    {"id": "res-k8s-crash-course", "name": "Kubernetes Crash Course", "type": "video",
     "url": "https://example.com/k8s", "teaches": ["kubernetes", "docker"]},
    {"id": "res-nlp-with-transformers", "name": "NLP with Transformers", "type": "book",
     "url": "https://example.com/nlp-book", "teaches": ["nlp", "llm-apis"]},
    {"id": "res-system-design-primer", "name": "System Design Primer", "type": "book",
     "url": "https://example.com/sd-primer", "teaches": ["system-design"]},
]
