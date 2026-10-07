"""
Tests F, H, I: Verify Multiple Package Coexistence and Strict Curriculum Isolation
"""

import unittest
import tempfile
from pathlib import Path
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository
from OfflineTutorAI.database.repositories.package_repository import PackageRepository
from OfflineTutorAI.rag.retriever.sqlite_retriever import SQLiteRetriever
from OfflineTutorAI.models.chunk_model import CurriculumChunk


class TestCurriculumIsolation(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "test_isolation.db"

        self.package_repo = PackageRepository(db_path=self.db_path)
        self.package_repo.initialize_schema()

        self.curriculum_repo = CurriculumRepository(db_path=self.db_path)

        # Create Package 1: General Class 7 Science
        self.package_repo.create_package(
            package_id="general-class7-science",
            board="General", class_level="Class 7", subject="Science",
            name="General Class 7 Science", version="1.0", source_file="class7.pdf", status="PUBLISHED"
        )
        c7_chunk = CurriculumChunk(
            curriculum_id="general-class7-science",
            board="General", class_name="Class 7", subject="Science",
            chapter="Class 7 Science Core Curriculum", topic="Biology",
            content="Nutrition in plants and animals, respiration in organisms.",
            source_page="1", chunk_id="GEN-7-SCI-001"
        )

        # Create Package 2: CBSE Class 10 Science
        self.package_repo.create_package(
            package_id="cbse-class10-science",
            board="CBSE", class_level="Class 10", subject="Science",
            name="CBSE Class 10 Science", version="1.0", source_file="class10.pdf", status="PUBLISHED"
        )
        c10_chunk = CurriculumChunk(
            curriculum_id="cbse-class10-science",
            board="CBSE", class_name="Class 10", subject="Science",
            chapter="Light - Reflection and Refraction", topic="Snell's Law",
            content="Light refraction follows Snell's Law sin i / sin r.",
            source_page="171", chunk_id="CBSE-10-SCI-001"
        )

        # Insert both into coexisting database
        self.curriculum_repo.insert_chunks_bulk([c7_chunk, c10_chunk])
        self.retriever = SQLiteRetriever(repository=self.curriculum_repo)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_multiple_packages_coexist(self):
        """Test H: Verify multiple curriculum packages coexist."""
        packages = self.package_repo.list_packages()
        self.assertEqual(len(packages), 2)
        self.assertEqual(self.curriculum_repo.count_chunks(), 2)

    def test_curriculum_id_isolation(self):
        """Test F: Verify retrieval by curriculum_id is strictly isolated."""
        c7_results = self.retriever.retrieve(
            question="refraction light",
            curriculum_id="general-class7-science"
        )
        # Class 10 Snell's Law chunk must NOT be returned when querying Class 7 package id
        for res in c7_results:
            self.assertEqual(res.curriculum_id, "general-class7-science")
            self.assertNotEqual(res.chunk_id, "CBSE-10-SCI-001")

    def test_class7_query_cannot_retrieve_class10(self):
        """Test I: Verify Class 7 metadata query cannot retrieve Class 10 data."""
        results = self.retriever.retrieve(
            question="Snell's Law refraction",
            class_level="Class 7",
            board="General",
            subject="Science"
        )
        for res in results:
            self.assertEqual(res.class_name, "Class 7")
            self.assertEqual(res.board, "General")
            self.assertNotEqual(res.chunk_id, "CBSE-10-SCI-001")


if __name__ == "__main__":
    unittest.main()
