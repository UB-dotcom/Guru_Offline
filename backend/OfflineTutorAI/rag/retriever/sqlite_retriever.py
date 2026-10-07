"""
SQLite Offline Retriever

Executes local curriculum database search without internet or cloud APIs.

Process:
1. Normalize question.
2. Apply mandatory curriculum_id, class_level, board, and subject filters.
3. Search local SQLite curriculum database (FTS5).
4. Rank relevant chunks by BM25 relevance score.
5. Return top relevant chunks containing subject, chapter, topic, source_page, and chunk_id.
"""

import re
from typing import List, Optional, Dict, Any
from OfflineTutorAI.models.chunk_model import CurriculumChunk
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository
from OfflineTutorAI.config import DEFAULT_TOP_K


class SQLiteRetriever:
    """Local RAG retriever backed by SQLite FTS5 with mandatory metadata filters."""

    def __init__(self, repository: Optional[CurriculumRepository] = None):
        self.repository = repository or CurriculumRepository()

    def normalize_question(self, question: str) -> str:
        """
        Normalizes input question string.
        Steps:
        1. Strip whitespace
        2. Lowercase text
        3. Remove special punctuation characters
        """
        if not question:
            return ""
        q = question.strip().lower()
        q_clean = re.sub(r'[^\w\s]', ' ', q)
        q_clean = re.sub(r'\s+', ' ', q_clean).strip()
        return q_clean

    def retrieve(
        self,
        question: Optional[str] = None,
        curriculum_id: Optional[str] = None,
        class_level: Optional[str] = None,
        board: Optional[str] = None,
        subject: Optional[str] = None,
        top_k: int = DEFAULT_TOP_K,
        query: Optional[str] = None
    ) -> List[CurriculumChunk]:
        """
        Retrieves top relevant curriculum chunks for a question.
        Works 100% offline without internet.
        Filters strictly by curriculum_id or (class_level, board, subject).
        
        Args:
            question: Student query string (or query).
            curriculum_id: Specific curriculum_id string.
            class_level: Class level (e.g. 'Class 7').
            board: Board (e.g. 'General').
            subject: Optional subject filter (e.g. 'Science').
            top_k: Maximum chunks to return.
            query: Alias parameter for question.
            
        Returns:
            List of CurriculumChunk objects ranked by relevance score.
        """
        raw_q = question or query
        if not raw_q or not raw_q.strip():
            return []

        normalized_q = self.normalize_question(raw_q)
        if not normalized_q:
            return []

        chunks = self.repository.search_fts(
            query=normalized_q,
            curriculum_id=curriculum_id,
            class_level=class_level,
            board=board,
            subject=subject,
            top_k=top_k
        )
        return chunks


# Global default instance
_retriever_instance = None

def retrieve(
    question: str,
    curriculum_id: Optional[str] = None,
    class_level: Optional[str] = None,
    board: Optional[str] = None,
    subject: Optional[str] = None,
    top_k: int = 5
) -> List[Dict[str, Any]]:
    """
    Standalone test interface matching exact signature requirement:
    retrieve(question, curriculum_id=..., class_level=..., board=..., subject=...)
    
    Returns structured list of dictionaries with scores and metadata.
    """
    global _retriever_instance
    if _retriever_instance is None:
        _retriever_instance = SQLiteRetriever()
        
    chunks = _retriever_instance.retrieve(
        question=question,
        curriculum_id=curriculum_id,
        class_level=class_level,
        board=board,
        subject=subject,
        top_k=top_k
    )

    results = []
    for c in chunks:
        results.append({
            "chunk_id": c.chunk_id,
            "curriculum_id": c.curriculum_id,
            "subject": c.subject,
            "class": c.class_name,
            "board": c.board,
            "chapter": c.chapter,
            "topic": c.topic,
            "source_page": c.source_page,
            "content": c.content,
            "relevance_score": round(c.score or 0.0, 4)
        })

    return results
