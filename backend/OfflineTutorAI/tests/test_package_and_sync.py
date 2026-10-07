"""
Tests J, K, L, N: Versioning, Package Generation, Student Resolution, Offline Service
"""

import unittest
import tempfile
from pathlib import Path
from OfflineTutorAI.admin.curriculum_management.manager import CurriculumManager
from OfflineTutorAI.curriculum.packaging.package_builder import PackageBuilder
from OfflineTutorAI.curriculum.versioning.version_control import CurriculumVersionControl
from OfflineTutorAI.student.services.student_tutor_service import StudentTutorService
from OfflineTutorAI.student.sync.package_sync import StudentPackageSync
from OfflineTutorAI.database.repositories.package_repository import PackageRepository
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository
from OfflineTutorAI.models.chunk_model import CurriculumChunk


class TestPackagingAndSync(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "test_main.db"
        self.packages_dir = Path(self.temp_dir.name) / "packages"
        self.sync_dir = Path(self.temp_dir.name) / "student_sync"

        self.pkg_repo = PackageRepository(db_path=self.db_path)
        self.pkg_repo.initialize_schema()

        self.curr_repo = CurriculumRepository(db_path=self.db_path)
        self.manager = CurriculumManager(package_repo=self.pkg_repo)
        self.builder = PackageBuilder(packages_dir=self.packages_dir, source_db_path=self.db_path)
        self.vc = CurriculumVersionControl(package_repo=self.pkg_repo)
        self.syncer = StudentPackageSync(packages_dir=self.packages_dir, sync_dir=self.sync_dir, manager=self.manager)
        self.student_service = StudentTutorService(package_repo=self.pkg_repo, curriculum_repo=self.curr_repo)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_versioning_increment(self):
        """Test J: Verify version updates."""
        v1 = "1.0"
        v2 = self.vc.increment_minor_version(v1)
        self.assertEqual(v2, "1.1")

    def test_package_building_and_sync(self):
        """Test K, L, N: Package generation, student resolution, offline sync."""
        # 1. Create & Publish Package
        self.manager.register_processing_package(
            curriculum_id="general-class7-science",
            board="General", class_level="Class 7", subject="Science",
            name="Class 7 Science", version="1.0", source_file="class7.pdf"
        )
        c = CurriculumChunk(
            curriculum_id="general-class7-science",
            board="General", class_name="Class 7", subject="Science",
            chapter="Class 7 Science", topic="Biology", content="Photosynthesis explanation.",
            source_page="1", chunk_id="CHK-100"
        )
        self.curr_repo.insert_chunk(c)

        self.manager.mark_ready("general-class7-science")
        self.manager.publish_package("general-class7-science")

        # Test K: Build Package
        pkg_result = self.builder.build_package(
            curriculum_id="general-class7-science",
            board="General", class_level="Class 7", subject="Science",
            name="Class 7 Science", version="1.0", source_file="class7.pdf", chunk_count=1
        )
        self.assertTrue(Path(pkg_result["zip_path"]).exists())
        self.assertTrue(Path(pkg_result["package_folder"]).exists())

        # Test L: Student Profile Resolution
        pkg_resolved = self.student_service.resolve_student_curriculum("General", "Class 7", "Science")
        self.assertEqual(pkg_resolved["id"], "general-class7-science")

        # Test N: Offline Package Sync
        sync_result = self.syncer.sync_curriculum_package("general-class7-science")
        self.assertEqual(sync_result["sync_status"], "SUCCESS")
        self.assertTrue(Path(sync_result["local_path"]).exists())

        # Test N (Offline Tutoring Call): Ask Question without network
        ans = self.student_service.ask_tutor_student(
            student_id="student_999",
            question="What is photosynthesis?",
            board="General",
            class_level="Class 7",
            subject="Science"
        )
        self.assertTrue(ans.safety_status["is_safe"])
        self.assertGreater(len(ans.answer), 0)


if __name__ == "__main__":
    unittest.main()
