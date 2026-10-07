"""
API Data Contracts

Data structures for frontend/backend service communication.
Used by React Native frontend developers.
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional


@dataclass
class StudentProfileRequest:
    student_id: str
    name: str
    board: str
    class_level: str
    selected_subjects: List[str]
    language_preference: str = "en"


@dataclass
class TutorQuestionRequestPayload:
    student_id: str
    board: str
    class_level: str
    subject: str
    question: str
    conversation_history: List[Dict[str, str]] = field(default_factory=list)
    language: str = "en"
    curriculum_id: Optional[str] = None


@dataclass
class CurriculumSourceCitation:
    board: str
    class_level: str
    subject: str
    chapter: str
    topic: str
    source_page: str
    chunk_id: str


@dataclass
class TutorQuestionResponsePayload:
    answer: str
    curriculum_id: str
    sources: List[Dict[str, Any]]
    safety_status: Dict[str, Any]
    latency_ms: float
