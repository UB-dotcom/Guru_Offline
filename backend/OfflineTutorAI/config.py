"""
Configuration Settings for OfflineTutorAI

Centralized configuration paths, database settings, local SLM parameters,
package export paths, and retrieval thresholds. Designed for offline-first execution.
"""

import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent

ADMIN_DIR = BASE_DIR / "admin"
CURRICULUM_DIR = BASE_DIR / "curriculum"
SOURCE_DIR = CURRICULUM_DIR / "source"
PROCESSED_DIR = CURRICULUM_DIR / "processed"
CHUNKS_DIR = CURRICULUM_DIR / "chunks"

PACKAGES_DIR = BASE_DIR / "packages"
STUDENT_SYNC_DIR = BASE_DIR / "student" / "sync" / "local_storage"

DATABASE_DIR = BASE_DIR / "database"
DB_PATH = DATABASE_DIR / "curriculum.db"
SCHEMA_PATH = DATABASE_DIR / "schema" / "schema.sql"

# AI / SLM Config
SLM_MODEL_DIR = BASE_DIR / "ai" / "local_llm" / "weights"
DEFAULT_MODEL_NAME = "phi-3-mini-4k-instruct-q4.gguf"
DEFAULT_MODEL_PATH = SLM_MODEL_DIR / DEFAULT_MODEL_NAME

# Retrieval Config
DEFAULT_TOP_K = 3
MAX_CONTEXT_TOKENS = 1500
MIN_RELEVANCE_SCORE = 0.1

# Safety Config
STRICT_CURRICULUM_FILTER = True
MAX_QUESTION_LENGTH = 500

# Ensure directories exist
for path in [SOURCE_DIR, PROCESSED_DIR, CHUNKS_DIR, DATABASE_DIR, PACKAGES_DIR, STUDENT_SYNC_DIR, SLM_MODEL_DIR]:
    path.mkdir(parents=True, exist_ok=True)
