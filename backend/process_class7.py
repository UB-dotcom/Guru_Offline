"""
Class 7 Curriculum PDF Processor & DB Ingestion Script

Extracts text page-by-page from Class7_Curriculum.pdf, cleans text,
segments into subjects, topics, and chapters, produces curriculum.json,
and populates SQLite database with package registration.
"""

import sys
import json
import re
import sqlite3
from pathlib import Path
from typing import List, Dict, Any

import pypdf

# Define Base Paths
WORKSPACE_DIR = Path(__file__).resolve().parent
MODULE_DIR = WORKSPACE_DIR / "OfflineTutorAI"

PDF_PATH = MODULE_DIR / "curriculum" / "source" / "Class7_Curriculum.pdf"
if not PDF_PATH.exists():
    PDF_PATH = WORKSPACE_DIR / "curriculum" / "source" / "Class7_Curriculum.pdf"

PROCESSED_JSON_PATHS = [
    MODULE_DIR / "curriculum" / "processed" / "curriculum.json",
    WORKSPACE_DIR / "curriculum" / "processed" / "curriculum.json"
]

DB_PATHS = [
    MODULE_DIR / "database" / "curriculum.db",
    WORKSPACE_DIR / "database" / "curriculum.db"
]

SCHEMA_PATH = MODULE_DIR / "database" / "schema" / "schema.sql"


def inspect_pdf_text_type(pdf_file: Path) -> Dict[str, Any]:
    """Inspects PDF to determine text extractability and quality."""
    reader = pypdf.PdfReader(str(pdf_file))
    total_pages = len(reader.pages)
    page_stats = []
    has_selectable_text = True
    extraction_errors = []
    empty_pages = []

    for i, page in enumerate(reader.pages, start=1):
        try:
            text = page.extract_text() or ""
            text_len = len(text.strip())
            if text_len == 0:
                empty_pages.append(i)
                has_selectable_text = False
            page_stats.append({
                "page": i,
                "length": text_len,
                "text": text
            })
        except Exception as e:
            extraction_errors.append(f"Page {i}: {str(e)}")

    return {
        "pdf_name": pdf_file.name,
        "total_pages": total_pages,
        "has_selectable_text": has_selectable_text and len(empty_pages) == 0,
        "page_stats": page_stats,
        "empty_pages": empty_pages,
        "extraction_errors": extraction_errors
    }


def clean_str(s: str) -> str:
    """Removes invisible control characters and leading bullet characters."""
    if not s:
        return ""
    s = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', s)
    s = re.sub(r'^[•\-\*\s]+', '', s)
    return s.strip()


def parse_and_chunk_class7(page_stats: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Parses cleaned page text into structured curriculum chunks.
    Preserves subject, chapter, topic, page number, and content.
    """
    chunks = []
    current_subject = None
    chunk_counter = 1

    subject_headers = [
        "Mathematics",
        "Science",
        "Language Arts / English",
        "Social Studies"
    ]

    for p in page_stats:
        page_num = p["page"]
        text = p["text"]
        lines = [line.rstrip() for line in text.split("\n") if line.strip()]

        for line in lines:
            line_str = clean_str(line)

            if not line_str:
                continue

            if "General Curriculum Framework" in line_str or "This document outlines" in line_str:
                continue

            if line_str.startswith("Core Topics & Objectives for"):
                continue

            matched_subj = None
            for subj in subject_headers:
                if line_str == subj or line_str.startswith(subj):
                    matched_subj = subj
                    break

            if matched_subj:
                current_subject = matched_subj
                continue

            if current_subject and ":" in line_str:
                parts = line_str.split(":", 1)
                topic_title = clean_str(parts[0])
                content_desc = clean_str(parts[1])

                chapter_name = f"Class 7 {current_subject} Core Curriculum"
                subj_code = current_subject[:3].upper().replace(" ", "")
                curr_id = f"general-class7-{current_subject.lower().replace(' ', '').replace('/', '')}"
                chunk_id = f"GEN-7-{subj_code}-CH01-TP{chunk_counter:02d}-001"
                chunk_counter += 1

                chunks.append({
                    "curriculum_id": curr_id,
                    "board": "General",
                    "class": "Class 7",
                    "subject": current_subject,
                    "chapter": chapter_name,
                    "topic": topic_title,
                    "content": content_desc,
                    "source_page": str(page_num),
                    "chunk_id": chunk_id
                })
            elif current_subject and len(chunks) > 0 and not line_str.startswith("Core Topics"):
                chunks[-1]["content"] += " " + line_str

    for c in chunks:
        c["content"] = re.sub(r'\s+', ' ', c["content"]).strip()

    return chunks


def save_curriculum_json(chunks: List[Dict[str, Any]], paths: List[Path]):
    """Saves structured curriculum chunks to JSON files."""
    payload = {
        "metadata": {
            "title": "Class 7 General Curriculum Framework",
            "source": "Class7_Curriculum.pdf",
            "total_chunks": len(chunks)
        },
        "chunks": chunks
    }
    for p in paths:
        p.parent.mkdir(parents=True, exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)
        print(f"[Process Class 7] Saved curriculum JSON to {p}")


def populate_sqlite_database(chunks: List[Dict[str, Any]], db_paths: List[Path], schema_path: Path):
    """Initializes schema and populates SQLite curriculum database after clearing existing tables."""
    with open(schema_path, "r", encoding="utf-8") as f:
        schema_sql = f.read()

    for db_path in db_paths:
        db_path.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(str(db_path))
        try:
            conn.execute("DROP TABLE IF EXISTS curriculum_chunks_fts")
            conn.execute("DROP TABLE IF EXISTS curriculum_chunks")
            conn.execute("DROP TABLE IF EXISTS curriculum_versions")
            conn.execute("DROP TABLE IF EXISTS curriculum_packages")
            conn.commit()

            conn.executescript(schema_sql)
            conn.commit()

            # Insert registered packages
            packages = {}
            for c in chunks:
                cid = c["curriculum_id"]
                if cid not in packages:
                    packages[cid] = (cid, c["board"], c["class"], c["subject"], f"{c['board']} {c['class']} {c['subject']}", "1.0", "PUBLISHED", "Class7_Curriculum.pdf")

            pkg_sql = """
            INSERT INTO curriculum_packages (id, board, class_level, subject, name, version, status, source_file)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """
            conn.executemany(pkg_sql, list(packages.values()))

            # Insert chunks
            insert_sql = """
            INSERT INTO curriculum_chunks (curriculum_id, board, class, subject, chapter, topic, content, source_page, chunk_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            params = [
                (
                    c["curriculum_id"],
                    c["board"],
                    c["class"],
                    c["subject"],
                    c["chapter"],
                    c["topic"],
                    c["content"],
                    c["source_page"],
                    c["chunk_id"]
                )
                for c in chunks
            ]
            cursor = conn.cursor()
            cursor.executemany(insert_sql, params)
            conn.commit()

            conn.execute("INSERT INTO curriculum_chunks_fts(curriculum_chunks_fts) VALUES('rebuild')")
            conn.commit()
            print(f"[Process Class 7] Populated SQLite DB at {db_path} with {len(chunks)} chunks.")
        finally:
            conn.close()


def run_pipeline():
    print(f"[Process Class 7] Inspecting PDF at {PDF_PATH}...")
    inspection = inspect_pdf_text_type(PDF_PATH)

    print("\n--- PDF Inspection Report ---")
    print(f"File Name           : {inspection['pdf_name']}")
    print(f"Total Pages         : {inspection['total_pages']}")
    print(f"Selectable Text     : {'YES' if inspection['has_selectable_text'] else 'NO (Scanned)'}")
    print(f"Empty Pages         : {inspection['empty_pages']}")
    print(f"Extraction Errors   : {inspection['extraction_errors']}")

    if not inspection['has_selectable_text'] or inspection['extraction_errors']:
        print("[ERROR] Extraction problems detected! Stopping pipeline.")
        sys.exit(1)

    print("\n[Process Class 7] Extracting and chunking curriculum content...")
    chunks = parse_and_chunk_class7(inspection["page_stats"])

    print(f"[Process Class 7] Extracted {len(chunks)} educational chunks.")

    save_curriculum_json(chunks, PROCESSED_JSON_PATHS)
    populate_sqlite_database(chunks, DB_PATHS, SCHEMA_PATH)

    subjects = sorted(list(set(c["subject"] for c in chunks)))
    chapters_by_subject = {}
    for c in chunks:
        subj = c["subject"]
        chap = c["chapter"]
        if subj not in chapters_by_subject:
            chapters_by_subject[subj] = set()
        chapters_by_subject[subj].add(chap)

    page_numbers = [int(c["source_page"]) for c in chunks if c["source_page"].isdigit()]
    min_page = min(page_numbers) if page_numbers else 1
    max_page = max(page_numbers) if page_numbers else inspection['total_pages']

    print("\n==================================================")
    print("           VERIFICATION REPORT SUMMARY            ")
    print("==================================================")
    print(f"Number of Subjects       : {len(subjects)} ({', '.join(subjects)})")
    print("Chapters per Subject     :")
    for s, chaps in chapters_by_subject.items():
        print(f"  - {s}: {len(chaps)} chapter(s) -> {list(chaps)}")
    print(f"Number of Chunks         : {len(chunks)}")
    print(f"Page Range               : Page {min_page} to Page {max_page}")
    print(f"Extraction Errors        : None ({len(inspection['extraction_errors'])})")
    print(f"Empty/Poor-Quality Pages : None ({len(inspection['empty_pages'])})")
    print("==================================================")


if __name__ == "__main__":
    run_pipeline()
