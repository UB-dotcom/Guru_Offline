"""
OfflineTutorAI Service Endpoints for React Native Frontend Team

Clean backend service interfaces exposing:
- GET available published curricula
- GET curriculum metadata
- POST register student profile
- GET student's assigned curriculum
- POST tutor question (100% offline)
- GET curriculum version
"""

from typing import List, Dict, Any, Optional
from OfflineTutorAI.admin.curriculum_management.manager import CurriculumManager
from OfflineTutorAI.student.services.student_tutor_service import StudentTutorService
from OfflineTutorAI.student.sync.package_sync import StudentPackageSync


class TutorAPIService:
    """Backend service controller for React Native frontend integration."""

    def __init__(
        self,
        manager: Optional[CurriculumManager] = None,
        student_service: Optional[StudentTutorService] = None,
        syncer: Optional[StudentPackageSync] = None
    ):
        self.manager = manager or CurriculumManager()
        self.student_service = student_service or StudentTutorService()
        self.syncer = syncer or StudentPackageSync(manager=self.manager)

    def get_available_published_curricula(self) -> List[Dict[str, Any]]:
        """GET /api/curricula/published - Lists all published packages available for student sync."""
        return self.manager.list_published_packages()

    def get_curriculum_metadata(self, curriculum_id: str) -> Optional[Dict[str, Any]]:
        """GET /api/curricula/:id - Gets metadata for a specific curriculum package."""
        return self.manager.get_package_info(curriculum_id)

    def register_student_profile(
        self,
        student_id: str,
        name: str,
        board: str,
        class_level: str,
        selected_subjects: List[str],
        language_preference: str = "en"
    ) -> Dict[str, Any]:
        """
        POST /api/student/profile - Registers student profile and resolves assigned curriculum packages.
        """
        resolved_packages = []
        for subj in selected_subjects:
            try:
                pkg = self.student_service.resolve_student_curriculum(board, class_level, subj)
                resolved_packages.append(pkg)
            except ValueError:
                pass

        return {
            "student_id": student_id,
            "name": name,
            "board": board,
            "class_level": class_level,
            "selected_subjects": selected_subjects,
            "resolved_curricula": resolved_packages
        }

    def sync_curriculum(self, curriculum_id: str) -> Dict[str, Any]:
        """POST /api/student/sync - Downloads & installs published package bundle for local offline tutoring."""
        return self.syncer.sync_curriculum_package(curriculum_id)

    def post_tutor_question(
        self,
        student_id: str,
        board: str,
        class_level: str,
        subject: str,
        question: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        POST /api/tutor/ask - Executes 100% offline student tutoring RAG + local SLM inference.
        """
        response = self.student_service.ask_tutor_student(
            student_id=student_id,
            question=question,
            board=board,
            class_level=class_level,
            subject=subject,
            conversation_history=conversation_history,
            language=language
        )
        return response.to_dict()

    def get_curriculum_version(self, curriculum_id: str) -> Dict[str, Any]:
        """GET /api/curricula/:id/version - Returns current published version."""
        pkg = self.manager.get_package_info(curriculum_id)
        if not pkg:
            raise ValueError(f"Package {curriculum_id} not found.")
        return {
            "curriculum_id": curriculum_id,
            "version": pkg["version"],
            "status": pkg["status"],
            "updated_at": pkg["updated_at"]
        }
