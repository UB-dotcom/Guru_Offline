"""
Curriculum Repository

Provides SQLite data access layer for creating database, inserting curriculum chunks,
and executing fast full-text (FTS5) queries for offline RAG retrieval.
Enforces strict metadata filtering for Curriculum ID, Class, Board, and Subject.
"""

import sqlite3
from pathlib import Path
from typing import List, Optional, Dict, Any
from OfflineTutorAI.models.chunk_model import CurriculumChunk
from OfflineTutorAI.config import DB_PATH, SCHEMA_PATH


class CurriculumRepository:
    """SQLite repository for curriculum chunks."""

    def __init__(self, db_path: Optional[Path] = None):
        self.db_path = Path(db_path) if db_path else DB_PATH
        self._ensure_db_dir()

    def _ensure_db_dir(self):
        """Ensure parent directory exists."""
        self.db_path.parent.mkdir(parents=True, exist_ok=True)

    def get_connection(self) -> sqlite3.Connection:
        """Get a configured SQLite database connection."""
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        return conn

    def initialize_schema(self, schema_file: Optional[Path] = None):
        """Execute database schema initialization script."""
        schema_src = Path(schema_file) if schema_file else SCHEMA_PATH
        if not schema_src.exists():
            raise FileNotFoundError(f"Schema file not found at {schema_src}")
        
        with open(schema_src, "r", encoding="utf-8") as f:
            sql_script = f.read()

        conn = self.get_connection()
        try:
            conn.executescript(sql_script)
            conn.commit()
        finally:
            conn.close()

    def insert_chunk(self, chunk: CurriculumChunk) -> int:
        """
        Insert a single curriculum chunk into SQLite.
        Returns the inserted row ID.
        """
        sql = """
        INSERT INTO curriculum_chunks (curriculum_id, board, class, subject, chapter, topic, content, source_page, chunk_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(sql, (
                chunk.curriculum_id,
                chunk.board,
                chunk.class_name,
                chunk.subject,
                chunk.chapter,
                chunk.topic,
                chunk.content,
                chunk.source_page,
                chunk.chunk_id
            ))
            conn.commit()
            return cursor.lastrowid
        finally:
            conn.close()

    def insert_chunks_bulk(self, chunks: List[CurriculumChunk]) -> int:
        """
        Insert a batch of curriculum chunks efficiently using transaction.
        Returns number of inserted records.
        """
        sql = """
        INSERT OR REPLACE INTO curriculum_chunks (curriculum_id, board, class, subject, chapter, topic, content, source_page, chunk_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        params = [
            (
                c.curriculum_id,
                c.board,
                c.class_name,
                c.subject,
                c.chapter,
                c.topic,
                c.content,
                c.source_page,
                c.chunk_id
            )
            for c in chunks
        ]
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            cursor.executemany(sql, params)
            conn.commit()
            return cursor.rowcount
        finally:
            conn.close()

    def delete_chunks_by_curriculum_id(self, curriculum_id: str) -> int:
        """Deletes all chunks belonging to a specific curriculum_id."""
        sql = "DELETE FROM curriculum_chunks WHERE curriculum_id = ?"
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(sql, (curriculum_id,))
            conn.commit()
            count = cursor.rowcount
            self.rebuild_fts_index()
            return count
        finally:
            conn.close()

    def rebuild_fts_index(self):
        """Rebuild FTS5 index tables."""
        conn = self.get_connection()
        try:
            conn.execute("INSERT INTO curriculum_chunks_fts(curriculum_chunks_fts) VALUES('rebuild')")
            conn.commit()
        finally:
            conn.close()

    def get_chunk_by_id(self, chunk_id: str) -> Optional[CurriculumChunk]:
        """Fetch chunk by its unique chunk_id."""
        sql = "SELECT * FROM curriculum_chunks WHERE chunk_id = ?"
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(sql, (chunk_id,))
            row = cursor.fetchone()
            if row:
                return CurriculumChunk.from_dict(dict(row))
            return None
        finally:
            conn.close()

    def search_fts(
        self,
        query: str,
        curriculum_id: Optional[str] = None,
        class_level: Optional[str] = None,
        board: Optional[str] = None,
        subject: Optional[str] = None,
        top_k: int = 5
    ) -> List[CurriculumChunk]:
        """
        Perform BM25 full text search query on FTS5 virtual table with strict metadata filtering.
        If curriculum_id is provided, filters strictly by curriculum_id.
        Otherwise filters by class_level, board, and subject.
        """
        clean_terms = [term.strip('"\'') for term in query.split() if term.strip()]
        if not clean_terms:
            return []
        
        fts_query = " OR ".join([f'"{term}"*' for term in clean_terms])
        chunks = []
        conn = self.get_connection()
        try:
            cursor = conn.cursor()

            # 1. Search modern content_chunks_fts table with strict curriculum isolation
            try:
                modern_sql = """
                SELECT c.id, c.chunk_id, c.board_id as board, 'Class ' || c.class_level as class,
                       c.subject_id as subject, c.chapter_id as chapter, c.topic, c.content,
                       c.source_page, c.module_id as curriculum_id, fts.rank AS bm25_rank
                FROM content_chunks_fts fts
                JOIN content_chunks c ON c.id = fts.rowid
                WHERE content_chunks_fts MATCH ?
                """
                modern_params = [fts_query]
                if board:
                    modern_sql += " AND (c.board_id = ? OR c.board_id LIKE ?)"
                    modern_params.extend([board.lower(), f"%{board.lower()}%"])
                if class_level:
                    digits = ''.join(filter(str.isdigit, str(class_level)))
                    if digits:
                        modern_sql += " AND c.class_level = ?"
                        modern_params.append(int(digits))
                if subject:
                    modern_sql += " AND (c.subject_id LIKE ? OR c.topic LIKE ?)"
                    modern_params.extend([f"%{subject.lower()}%", f"%{subject}%"])

                modern_sql += " ORDER BY fts.rank ASC LIMIT ?"
                modern_params.append(top_k)

                cursor.execute(modern_sql, modern_params)
                rows = cursor.fetchall()
                if rows:
                    for row in rows:
                        row_dict = dict(row)
                        score = abs(float(row_dict.get("bm25_rank", 0.0)))
                        chunk = CurriculumChunk.from_dict(row_dict)
                        chunk.score = score
                        chunks.append(chunk)
                    return chunks
            except Exception:
                pass  # Fall through to legacy table

            # 2. Search legacy curriculum_chunks_fts table
            base_sql = """
            SELECT c.*, fts.rank AS bm25_rank
            FROM curriculum_chunks_fts fts
            JOIN curriculum_chunks c ON c.id = fts.rowid
            WHERE curriculum_chunks_fts MATCH ?
            """
            params = [fts_query]

            if curriculum_id:
                base_sql += " AND c.curriculum_id = ?"
                params.append(curriculum_id)
            else:
                if class_level:
                    base_sql += " AND (c.class = ? OR c.class LIKE ?)"
                    params.extend([class_level, f"%{class_level}%"])
                if board:
                    base_sql += " AND (c.board = ? OR c.board LIKE ?)"
                    params.extend([board, f"%{board}%"])
                if subject:
                    base_sql += " AND (c.subject = ? OR c.subject LIKE ?)"
                    params.extend([subject, f"%{subject}%"])

            base_sql += " ORDER BY fts.rank ASC LIMIT ?"
            params.append(top_k)

            try:
                cursor.execute(base_sql, params)
                rows = cursor.fetchall()
            except sqlite3.OperationalError:
                # Strict metadata fallback if FTS syntax fails
                fallback_sql = """
                SELECT *, 0.0 as bm25_rank FROM curriculum_chunks
                WHERE (content LIKE ? OR topic LIKE ? OR chapter LIKE ?)
                """
                fallback_params = [f"%{query}%", f"%{query}%", f"%{query}%"]
                if curriculum_id:
                    fallback_sql += " AND curriculum_id = ?"
                    fallback_params.append(curriculum_id)
                else:
                    if class_level:
                        fallback_sql += " AND (class = ? OR class LIKE ?)"
                        fallback_params.extend([class_level, f"%{class_level}%"])
                    if board:
                        fallback_sql += " AND (board = ? OR board LIKE ?)"
                        fallback_params.extend([board, f"%{board}%"])
                    if subject:
                        fallback_sql += " AND (subject = ? OR subject LIKE ?)"
                        fallback_params.extend([subject, f"%{subject}%"])

                fallback_sql += " LIMIT ?"
                fallback_params.append(top_k)
                cursor.execute(fallback_sql, fallback_params)
                rows = cursor.fetchall()

            for row in rows:
                row_dict = dict(row)
                score = abs(float(row_dict.get("bm25_rank", 0.0)))
                chunk = CurriculumChunk.from_dict(row_dict)
                chunk.score = score
                chunks.append(chunk)

            return chunks
        finally:
            conn.close()

    def count_chunks(self, curriculum_id: Optional[str] = None) -> int:
        """Count total curriculum chunks stored."""
        sql = "SELECT COUNT(*) FROM curriculum_chunks"
        params = []
        if curriculum_id:
            sql += " WHERE curriculum_id = ?"
            params.append(curriculum_id)
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            return cursor.fetchone()[0]
        finally:
            conn.close()

    def get_validation_stats(self) -> Dict[str, Any]:
        """Returns comprehensive database validation statistics."""
        conn = self.get_connection()
        try:
            c = conn.cursor()
            c.execute("SELECT COUNT(*) FROM curriculum_chunks")
            total_chunks = c.fetchone()[0]

            c.execute("SELECT DISTINCT class FROM curriculum_chunks")
            classes = [r[0] for r in c.fetchall()]

            c.execute("SELECT DISTINCT board FROM curriculum_chunks")
            boards = [r[0] for r in c.fetchall()]

            c.execute("SELECT DISTINCT subject FROM curriculum_chunks")
            subjects = [r[0] for r in c.fetchall()]

            c.execute("SELECT class, COUNT(*) FROM curriculum_chunks GROUP BY class")
            chunks_per_class = {r[0]: r[1] for r in c.fetchall()}

            c.execute("SELECT subject, COUNT(*) FROM curriculum_chunks GROUP BY subject")
            chunks_per_subject = {r[0]: r[1] for r in c.fetchall()}

            return {
                "total_chunks": total_chunks,
                "classes": classes,
                "boards": boards,
                "subjects": subjects,
                "chunks_per_class": chunks_per_class,
                "chunks_per_subject": chunks_per_subject
            }
        finally:
            conn.close()
