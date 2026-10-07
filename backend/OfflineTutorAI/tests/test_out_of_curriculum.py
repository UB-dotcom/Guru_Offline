"""
Tests G & M: Out-of-Curriculum Rejection and Follow-Up Question Context
"""

import unittest
import tempfile
from pathlib import Path
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository
from OfflineTutorAI.database.repositories.package_repository import PackageRepository
from OfflineTutorAI.student.services.student_tutor_service import StudentTutorService
from OfflineTutorAI.models.chunk_model import CurriculumChunk


class TestOutofCurriculumAndFollowUp(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "test_student.db"

        self.package_repo = PackageRepository(db_path=self.db_path)
        self.package_repo.initialize_schema()

        self.curriculum_repo = CurriculumRepository(db_path=self.db_path)

        self.package_repo.create_package(
            package_id="general-class7-science",
            board="General", class_level="Class 7", subject="Science",
            name="Class 7 Science", version="1.0", source_file="c7.pdf", status="PUBLISHED"
        )
        chunk = CurriculumChunk(
            curriculum_id="general-class7-science",
            board="General", class_name="Class 7", subject="Science",
            chapter="Class 7 Science Core Curriculum", topic="Biology",
            content="Nutrition in plants involves photosynthesis using sunlight.",
            source_page="1", chunk_id="GEN-7-SCI-001"
        )
        self.curriculum_repo.insert_chunk(chunk)

        self.service = StudentTutorService(
            package_repo=self.package_repo,
            curriculum_repo=self.curriculum_repo
        )

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_out_of_curriculum_rejection(self):
        """Test G: Verify out-of-curriculum rejection message."""
        res = self.service.ask_tutor_student(
            student_id="s1",
            question="What is quantum computing?",
            board="General",
            class_level="Class 7",
            subject="Science"
        )
        self.assertIn("not covered in your selected curriculum", res.answer)

    def test_followup_question_context(self):
        """Test M: Verify follow-up question context resolves to relevant chunk."""
        history = [
            {"role": "user", "content": "What is nutrition in plants?"},
            {"role": "assistant", "content": "Nutrition in plants involves photosynthesis."}
        ]
        # Short follow-up question
        res = self.service.ask_tutor_student(
            student_id="s1",
            question="Why is sunlight needed?",
            board="General",
            class_level="Class 7",
            subject="Science",
            conversation_history=history
        )
        self.assertGreaterEqual(len(res.retrieved_chunks), 1)
        self.assertEqual(res.retrieved_chunks[0].chunk_id, "GEN-7-SCI-001")


if __name__ == "__main__":
    unittest.main()
