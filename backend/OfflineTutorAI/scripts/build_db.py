"""
Script 5: SQLite Database Creation & Data Ingestion

Initializes SQLite database schema and imports curriculum chunks from curriculum/chunks/
into SQLite with Full-Text Search (FTS5) indexes.
Production version: No seed fallback or test data.
"""

import sys
import json
from pathlib import Path
from typing import List

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from OfflineTutorAI.config import DB_PATH, CHUNKS_DIR
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository
from OfflineTutorAI.models.chunk_model import CurriculumChunk


def build_database(db_path: Path = DB_PATH, chunks_dir: Path = CHUNKS_DIR):
    """Initializes SQLite DB and ingests curriculum chunks from chunks_dir."""
    print(f"[Build DB] Initializing SQLite database at {db_path}...")
    repo = CurriculumRepository(db_path=db_path)
    
    # Reset/clear existing database tables to ensure clean build
    if db_path.exists():
        conn = repo.get_connection()
        try:
            conn.execute("DROP TABLE IF EXISTS curriculum_chunks_fts")
            conn.execute("DROP TABLE IF EXISTS curriculum_chunks")
            conn.commit()
        finally:
            conn.close()

    repo.initialize_schema()

    chunk_files = list(chunks_dir.glob("*.json"))
    chunks_to_insert: List[CurriculumChunk] = []

    if chunk_files:
        for chunk_file in chunk_files:
            print(f"[Build DB] Loading chunks from {chunk_file.name}...")
            with open(chunk_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            for item in data.get("chunks", []):
                chunks_to_insert.append(CurriculumChunk.from_dict(item))
    else:
        print("[Build DB] Warning: No chunk JSON files found in chunks directory.")
        return

    print(f"[Build DB] Ingesting {len(chunks_to_insert)} curriculum chunks into SQLite...")
    inserted_count = repo.insert_chunks_bulk(chunks_to_insert)
    print(f"[Build DB] Ingested {inserted_count} records into SQLite curriculum_chunks table.")

    repo.rebuild_fts_index()
    print("[Build DB] FTS5 search index successfully built!")
    print(f"[Build DB] Total database chunks count: {repo.count_chunks()}")


if __name__ == "__main__":
    build_database()
