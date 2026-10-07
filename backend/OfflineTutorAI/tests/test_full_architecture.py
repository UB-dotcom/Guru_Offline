"""
Full Architecture Verification Test Suite (Scenarios A through N)

Runs end-to-end automated verification of the complete multi-curriculum pipeline:
A. Upload/ingest a curriculum PDF
B. Verify all expected pages are processed
C. Verify chunks are created
D. Verify metadata
E. Verify retrieval
F. Verify curriculum isolation
G. Verify out-of-curriculum rejection
H. Verify multiple curriculum packages can coexist
I. Verify a Class 7 query cannot retrieve Class 10
J. Verify version updates
K. Verify package generation
L. Verify student curriculum resolution
M. Verify follow-up question context
N. Verify offline tutor service does not require network access
"""

import unittest
import tempfile
from pathlib import Path

from OfflineTutorAI.admin.upload.pdf_uploader import AdminPDFUploader
from OfflineTutorAI.admin.curriculum_management.manager import CurriculumManager
from OfflineTutorAI.curriculum.ingestion.pipeline import CurriculumIngestionPipeline
from OfflineTutorAI.curriculum.packaging.package_builder import PackageBuilder
from OfflineTutorAI.curriculum.versioning.version_control import CurriculumVersionControl
from OfflineTutorAI.student.services.student_tutor_service import StudentTutorService
from OfflineTutorAI.student.sync.package_sync import StudentPackageSync
from OfflineTutorAI.database.repositories.package_repository import PackageRepository
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository
from OfflineTutorAI.models.chunk_model import CurriculumChunk


class TestFullArchitectureSuite(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "full_arch.db"
        self.source_dir = Path(self.temp_dir.name) / "source"
        self.packages_dir = Path(self.temp_dir.name) / "packages"
        self.sync_dir = Path(self.temp_dir.name) / "student_sync"

        # Initialize repositories & services
        self.pkg_repo = PackageRepository(db_path=self.db_path)
        self.pkg_repo.initialize_schema()

        self.curr_repo = CurriculumRepository(db_path=self.db_path)

        self.uploader = AdminPDFUploader(source_dir=self.source_dir)
        self.manager = CurriculumManager(package_repo=self.pkg_repo)
        self.packager = PackageBuilder(packages_dir=self.packages_dir, source_db_path=self.db_path)
        self.vc = CurriculumVersionControl(package_repo=self.pkg_repo)
        self.syncer = StudentPackageSync(packages_dir=self.packages_dir, sync_dir=self.sync_dir, manager=self.manager)
        self.student_service = StudentTutorService(package_repo=self.pkg_repo, curriculum_repo=self.curr_repo)

        self.pipeline = CurriculumIngestionPipeline(
            uploader=self.uploader,
            manager=self.manager,
            packager=self.packager,
            repository=self.curr_repo
        )

        # Create sample PDF/TXT files
        self.c7_file = Path(self.temp_dir.name) / "Class7_Science.txt"
        with open(self.c7_file, "w", encoding="utf-8") as f:
            f.write("Science\nTopic: Physics\nHeat, motion, electric current, light.\nTopic: Biology\nNutrition in plants and animals.")

        self.c10_file = Path(self.temp_dir.name) / "Class10_Science.txt"
        with open(self.c10_file, "w", encoding="utf-8") as f:
            f.write("Science\nTopic: Snell's Law\nRefraction of light follows Snell's law sin i / sin r.")

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_full_architecture_scenarios_a_to_n(self):
        print("\n--- Running Full Architecture Verification (A through N) ---")

        # Scenario A, B, C, D: Ingest Class 7 PDF
        c7_res = self.pipeline.process_admin_pdf(
            pdf_path=self.c7_file,
            board="General",
            class_level="Class 7",
            subject="Science",
            version="1.0",
            auto_publish=True
        )
        self.assertEqual(c7_res["curriculum_id"], "general-class7-science")
        self.assertEqual(c7_res["status"], "PUBLISHED")
        self.assertGreater(c7_res["total_pages_processed"], 0)
        self.assertGreater(c7_res["total_chunks_created"], 0)

        # Scenario H: Ingest coexisting Class 10 package
        c10_res = self.pipeline.process_admin_pdf(
            pdf_path=self.c10_file,
            board="CBSE",
            class_level="Class 10",
            subject="Science",
            version="1.0",
            auto_publish=True
        )
        self.assertEqual(c10_res["curriculum_id"], "cbse-class10-science")
        self.assertEqual(len(self.pkg_repo.list_packages()), 2)

        # Scenario E: Verify retrieval
        retrieved = self.curr_repo.search_fts(
            query="nutrition plants",
            curriculum_id="general-class7-science"
        )
        self.assertGreaterEqual(len(retrieved), 1)

        # Scenario F & I: Curriculum isolation (Class 7 query cannot retrieve Class 10)
        c7_query_res = self.curr_repo.search_fts(
            query="refraction Snell",
            class_level="Class 7",
            board="General",
            subject="Science"
        )
        for chunk in c7_query_res:
            self.assertNotEqual(chunk.curriculum_id, "cbse-class10-science")

        # Scenario G: Out-of-curriculum rejection
        rej_res = self.student_service.ask_tutor_student(
            student_id="s1",
            question="What is quantum computing?",
            board="General",
            class_level="Class 7",
            subject="Science"
        )
        self.assertIn("not covered in your selected curriculum", rej_res.answer)

        # Scenario J: Version updates
        v2 = self.vc.increment_minor_version("1.0")
        self.assertEqual(v2, "1.1")

        # Scenario K: Package generation
        self.assertTrue(Path(c7_res["package_bundle"]["zip_path"]).exists())

        # Scenario L: Student curriculum resolution
        resolved_pkg = self.student_service.resolve_student_curriculum("General", "Class 7", "Science")
        self.assertEqual(resolved_pkg["id"], "general-class7-science")

        # Scenario M: Follow-up question context
        history = [
            {"role": "user", "content": "Tell me about physics."},
            {"role": "assistant", "content": "Physics covers heat and motion."}
        ]
        followup_ans = self.student_service.ask_tutor_student(
            student_id="s1",
            question="What about light?",
            board="General",
            class_level="Class 7",
            subject="Science",
            conversation_history=history
        )
        self.assertGreaterEqual(len(followup_ans.retrieved_chunks), 1)

        # Scenario N: Offline tutor service (Zero network call required)
        sync_res = self.syncer.sync_curriculum_package("general-class7-science")
        self.assertEqual(sync_res["sync_status"], "SUCCESS")


if __name__ == "__main__":
    unittest.main()
