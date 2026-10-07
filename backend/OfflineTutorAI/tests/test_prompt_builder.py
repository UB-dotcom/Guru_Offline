"""
Unit tests for TutorPromptBuilder
"""

import unittest
from OfflineTutorAI.ai.prompt_builder.tutor_prompt_builder import TutorPromptBuilder
from OfflineTutorAI.models.chunk_model import CurriculumChunk


class TestTutorPromptBuilder(unittest.TestCase):

    def setUp(self):
        self.builder = TutorPromptBuilder()

    def test_build_prompt(self):
        chunks = [
            CurriculumChunk(
                board="CBSE", class_name="10", subject="Science",
                chapter="Light", topic="Refraction", content="Sample content",
                source_page="171", chunk_id="CHK-1"
            )
        ]
        history = [{"role": "user", "content": "Hi"}, {"role": "assistant", "content": "Hello!"}]
        
        result = self.builder.build_prompt(
            question="What is refraction?",
            retrieved_chunks=chunks,
            language="en",
            conversation_history=history,
            subject="Science"
        )

        self.assertIn("system_prompt", result)
        self.assertIn("user_prompt", result)
        self.assertIn("CURRICULUM CONTEXT:", result["user_prompt"])
        self.assertIn("Sample content", result["user_prompt"])
        self.assertIn("CONVERSATION HISTORY:", result["user_prompt"])


if __name__ == "__main__":
    unittest.main()
