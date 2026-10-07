"""
OfflineTutorAI Package

Offline-first Android tutoring engine module.
Exposes the main ask_tutor interface function and core data models.
"""

from OfflineTutorAI.service import ask_tutor, TutorService
from OfflineTutorAI.models.chunk_model import CurriculumChunk
from OfflineTutorAI.models.tutor_response import TutorRequest, TutorResponse, SafetyCheckResult

__all__ = [
    "ask_tutor",
    "TutorService",
    "CurriculumChunk",
    "TutorRequest",
    "TutorResponse",
    "SafetyCheckResult"
]
