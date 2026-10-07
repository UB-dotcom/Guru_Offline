"""
Curriculum Database Inspection & Diagnosis Script
"""

import sqlite3
import json
from pathlib import Path

def inspect():
    db_paths = [
        Path('database/curriculum.db'),
        Path('OfflineTutorAI/database/curriculum.db')
    ]

    print("======================================================================")
    print("                CURRICULUM DATABASE DIAGNOSTIC REPORT                ")
    print("======================================================================")

    # 1. Inspect Files/PDFs in curriculum directories
    source_files = list(Path('.').glob('**/curriculum/source/*'))
    processed_files = list(Path('.').glob('**/curriculum/processed/*'))
    chunks_files = list(Path('.').glob('**/curriculum/chunks/*'))

    print("\n--- 1. FILES PRESENT IN CURRICULUM DIRECTORIES ---")
    print("Source Files:")
    for f in source_files:
        print(f"  - {f} (size: {f.stat().st_size} bytes)")

    print("\nProcessed Files:")
    for f in processed_files:
        print(f"  - {f}")

    print("\nChunk Files:")
    for f in chunks_files:
        print(f"  - {f}")

    # 2. Inspect Database Contents
    for db in db_paths:
        print(f"\n======================================================================")
        print(f"DATABASE FILE: {db.resolve()}")
        print(f"======================================================================")
        if not db.exists():
            print("  [File does not exist!]")
            continue

        conn = sqlite3.connect(str(db))
        conn.row_factory = sqlite3.Row
        c = conn.cursor()

        # Total Chunks
        c.execute("SELECT COUNT(*) FROM curriculum_chunks")
        total_chunks = c.fetchone()[0]

        # Distinct Classes
        c.execute("SELECT DISTINCT class FROM curriculum_chunks")
        classes = [r[0] for r in c.fetchall()]

        # Distinct Boards
        c.execute("SELECT DISTINCT board FROM curriculum_chunks")
        boards = [r[0] for r in c.fetchall()]

        # Distinct Subjects
        c.execute("SELECT DISTINCT subject FROM curriculum_chunks")
        subjects = [r[0] for r in c.fetchall()]

        # Count per Class
        c.execute("SELECT class, COUNT(*) FROM curriculum_chunks GROUP BY class")
        class_counts = {r[0]: r[1] for r in c.fetchall()}

        print(f"Total Chunks        : {total_chunks}")
        print(f"Number of Classes   : {len(classes)}")
        print(f"Class Values        : {classes}")
        print(f"Board Values        : {boards}")
        print(f"Subject Values      : {subjects}")
        print(f"Chunks Per Class    : {class_counts}")

        # Detail of All Chunks
        print("\n--- ALL STORED CHUNKS BREAKDOWN ---")
        c.execute("SELECT id, chunk_id, board, class, subject, chapter, topic, source_page FROM curriculum_chunks ORDER BY id ASC")
        rows = c.fetchall()
        for r in rows:
            print(f"  Row {r['id']:02d} | Class: {r['class']:<10} | Board: {r['board']:<8} | Subject: {r['subject']:<22} | Chunk ID: {r['chunk_id']:<25} | Chapter: {r['chapter']}")

        conn.close()

if __name__ == "__main__":
    inspect()
