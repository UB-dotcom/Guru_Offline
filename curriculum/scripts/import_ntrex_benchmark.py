"""
Import NTREX English-Hindi Benchmark Dataset into Guru Offline

Reads NTREX_hi_en_benchmark.zip, creates the `translations` table and FTS5 search index
in curriculum.db, populates all 1,997 English-Hindi parallel sentence pairs,
and synchronizes the database across:
- curriculum/curriculum.db
- android/app/src/main/assets/curriculum.db
- backend/database/curriculum.db
- backend/OfflineTutorAI/database/curriculum.db
- src/data/ntrex_translations.json
"""

import os
import sys
import json
import sqlite3
import shutil
import zipfile
from pathlib import Path

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
ZIP_PATH = Path(r"c:\Users\lenovo\Downloads\NTREX_hi_en_benchmark.zip")
CURRICULUM_DIR = ROOT_DIR / "curriculum"
MASTER_DB = CURRICULUM_DIR / "curriculum.db"
TARGET_DBS = [
    ROOT_DIR / "backend" / "database" / "curriculum.db",
    ROOT_DIR / "backend" / "OfflineTutorAI" / "database" / "curriculum.db",
    ROOT_DIR / "android" / "app" / "src" / "main" / "assets" / "curriculum.db"
]
FRONTEND_JSON_PATH = ROOT_DIR / "src" / "data" / "ntrex_translations.json"


def extract_and_load_pairs():
    print(f"Reading {ZIP_PATH}...")
    with zipfile.ZipFile(ZIP_PATH, 'r') as z:
        raw_data = z.read("NTREX_hi_en_benchmark/data.json").decode("utf-8")
        pairs = json.loads(raw_data)
    print(f"[OK] Loaded {len(pairs)} translation sentence pairs from benchmark.")
    return pairs


def init_translations_table(conn: sqlite3.Connection):
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS translations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_hi TEXT NOT NULL,
            target_en TEXT NOT NULL
        )
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS idx_trans_hi ON translations(source_hi)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_trans_en ON translations(target_en)")

    # Create FTS5 search table
    cur.execute("""
        CREATE VIRTUAL TABLE IF NOT EXISTS translations_fts USING fts5(
            source_hi,
            target_en,
            content='translations',
            content_rowid='id'
        )
    """)

    # Triggers for sync
    cur.execute("""
        CREATE TRIGGER IF NOT EXISTS translations_ai AFTER INSERT ON translations BEGIN
            INSERT INTO translations_fts(rowid, source_hi, target_en)
            VALUES (new.id, new.source_hi, new.target_en);
        END
    """)
    cur.execute("""
        CREATE TRIGGER IF NOT EXISTS translations_ad AFTER DELETE ON translations BEGIN
            INSERT INTO translations_fts(translations_fts, rowid, source_hi, target_en)
            VALUES('delete', old.id, old.source_hi, old.target_en);
        END
    """)
    cur.execute("""
        CREATE TRIGGER IF NOT EXISTS translations_au AFTER UPDATE ON translations BEGIN
            INSERT INTO translations_fts(translations_fts, rowid, source_hi, target_en)
            VALUES('delete', old.id, old.source_hi, old.target_en);
            INSERT INTO translations_fts(rowid, source_hi, target_en)
            VALUES(new.id, new.source_hi, new.target_en);
        END
    """)
    conn.commit()


def populate_translations(conn: sqlite3.Connection, pairs: list):
    cur = conn.cursor()
    cur.execute("DELETE FROM translations")
    try:
        cur.execute("DELETE FROM translations_fts")
    except Exception:
        pass

    rows = []
    for item in pairs:
        hi = item.get("sourceText", "").strip()
        en = item.get("targetText", "").strip()
        if hi and en:
            rows.append((hi, en))

    cur.executemany("INSERT INTO translations (source_hi, target_en) VALUES (?, ?)", rows)
    conn.commit()

    count = cur.execute("SELECT COUNT(*) FROM translations").fetchone()[0]
    fts_count = cur.execute("SELECT COUNT(*) FROM translations_fts").fetchone()[0]
    print(f"[OK] Populated {count} translation pairs, FTS index has {fts_count} records.")


def main():
    if not ZIP_PATH.exists():
        print(f"[ERROR] Zip file not found at {ZIP_PATH}")
        sys.exit(1)

    pairs = extract_and_load_pairs()

    # Save to frontend JSON
    FRONTEND_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(FRONTEND_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(pairs, f, ensure_ascii=False, indent=2)
    print(f"[OK] Saved {len(pairs)} pairs to {FRONTEND_JSON_PATH}")

    # Populate Master DB
    conn = sqlite3.connect(MASTER_DB)
    init_translations_table(conn)
    populate_translations(conn, pairs)
    conn.close()

    # Sync to all target database files
    for target in TARGET_DBS:
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(MASTER_DB, target)
        print(f"[SYNC] Copied master DB with translations to {target}")

    print("\n[SUCCESS] NTREX English-Hindi benchmark dataset successfully integrated!")


if __name__ == "__main__":
    main()
