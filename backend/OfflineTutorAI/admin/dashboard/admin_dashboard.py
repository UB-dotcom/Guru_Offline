"""
Admin Dashboard Module

Provides administrative overview metrics, processing status tracking,
and query testing/validation tool for uploaded curriculum packages.
"""

from typing import Dict, Any, List, Optional
from OfflineTutorAI.admin.curriculum_management.manager import CurriculumManager
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository
from OfflineTutorAI.rag.retriever.sqlite_retriever import SQLiteRetriever


class AdminDashboard:
    """Admin dashboard interface for curriculum management and search validation."""

    def __init__(
        self,
        manager: Optional[CurriculumManager] = None,
        repository: Optional[CurriculumRepository] = None
    ):
        self.manager = manager or CurriculumManager()
        self.repository = repository or CurriculumRepository()
        self.retriever = SQLiteRetriever(repository=self.repository)

    def get_system_overview(self) -> Dict[str, Any]:
        """Returns overview of packages, statuses, and chunk statistics."""
        packages = self.manager.list_all_packages()
        stats = self.repository.get_validation_stats()

        return {
            "total_packages": len(packages),
            "packages": packages,
            "validation_stats": stats
        }

    def validate_search(
        self,
        question: str,
        curriculum_id: Optional[str] = None,
        board: Optional[str] = None,
        class_level: Optional[str] = None,
        subject: Optional[str] = None,
        top_k: int = 5
    ) -> Dict[str, Any]:
        """
        Retrieval testing mechanism for admins to verify searchability
        before publishing a curriculum package.
        """
        chunks = self.retriever.retrieve(
            question=question,
            curriculum_id=curriculum_id,
            board=board,
            class_level=class_level,
            subject=subject,
            top_k=top_k
        )

        results = []
        for c in chunks:
            results.append({
                "chunk_id": c.chunk_id,
                "curriculum_id": c.curriculum_id,
                "board": c.board,
                "class": c.class_name,
                "subject": c.subject,
                "chapter": c.chapter,
                "topic": c.topic,
                "source_page": c.source_page,
                "relevance_score": round(c.score or 0.0, 4),
                "content": c.content
            })

        return {
            "question": question,
            "filter_curriculum_id": curriculum_id,
            "filter_board": board,
            "filter_class_level": class_level,
            "filter_subject": subject,
            "total_retrieved": len(results),
            "retrieved_chunks": results
        }
