"""
Unit tests for ResponseProcessor
"""

import unittest
from OfflineTutorAI.ai.response_processor.response_processor import ResponseProcessor
from OfflineTutorAI.models.chunk_model import CurriculumChunk


class TestResponseProcessor(unittest.TestCase):

    def setUp(self):
        self.processor = ResponseProcessor()

    def test_response_processing(self):
        chunks = [
            CurriculumChunk(
                board="CBSE", class_name="10", subject="Science",
                chapter="Light", topic="Refraction", content="Content",
                source_page="171", chunk_id="CHK-1"
            )
        ]
        raw_text = "<|system|>Internal Prompt<|end|>\nAnswer: Refraction is bending of light."
        result = self.processor.process_response(raw_text=raw_text, retrieved_chunks=chunks)

        self.assertEqual(result["cleaned_answer"], "Answer: Refraction is bending of light.")
        self.assertEqual(len(result["sources"]), 1)
        self.assertEqual(result["sources"][0]["chapter"], "Light")


if __name__ == "__main__":
    unittest.main()
