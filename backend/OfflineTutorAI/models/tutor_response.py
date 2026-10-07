"""
Tutor Response and Request Data Models

Defines input/output data structures for the ask_tutor interface and safety check module.
"""

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from OfflineTutorAI.models.chunk_model import CurriculumChunk


@dataclass
class SafetyCheckResult:
    """Represents the result of a safety & curriculum check."""
    is_safe: bool
    is_curriculum_relevant: bool
    reason: Optional[str] = None
    suggested_response: Optional[str] = None


@dataclass
class TutorRequest:
    """Input payload for tutor queries."""
    question: str
    subject: Optional[str] = None
    language: str = "en"
    conversation_history: Optional[List[Dict[str, str]]] = field(default_factory=list)
    board: Optional[str] = None
    class_name: Optional[str] = None


@dataclass
class TutorResponse:
    """Structured response object returned by ask_tutor."""
    answer: str
    sources: List[Dict[str, Any]] = field(default_factory=list)
    retrieved_chunks: List[CurriculumChunk] = field(default_factory=list)
    safety_status: Dict[str, Any] = field(default_factory=dict)
    latency_ms: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        """Convert response to dictionary for JSON serialization."""
        return {
            "answer": self.answer,
            "sources": self.sources,
            "retrieved_chunks": [chunk.to_dict() for chunk in self.retrieved_chunks],
            "safety_status": self.safety_status,
            "latency_ms": self.latency_ms
        }
