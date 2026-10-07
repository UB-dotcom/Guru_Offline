"""
Unit tests for CurriculumRepository and SQLite Schema
"""

import os
import unittest
import tempfile
from pathlib import Path
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository
from OfflineTutorAI.models.chunk_model import CurriculumChunk


class TestCurriculumRepository(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "test_curriculum.db"
        self.repo = CurriculumRepository(db_path=self.db_path)
        self.repo.initialize_schema()

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_schema_initialization(self):
        """Test database table creation."""
        self.assertTrue(self.db_path.exists())
        self.assertEqual(self.repo.count_chunks(), 0)

    def test_insert_and_retrieve_chunk(self):
        """Test single chunk insertion and lookup."""
        chunk = CurriculumChunk(
            board="General",
            class_name="Class 7",
            subject="Science",
            chapter="Light",
            topic="Reflection",
            content="Reflection laws...",
            source_page="10",
            chunk_id="TEST-CHUNK-001"
        )
        row_id = self.repo.insert_chunk(chunk)
        self.assertGreater(row_id, 0)
        self.assertEqual(self.repo.count_chunks(), 1)

        retrieved = self.repo.get_chunk_by_id("TEST-CHUNK-001")
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.chapter, "Light")
        self.assertEqual(retrieved.topic, "Reflection")

    def test_bulk_insertion_and_fts_search(self):
        """Test bulk insertion and SQLite FTS search."""
        chunks = [
            CurriculumChunk(
                board="General", class_name="Class 7", subject="Science",
                chapter="Light", topic="Refraction",
                content="Snell's law governs light refraction across different media.",
                source_page="15", chunk_id="TEST-002"
            ),
            CurriculumChunk(
                board="General", class_name="Class 7", subject="Science",
                chapter="Electricity", topic="Ohm's Law",
                content="Voltage equals current multiplied by resistance V = IR.",
                source_page="25", chunk_id="TEST-003"
            )
        ]
        self.repo.insert_chunks_bulk(chunks)
        self.assertEqual(self.repo.count_chunks(), 2)

        results = self.repo.search_fts("Snell's law refraction", class_level="Class 7", board="General")
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0].chunk_id, "TEST-002")


if __name__ == "__main__":
    unittest.main()
