"""
Unit tests for TextChunker
"""

import unittest
from OfflineTutorAI.rag.chunker.text_chunker import TextChunker


class TestTextChunker(unittest.TestCase):

    def setUp(self):
        self.chunker = TextChunker(target_chunk_size=100, overlap=20)

    def test_chunking_section(self):
        text = "Paragraph one with some detailed information.\n\nParagraph two with additional curriculum context."
        chunks = self.chunker.chunk_section(
            text=text,
            board="CBSE",
            class_name="Class 10",
            subject="Science",
            chapter="Chapter 1",
            topic="Topic 1",
            source_page="5"
        )
        self.assertGreaterEqual(len(chunks), 1)
        self.assertEqual(chunks[0].board, "CBSE")
        self.assertEqual(chunks[0].subject, "Science")
        self.assertEqual(chunks[0].source_page, "5")
        self.assertTrue(chunks[0].chunk_id.startswith("CBSE-Class10-SCI-CHK-"))


if __name__ == "__main__":
    unittest.main()
