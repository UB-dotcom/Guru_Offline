"""
Curriculum Indexer Module

Manages SQLite database ingestion and FTS5 search index building.
"""

from typing import List, Optional
from OfflineTutorAI.models.chunk_model import CurriculumChunk
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository


class CurriculumIndexer:
    """Ingests chunks and maintains SQLite FTS search indexes."""

    def __init__(self, repository: Optional[CurriculumRepository] = None):
        self.repository = repository or CurriculumRepository()

    def index_chunks(self, chunks: List[CurriculumChunk]) -> int:
        """Ingests chunks into database and updates FTS index."""
        if not chunks:
            return 0
        
        self.repository.initialize_schema()
        count = self.repository.insert_chunks_bulk(chunks)
        self.repository.rebuild_fts_index()
        return count
