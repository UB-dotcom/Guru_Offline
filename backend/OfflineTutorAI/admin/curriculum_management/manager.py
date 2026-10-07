"""
Curriculum Package Manager

Manages package lifecycle status transitions:
PROCESSING -> READY -> PUBLISHED -> ARCHIVED
Handles publishing and triggers package export bundle creation.
"""

from typing import Dict, Any, List, Optional
from OfflineTutorAI.database.repositories.package_repository import PackageRepository


class CurriculumManager:
    """Handles admin curriculum package management and publishing."""

    def __init__(self, package_repo: Optional[PackageRepository] = None):
        self.package_repo = package_repo or PackageRepository()
        self.package_repo.initialize_schema()

    def register_processing_package(
        self,
        curriculum_id: str,
        board: str,
        class_level: str,
        subject: str,
        name: str,
        version: str,
        source_file: str
    ) -> Dict[str, Any]:
        """Registers a package in PROCESSING state."""
        return self.package_repo.create_package(
            package_id=curriculum_id,
            board=board,
            class_level=class_level,
            subject=subject,
            name=name,
            version=version,
            source_file=source_file,
            status="PROCESSING"
        )

    def mark_ready(self, curriculum_id: str) -> bool:
        """Marks a package as READY after successful processing and chunking."""
        return self.package_repo.update_status(curriculum_id, "READY")

    def mark_failed(self, curriculum_id: str) -> bool:
        """Marks a package as FAILED if processing encounters errors."""
        return self.package_repo.update_status(curriculum_id, "FAILED")

    def publish_package(self, curriculum_id: str) -> Dict[str, Any]:
        """
        Publishes a READY package, making it available for student synchronization.
        """
        package = self.package_repo.get_package(curriculum_id)
        if not package:
            raise ValueError(f"Package {curriculum_id} not found.")

        if package["status"] not in ["READY", "PUBLISHED"]:
            raise ValueError(f"Package {curriculum_id} cannot be published from status '{package['status']}'. Must be READY.")

        self.package_repo.update_status(curriculum_id, "PUBLISHED")
        self.package_repo.record_version(curriculum_id, package["version"], "PUBLISHED")

        return self.package_repo.get_package(curriculum_id)

    def get_package_info(self, curriculum_id: str) -> Optional[Dict[str, Any]]:
        """Gets detailed info for a package."""
        return self.package_repo.get_package(curriculum_id)

    def list_all_packages(self) -> List[Dict[str, Any]]:
        """Lists all curriculum packages."""
        return self.package_repo.list_packages()

    def list_published_packages(self) -> List[Dict[str, Any]]:
        """Lists published packages available for sync."""
        return self.package_repo.list_packages(status_filter="PUBLISHED")
