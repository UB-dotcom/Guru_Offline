"""
Curriculum Package Builder Module

Generates portable, exportable curriculum packages (.zip / folder) containing:
- manifest.json
- metadata.json
- version.json
- curriculum.db (SQLite database subset)
"""

import json
import shutil
import sqlite3
from pathlib import Path
from typing import Dict, Any, Optional
from OfflineTutorAI.config import PACKAGES_DIR, DB_PATH, SCHEMA_PATH


class PackageBuilder:
    """Builds exportable curriculum packages for student offline synchronization."""

    def __init__(self, packages_dir: Optional[Path] = None, source_db_path: Optional[Path] = None):
        self.packages_dir = Path(packages_dir) if packages_dir else PACKAGES_DIR
        self.source_db_path = Path(source_db_path) if source_db_path else DB_PATH
        self.packages_dir.mkdir(parents=True, exist_ok=True)

    def build_package(
        self,
        curriculum_id: str,
        board: str,
        class_level: str,
        subject: str,
        name: str,
        version: str,
        source_file: str,
        chunk_count: int
    ) -> Dict[str, Any]:
        """
        Generates a portable curriculum package folder and ZIP bundle.
        """
        pkg_folder = self.packages_dir / curriculum_id
        if pkg_folder.exists():
            shutil.rmtree(pkg_folder)
        pkg_folder.mkdir(parents=True, exist_ok=True)

        manifest_data = {
            "curriculum_id": curriculum_id,
            "board": board,
            "class_level": class_level,
            "subject": subject,
            "name": name,
            "version": version,
            "status": "PUBLISHED",
            "source_file": source_file,
            "chunk_count": chunk_count
        }

        metadata_data = {
            "title": name,
            "author": "OfflineTutorAI Admin",
            "description": f"Curriculum Package for {board} {class_level} {subject}",
            "created_at": "2026-10-07"
        }

        version_data = {
            "curriculum_id": curriculum_id,
            "version": version,
            "min_app_version": "1.0.0"
        }

        # Write metadata JSON files
        with open(pkg_folder / "manifest.json", "w", encoding="utf-8") as f:
            json.dump(manifest_data, f, indent=2)

        with open(pkg_folder / "metadata.json", "w", encoding="utf-8") as f:
            json.dump(metadata_data, f, indent=2)

        with open(pkg_folder / "version.json", "w", encoding="utf-8") as f:
            json.dump(version_data, f, indent=2)

        # Build local SQLite database inside package folder
        target_db_path = pkg_folder / "curriculum.db"
        self._export_package_sqlite(curriculum_id, target_db_path)

        # Create ZIP bundle
        zip_path = self.packages_dir / f"{curriculum_id}_v{version}.zip"
        shutil.make_archive(str(self.packages_dir / f"{curriculum_id}_v{version}"), 'zip', str(pkg_folder))

        return {
            "curriculum_id": curriculum_id,
            "package_folder": str(pkg_folder),
            "zip_path": str(zip_path),
            "manifest": manifest_data
        }

    def _export_package_sqlite(self, curriculum_id: str, target_db_path: Path):
        """Copies schema and chunks for specific curriculum_id into target_db_path."""
        if target_db_path.exists():
            target_db_path.unlink()

        with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
            schema_sql = f.read()

        # Connect to source and target DBs
        src_conn = sqlite3.connect(str(self.source_db_path))
        src_conn.row_factory = sqlite3.Row
        tgt_conn = sqlite3.connect(str(target_db_path))

        try:
            tgt_conn.executescript(schema_sql)
            tgt_conn.commit()

            # Copy package row
            src_cur = src_conn.cursor()
            src_cur.execute("SELECT * FROM curriculum_packages WHERE id = ?", (curriculum_id,))
            pkg_row = src_cur.fetchone()
            if pkg_row:
                p = dict(pkg_row)
                tgt_conn.execute(
                    "INSERT INTO curriculum_packages (id, board, class_level, subject, name, version, status, source_file) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    (p["id"], p["board"], p["class_level"], p["subject"], p["name"], p["version"], p["status"], p["source_file"])
                )

            # Copy chunks
            src_cur.execute("SELECT * FROM curriculum_chunks WHERE curriculum_id = ?", (curriculum_id,))
            chunk_rows = src_cur.fetchall()
            params = []
            for r in chunk_rows:
                c = dict(r)
                params.append((
                    c["curriculum_id"], c["board"], c["class"], c["subject"],
                    c["chapter"], c["topic"], c["content"], c["source_page"], c["chunk_id"]
                ))

            if params:
                tgt_conn.executemany(
                    "INSERT INTO curriculum_chunks (curriculum_id, board, class, subject, chapter, topic, content, source_page, chunk_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    params
                )
                tgt_conn.commit()

            tgt_conn.execute("INSERT INTO curriculum_chunks_fts(curriculum_chunks_fts) VALUES('rebuild')")
            tgt_conn.commit()
        finally:
            src_conn.close()
            tgt_conn.close()
