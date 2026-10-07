"""
Curriculum Version Control Module

Manages curriculum version updates (e.g. v1.0 -> v1.1) and atomic updates.
Ensures active published package is not corrupted during re-processing.
"""

from typing import Dict, Any, Optional
from OfflineTutorAI.database.repositories.package_repository import PackageRepository


class CurriculumVersionControl:
    """Manages versioning and atomic updates for curriculum packages."""

    def __init__(self, package_repo: Optional[PackageRepository] = None):
        self.package_repo = package_repo or PackageRepository()

    def get_current_version(self, curriculum_id: str) -> str:
        """Returns the current active version string for a package."""
        pkg = self.package_repo.get_package(curriculum_id)
        if pkg:
            return pkg.get("version", "1.0")
        return "1.0"

    def increment_minor_version(self, current_version: str) -> str:
        """Increments minor version (e.g., '1.0' -> '1.1')."""
        try:
            parts = current_version.split(".")
            major = int(parts[0])
            minor = int(parts[1]) if len(parts) > 1 else 0
            return f"{major}.{minor + 1}"
        except Exception:
            return "1.1"
