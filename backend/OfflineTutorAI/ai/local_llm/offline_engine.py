"""
Local Offline Fallback SLM Engine

Deterministic local SLM engine for offline dev testing when GGUF model binaries are not yet loaded.
Synthesizes structured tutoring responses using retrieved curriculum chunks.
Strictly offline with zero cloud API dependencies.
"""

import re
from typing import Optional
from OfflineTutorAI.ai.local_llm.engine_base import BaseLocalSLMEngine


class LocalOfflineEngine(BaseLocalSLMEngine):
    """Local offline inference engine operating on retrieved context."""

    def is_available(self) -> bool:
        return True

    def generate(
        self,
        prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.3,
        system_prompt: Optional[str] = None
    ) -> str:
        """
        Generates structured educational explanations based strictly on
        the provided curriculum prompt context.
        """
        # Extract user query and curriculum chunks from prompt
        question_match = re.search(r"QUESTION:\s*(.*?)(?=\n\n|\n[A-Z_]+:|$)", prompt, re.DOTALL | re.IGNORECASE)
        question = question_match.group(1).strip() if question_match else "your question"

        # Check if curriculum context exists in prompt
        context_match = re.search(r"CURRICULUM CONTEXT:\s*(.*?)(?=\n\nINSTRUCTIONS:|\n[A-Z_]+:|$)", prompt, re.DOTALL | re.IGNORECASE)
        context_text = context_match.group(1).strip() if context_match else ""

        if not context_text or "No specific curriculum context found" in context_text:
            return (
                f"I couldn't find specific curriculum material covering '{question}' in the offline database. "
                "Please check the topic name or refine your query."
            )

        # Parse extracted chunk headers & content
        chunk_blocks = [b.strip() for b in context_text.split("--- Chunk") if b.strip()]
        
        explanation_parts = []
        explanation_parts.append(f"Based on your curriculum material for **{question}**:\n")

        for idx, block in enumerate(chunk_blocks, 1):
            # Extract content lines
            lines = [line.strip() for line in block.split("\n") if line.strip()]
            header = lines[0] if lines else f"Chunk #{idx}"
            
            # Find content after metadata lines
            body_lines = [l for l in lines if not l.startswith("[") and not l.startswith("---")]
            body_text = " ".join(body_lines) if body_lines else block

            if body_text:
                explanation_parts.append(f"- **Key Point**: {body_text}")

        explanation_parts.append("\nFeel free to ask follow-up questions if you need further clarification on any concept!")

        return "\n".join(explanation_parts)
