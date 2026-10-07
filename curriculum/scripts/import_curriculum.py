"""
Guru Offline Curriculum Import Pipeline

Processes structured curriculum packages from curriculum/source/ (cbse, icse, state),
populates SQLite tables (boards, states, classes, streams, subjects, chapters, modules, content_chunks),
builds/updates the SQLite FTS5 index, copies curriculum.db to backend and Android assets,
and generates the frontend offline database snapshot.

Usage:
    python curriculum/scripts/import_curriculum.py
"""

import os
import sys
import json
import sqlite3
import shutil
from pathlib import Path
from typing import Dict, Any, List

# Ensure utf-8 output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Paths
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
CURRICULUM_DIR = ROOT_DIR / "curriculum"
SCHEMA_SQL = CURRICULUM_DIR / "schemas" / "curriculum_schema.sql"
METADATA_JSON = CURRICULUM_DIR / "imports" / "catalog_metadata.json"
SOURCE_DIR = CURRICULUM_DIR / "source"

MASTER_DB_PATH = CURRICULUM_DIR / "curriculum.db"
TARGET_DBS = [
    ROOT_DIR / "backend" / "database" / "curriculum.db",
    ROOT_DIR / "backend" / "OfflineTutorAI" / "database" / "curriculum.db",
    ROOT_DIR / "android" / "app" / "src" / "main" / "assets" / "curriculum.db"
]
FRONTEND_EXPORT_PATH = ROOT_DIR / "src" / "data" / "curriculumDatabase.json"


def init_database(conn: sqlite3.Connection):
    """Initializes tables, indexes, and FTS5 virtual table."""
    with open(SCHEMA_SQL, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    conn.executescript(schema_sql)
    conn.commit()
    print("[OK] Schema initialized successfully.")


def import_metadata(conn: sqlite3.Connection):
    """Imports boards, states, classes, and streams."""
    with open(METADATA_JSON, "r", encoding="utf-8") as f:
        meta = json.load(f)

    cur = conn.cursor()

    # Boards
    for b in meta.get("boards", []):
        cur.execute(
            """INSERT OR REPLACE INTO boards (id, code, name, type, description)
               VALUES (?, ?, ?, ?, ?)""",
            (b["id"], b["code"], b["name"], b["type"], b.get("description", ""))
        )

    # States
    for s in meta.get("states", []):
        cur.execute(
            """INSERT OR REPLACE INTO states (id, code, name, name_hi, board_name)
               VALUES (?, ?, ?, ?, ?)""",
            (s["id"], s["code"], s["name"], s.get("name_hi"), s["board_name"])
        )

    # Classes
    for c in meta.get("classes", []):
        cur.execute(
            """INSERT OR REPLACE INTO classes (id, class_level, display_name)
               VALUES (?, ?, ?)""",
            (c["id"], c["class_level"], c["display_name"])
        )

    # Streams
    for st in meta.get("streams", []):
        cur.execute(
            """INSERT OR REPLACE INTO streams (id, code, name, description)
               VALUES (?, ?, ?, ?)""",
            (st["id"], st["code"], st["name"], st.get("description", ""))
        )

    conn.commit()
    print("[OK] Boards, states, classes, and streams imported.")


def import_source_packages(conn: sqlite3.Connection):
    """Imports all JSON package definitions from curriculum/source/."""
    cur = conn.cursor()
    source_files = list(SOURCE_DIR.glob("**/*.json"))
    print(f"Found {len(source_files)} curriculum package definitions in {SOURCE_DIR}")

    imported_subjects = 0
    imported_chapters = 0
    imported_modules = 0
    imported_chunks = 0

    for json_file in source_files:
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                pkg = json.load(f)

            board_id = pkg["board_id"]
            state_id = pkg.get("state_id")
            class_level = pkg["class_level"]
            stream_id = pkg.get("stream_id")
            subj_data = pkg["subject"]
            mod_data = pkg.get("module")
            chapters_data = pkg.get("chapters", [])

            subject_id = f"{board_id}-{class_level}-{subj_data['code']}"
            if state_id:
                subject_id = f"{board_id}-{state_id}-{class_level}-{subj_data['code']}"
            if stream_id:
                subject_id += f"-{stream_id}"

            is_available = 1 if subj_data.get("is_available", True) else 0

            # Insert Subject
            cur.execute(
                """INSERT OR REPLACE INTO subjects
                   (id, board_id, state_id, class_level, stream_id, code, name, name_hi, icon, description, language, is_available)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    subject_id,
                    board_id,
                    state_id,
                    class_level,
                    stream_id,
                    subj_data["code"],
                    subj_data["name"],
                    subj_data.get("name_hi"),
                    subj_data.get("icon", "📚"),
                    subj_data.get("description", ""),
                    subj_data.get("language", "bilingual"),
                    is_available
                )
            )
            imported_subjects += 1

            # Insert Module if present
            module_id = mod_data.get("code", f"{subject_id}_mod") if mod_data else f"{subject_id}_mod"
            if mod_data:
                cur.execute(
                    """INSERT OR REPLACE INTO modules
                       (id, subject_id, chapter_id, code, name, size_mb, version, author, is_installed, is_available)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (
                        module_id,
                        subject_id,
                        None,
                        mod_data["code"],
                        mod_data["name"],
                        mod_data.get("size_mb", 35),
                        mod_data.get("version", "1.0"),
                        mod_data.get("author", "NCERT / National Board"),
                        1 if is_available else 0,
                        is_available
                    )
                )
                imported_modules += 1

            # Insert Chapters & Chunks
            for ch in chapters_data:
                chapter_id = ch.get("id", f"{subject_id}-ch{ch['chapter_number']:02d}")
                ch_avail = 1 if ch.get("is_available", True) else 0

                cur.execute(
                    """INSERT OR REPLACE INTO chapters
                       (id, subject_id, chapter_number, title, title_hi, description, is_available)
                       VALUES (?, ?, ?, ?, ?, ?, ?)""",
                    (
                        chapter_id,
                        subject_id,
                        ch["chapter_number"],
                        ch["title"],
                        ch.get("title_hi"),
                        ch.get("description", ""),
                        ch_avail
                    )
                )
                imported_chapters += 1

                for chunk in ch.get("chunks", []):
                    cur.execute(
                        """INSERT OR REPLACE INTO content_chunks
                           (chunk_id, module_id, chapter_id, subject_id, board_id, state_id, class_level, stream_id, language, topic, content, content_hi, source_page)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                        (
                            chunk["chunk_id"],
                            module_id,
                            chapter_id,
                            subject_id,
                            board_id,
                            state_id,
                            class_level,
                            stream_id,
                            chunk.get("language", "bilingual"),
                            chunk["topic"],
                            chunk["content"],
                            chunk.get("content_hi"),
                            chunk.get("source_page", "NCERT Textbook")
                        )
                    )
                    imported_chunks += 1

            conn.commit()
            print(f"  • Processed: {json_file.name} (board={board_id}, class={class_level}, subject={subj_data['name']})")
        except Exception as e:
            print(f"  ! Error processing {json_file.name}: {e}")

    print(f"[OK] Imported: {imported_subjects} subjects, {imported_chapters} chapters, {imported_modules} modules, {imported_chunks} content chunks.")


def preserve_legacy_class7(conn: sqlite3.Connection):
    """Preserves legacy Class 7 packages and chunks if existing in old DB."""
    old_db = ROOT_DIR / "backend" / "database" / "curriculum.db"
    if not old_db.exists():
        return

    try:
        old_conn = sqlite3.connect(str(old_db))
        old_cur = old_conn.cursor()

        # Check if old curriculum_chunks exists
        old_chunks = old_cur.execute(
            "SELECT curriculum_id, board, class, subject, chapter, topic, content, source_page, chunk_id FROM curriculum_chunks"
        ).fetchall()

        if old_chunks:
            cur = conn.cursor()
            # Also create legacy table in master DB if not exists
            cur.execute("""
                CREATE TABLE IF NOT EXISTS curriculum_chunks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    curriculum_id TEXT NOT NULL,
                    board TEXT NOT NULL,
                    class TEXT NOT NULL,
                    subject TEXT NOT NULL,
                    chapter TEXT NOT NULL,
                    topic TEXT NOT NULL,
                    content TEXT NOT NULL,
                    source_page TEXT NOT NULL,
                    chunk_id TEXT NOT NULL UNIQUE
                )
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS curriculum_packages (
                    id TEXT PRIMARY KEY,
                    board TEXT NOT NULL,
                    class_level TEXT NOT NULL,
                    subject TEXT NOT NULL,
                    name TEXT NOT NULL,
                    version TEXT NOT NULL DEFAULT '1.0',
                    status TEXT NOT NULL DEFAULT 'PUBLISHED',
                    source_file TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            for ch in old_chunks:
                cur.execute(
                    """INSERT OR REPLACE INTO curriculum_chunks 
                       (curriculum_id, board, class, subject, chapter, topic, content, source_page, chunk_id)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    ch
                )

            # Copy packages
            old_pkgs = old_cur.execute("SELECT id, board, class_level, subject, name, version, status, source_file FROM curriculum_packages").fetchall()
            for pkg in old_pkgs:
                cur.execute(
                    """INSERT OR REPLACE INTO curriculum_packages
                       (id, board, class_level, subject, name, version, status, source_file)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                    pkg
                )

            conn.commit()
            print(f"[OK] Preserved {len(old_chunks)} legacy chunks and {len(old_pkgs)} packages.")
        old_conn.close()
    except Exception as e:
        print(f"Note on legacy preservation: {e}")


def verify_fts5_search(conn: sqlite3.Connection):
    """Verifies that FTS5 search functions properly with metadata pre-filtering."""
    cur = conn.cursor()
    # Test FTS5 on 'quadratic'
    results = cur.execute(
        """SELECT c.chunk_id, c.board_id, c.class_level, c.topic, c.content
           FROM content_chunks_fts fts
           JOIN content_chunks c ON c.id = fts.rowid
           WHERE content_chunks_fts MATCH 'quadratic*'
             AND c.board_id = 'cbse'
             AND c.class_level = 10"""
    ).fetchall()

    print(f"[OK] FTS5 Verification: Retrieved {len(results)} chunks for 'quadratic*' in CBSE Class 10:")
    for r in results:
        print(f"   - [{r[0]}] {r[3]}")

    if len(results) == 0:
        raise RuntimeError("FTS5 verification failed: no chunks found for verified CBSE Class 10 math.")


def export_frontend_database(conn: sqlite3.Connection):
    """Exports structured database state to src/data/curriculumDatabase.json for offline React Native."""
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    boards = [dict(r) for r in cur.execute("SELECT * FROM boards").fetchall()]
    states = [dict(r) for r in cur.execute("SELECT * FROM states").fetchall()]
    classes = [dict(r) for r in cur.execute("SELECT * FROM classes").fetchall()]
    streams = [dict(r) for r in cur.execute("SELECT * FROM streams").fetchall()]
    subjects = [dict(r) for r in cur.execute("SELECT * FROM subjects").fetchall()]
    chapters = [dict(r) for r in cur.execute("SELECT * FROM chapters").fetchall()]
    modules = [dict(r) for r in cur.execute("SELECT * FROM modules").fetchall()]
    content_chunks = [dict(r) for r in cur.execute("SELECT * FROM content_chunks").fetchall()]

    payload = {
        "metadata": {
            "version": "1.0.0",
            "database": "curriculum.db",
            "offline_only": True
        },
        "boards": boards,
        "states": states,
        "classes": classes,
        "streams": streams,
        "subjects": subjects,
        "chapters": chapters,
        "modules": modules,
        "content_chunks": content_chunks
    }

    FRONTEND_EXPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(FRONTEND_EXPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
    print(f"[OK] Exported offline frontend database snapshot to {FRONTEND_EXPORT_PATH}")


def distribute_database():
    """Copies curriculum.db to backend and Android assets."""
    for dest in TARGET_DBS:
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(str(MASTER_DB_PATH), str(dest))
        print(f"[OK] Deployed curriculum.db to {dest}")


def main():
    print("==================================================")
    print("   Guru Offline: Curriculum Import Pipeline")
    print("==================================================")
    
    # 1. Connect to master DB
    if MASTER_DB_PATH.exists():
        MASTER_DB_PATH.unlink()

    conn = sqlite3.connect(str(MASTER_DB_PATH))
    try:
        init_database(conn)
        import_metadata(conn)
        import_source_packages(conn)
        preserve_legacy_class7(conn)
        verify_fts5_search(conn)
        export_frontend_database(conn)
    finally:
        conn.close()

    distribute_database()
    print("==================================================")
    print("[OK] Curriculum Database Ingestion & FTS5 Indexing Complete!")
    print("==================================================")


if __name__ == "__main__":
    main()
