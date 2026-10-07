"""
Student Package Sync Module

Handles offline synchronization and local storage installation of published curriculum packages.
"""

import shutil
import json
from pathlib import Path
from typing import Dict, Any, Optional
from OfflineTutorAI.config import PACKAGES_DIR, STUDENT_SYNC_DIR
from OfflineTutorAI.admin.curriculum_management.manager import CurriculumManager


class StudentPackageSync:
    """Manages local installation of curriculum package bundles on student devices."""

    def __init__(
        self,
        packages_dir: Optional[Path] = None,
        sync_dir: Optional[Path] = None,
        manager: Optional[CurriculumManager] = None
    ):
        self.packages_dir = Path(packages_dir) if packages_dir else PACKAGES_DIR
        self.sync_dir = Path(sync_dir) if sync_dir else STUDENT_SYNC_DIR
        self.manager = manager or CurriculumManager()
        self.sync_dir.mkdir(parents=True, exist_ok=True)

    def sync_curriculum_package(self, curriculum_id: str) -> Dict[str, Any]:
        """
        Synchronizes a published curriculum package to local student device storage.
        Validates package status before synchronization.
        """
        pkg_info = self.manager.get_package_info(curriculum_id)
        if not pkg_info:
            raise ValueError(f"Curriculum package {curriculum_id} does not exist.")

        if pkg_info["status"] != "PUBLISHED":
            raise ValueError(f"Cannot synchronize package {curriculum_id}: status is '{pkg_info['status']}'. Must be PUBLISHED.")

        source_pkg_folder = self.packages_dir / curriculum_id
        if not source_pkg_folder.exists():
            raise FileNotFoundError(f"Package bundle folder not found at {source_pkg_folder}")

        target_pkg_folder = self.sync_dir / curriculum_id
        if target_pkg_folder.exists():
            shutil.rmtree(target_pkg_folder)

        # Atomic local copy
        shutil.copytree(source_pkg_folder, target_pkg_folder)

        manifest_path = target_pkg_folder / "manifest.json"
        manifest_data = {}
        if manifest_path.exists():
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest_data = json.load(f)

        return {
            "sync_status": "SUCCESS",
            "curriculum_id": curriculum_id,
            "version": pkg_info["version"],
            "local_path": str(target_pkg_folder),
            "manifest": manifest_data
        }

    def get_installed_packages(self) -> List[Dict[str, Any]]:
        """Lists packages currently installed locally on student device."""
        installed = []
        for p_dir in self.sync_dir.iterdir():
            if p_dir.is_dir():
                manifest_file = p_dir / "manifest.json"
                if manifest_file.exists():
                    with open(manifest_file, "r", encoding="utf-8") as f:
                        installed.append(json.load(f))
        return installed
