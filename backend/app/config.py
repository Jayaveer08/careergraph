import os
from dotenv import load_dotenv

load_dotenv()

NEO4J_URI = os.environ.get("NEO4J_URI")
NEO4J_USER = os.environ.get("NEO4J_USER", "cognodb")
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWORD")

if not NEO4J_URI or not NEO4J_PASSWORD:
    # Don't crash at import time in every environment (e.g. during tests),
    # but make it loud so a missing .env is obvious immediately.
    print("WARNING: NEO4J_URI or NEO4J_PASSWORD not set. Set them in a .env file "
          "(see .env.example). The app will fail on first DB call until this is fixed.")
