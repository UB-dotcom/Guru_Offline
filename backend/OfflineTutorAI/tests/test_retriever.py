"""
Unit tests for SQLiteRetriever
"""

import unittest
import tempfile
from pathlib import Path
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository
from OfflineTutorAI.rag.retriever.sqlite_retriever import SQLiteRetriever
from OfflineTutorAI.models.chunk_model import CurriculumChunk


class TestSQLiteRetriever(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "test_retriever.db"
        self.repo = CurriculumRepository(db_path=self.db_path)
        self.repo.initialize_schema()

        # Seed sample data
        chunks = [
            CurriculumChunk(
                board="General", class_name="Class 7", subject="Science",
                chapter="Light", topic="Refraction",
                content="Snell's Law states ratio of sine of angle of incidence to refraction is constant.",
                source_page="171", chunk_id="RET-001"
            ),
            CurriculumChunk(
                board="General", class_name="Class 7", subject="Mathematics",
                chapter="Polynomials", topic="Quadratic Equations",
                content="Standard quadratic form is ax^2 + bx + c = 0.",
                source_page="45", chunk_id="RET-002"
            )
        ]
        self.repo.insert_chunks_bulk(chunks)
        self.retriever = SQLiteRetriever(repository=self.repo)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_retrieval_query(self):
        results = self.retriever.retrieve(question="Snell's Law", class_level="Class 7", board="General", top_k=2)
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0].chunk_id, "RET-001")

    def test_subject_filter(self):
        results = self.retriever.retrieve(question="quadratic", class_level="Class 7", board="General", subject="Mathematics")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].chunk_id, "RET-002")

        # Wrong subject filter should return empty
        empty_results = self.retriever.retrieve(question="quadratic", class_level="Class 7", board="General", subject="Science")
        self.assertEqual(len(empty_results), 0)


if __name__ == "__main__":
    unittest.main()
