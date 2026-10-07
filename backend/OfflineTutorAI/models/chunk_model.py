"""
CurriculumChunk Data Model

Defines the structure for curriculum content chunks used across database,
retrieval (RAG), and prompt building modules.
"""

from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class CurriculumChunk:
    """
    Represents a single curriculum knowledge chunk.
    """
    board: str
    class_name: str
    subject: str
    chapter: str
    topic: str
    content: str
    source_page: str
    chunk_id: str
    curriculum_id: str = "general-class7-science"
    id: Optional[int] = None
    score: Optional[float] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert chunk object to dictionary."""
        return {
            "id": self.id,
            "curriculum_id": self.curriculum_id,
            "board": self.board,
            "class": self.class_name,
            "subject": self.subject,
            "chapter": self.chapter,
            "topic": self.topic,
            "content": self.content,
            "source_page": self.source_page,
            "chunk_id": self.chunk_id,
            "score": self.score
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "CurriculumChunk":
        """Create CurriculumChunk from a dictionary."""
        class_val = data.get("class_name") or data.get("class") or ""
        curr_id = data.get("curriculum_id") or "general-class7-science"
        return cls(
            id=data.get("id"),
            curriculum_id=str(curr_id),
            board=data.get("board", ""),
            class_name=str(class_val),
            subject=data.get("subject", ""),
            chapter=data.get("chapter", ""),
            topic=data.get("topic", ""),
            content=data.get("content", ""),
            source_page=str(data.get("source_page", "")),
            chunk_id=data.get("chunk_id", ""),
            score=data.get("score")
        )
