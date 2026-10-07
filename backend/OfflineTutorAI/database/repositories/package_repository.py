"""
Package Repository

Data access layer for managing curriculum packages and version history.
"""

import sqlite3
from pathlib import Path
from typing import List, Optional, Dict, Any
from OfflineTutorAI.config import DB_PATH, SCHEMA_PATH


class PackageRepository:
    """SQLite repository for curriculum_packages and curriculum_versions."""

    def __init__(self, db_path: Optional[Path] = None):
        self.db_path = Path(db_path) if db_path else DB_PATH
        self._ensure_db_dir()

    def _ensure_db_dir(self):
        self.db_path.parent.mkdir(parents=True, exist_ok=True)

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        return conn

    def initialize_schema(self):
        """Initializes database schema from schema.sql."""
        if not SCHEMA_PATH.exists():
            return
        with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
            sql_script = f.read()
        conn = self.get_connection()
        try:
            conn.executescript(sql_script)
            conn.commit()
        finally:
            conn.close()

    def create_package(
        self,
        package_id: str,
        board: str,
        class_level: str,
        subject: str,
        name: str,
        version: str,
        source_file: str,
        status: str = "PROCESSING"
    ) -> Dict[str, Any]:
        """Creates or updates a curriculum package record."""
        sql = """
        INSERT INTO curriculum_packages (id, board, class_level, subject, name, version, status, source_file, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
            version=excluded.version,
            status=excluded.status,
            source_file=excluded.source_file,
            updated_at=CURRENT_TIMESTAMP
        """
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(sql, (package_id, board, class_level, subject, name, version, status, source_file))
            conn.commit()
            return self.get_package(package_id)
        finally:
            conn.close()

    def update_status(self, package_id: str, status: str) -> bool:
        """Updates the status of a curriculum package."""
        sql = "UPDATE curriculum_packages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(sql, (status, package_id))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            conn.close()

    def get_package(self, package_id: str) -> Optional[Dict[str, Any]]:
        """Fetches a single package by id."""
        sql = "SELECT * FROM curriculum_packages WHERE id = ?"
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(sql, (package_id,))
            row = cursor.fetchone()
            if row:
                return dict(row)
            return None
        finally:
            conn.close()

    def resolve_package(self, board: str, class_level: str, subject: str) -> Optional[Dict[str, Any]]:
        """
        Resolves a published curriculum package matching board, class_level, subject.
        Prevents matching non-published packages.
        """
        sql = """
        SELECT * FROM curriculum_packages
        WHERE board LIKE ? AND class_level LIKE ? AND subject LIKE ? AND status = 'PUBLISHED'
        ORDER BY updated_at DESC LIMIT 1
        """
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(sql, (f"%{board}%", f"%{class_level}%", f"%{subject}%"))
            row = cursor.fetchone()
            if row:
                return dict(row)
            return None
        finally:
            conn.close()

    def list_packages(self, status_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """Lists packages, optionally filtering by status."""
        sql = "SELECT * FROM curriculum_packages"
        params = []
        if status_filter:
            sql += " WHERE status = ?"
            params.append(status_filter)
        sql += " ORDER BY updated_at DESC"

        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            rows = cursor.fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()

    def record_version(self, package_id: str, version: str, status: str = "PUBLISHED") -> int:
        """Records a version entry in curriculum_versions."""
        sql = """
        INSERT INTO curriculum_versions (curriculum_id, version, status, published_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        """
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(sql, (package_id, version, status))
            conn.commit()
            return cursor.lastrowid
        finally:
            conn.close()

    def get_version_history(self, package_id: str) -> List[Dict[str, Any]]:
        """Returns version history for a package."""
        sql = "SELECT * FROM curriculum_versions WHERE curriculum_id = ? ORDER BY id DESC"
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(sql, (package_id,))
            rows = cursor.fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()
