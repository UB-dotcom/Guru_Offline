"""
Tests B, C, D: Verify Page Processing, Chunk Creation, and Metadata Attachment
"""

import unittest
import tempfile
from pathlib import Path
from OfflineTutorAI.curriculum.extraction.pdf_extractor import PDFExtractor
from OfflineTutorAI.curriculum.cleaning.text_cleaner import TextCleaner
from OfflineTutorAI.curriculum.chunking.semantic_chunker import SemanticChunker


class TestExtractionAndChunking(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.sample_file = Path(self.temp_dir.name) / "test_doc.txt"
        with open(self.sample_file, "w", encoding="utf-8") as f:
            f.write("Science\nTopic: Physics\nHeat, motion and time, electric current.")

        self.extractor = PDFExtractor()
        self.cleaner = TextCleaner()
        self.chunker = SemanticChunker()

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_pages_extraction_and_chunk_metadata(self):
        # Test B: Extract Pages
        raw_pages = self.extractor.extract_text(self.sample_file)
        self.assertEqual(len(raw_pages), 1)
        self.assertEqual(raw_pages[0]["page"], 1)

        # Test C & D: Clean & Chunk with Metadata
        cleaned = self.cleaner.clean_pages(raw_pages)
        chunks = self.chunker.chunk_curriculum(
            cleaned_pages=cleaned,
            curriculum_id="general-class7-science",
            board="General",
            class_level="Class 7",
            subject="Science",
            version="1.0",
            source_file="test_doc.txt"
        )
        self.assertGreaterEqual(len(chunks), 1)
        c = chunks[0]
        self.assertEqual(c.curriculum_id, "general-class7-science")
        self.assertEqual(c.board, "General")
        self.assertEqual(c.class_name, "Class 7")
        self.assertEqual(c.subject, "Science")
        self.assertEqual(c.topic, "Physics")


if __name__ == "__main__":
    unittest.main()
