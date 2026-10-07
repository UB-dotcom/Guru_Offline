"""
Index Manager

Manages indexing state, schema setup, index rebuilding, and SQLite FTS health checks.
"""

from typing import Dict, Any, Optional
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository


class IndexManager:
    """Handles curriculum database indexing and metadata verification."""

    def __init__(self, repository: Optional[CurriculumRepository] = None):
        self.repository = repository or CurriculumRepository()

    def setup_index(self):
        """Initializes database schema and FTS indexes."""
        self.repository.initialize_schema()

    def rebuild_index(self):
        """Rebuilds FTS virtual table."""
        self.repository.rebuild_fts_index()

    def get_index_stats(self) -> Dict[str, Any]:
        """Returns statistics on the local index."""
        total_chunks = self.repository.count_chunks()
        return {
            "db_path": str(self.repository.db_path),
            "total_chunks": total_chunks,
            "fts_enabled": True
        }
