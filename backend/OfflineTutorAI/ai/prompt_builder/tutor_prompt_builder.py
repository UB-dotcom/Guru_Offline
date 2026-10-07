"""
Tutor Prompt Builder

Constructs pedagogical, context-grounded system and user prompts
for local SLM inference. Enforces strict curriculum adherence and multi-language support.
"""

from typing import List, Optional, Dict
from OfflineTutorAI.models.chunk_model import CurriculumChunk


class TutorPromptBuilder:
    """Assembles prompt strings for local SLM tutoring."""

    SYSTEM_PROMPT_TEMPLATE = """You are an offline AI Tutor helping a student understand school curriculum.

CRITICAL INSTRUCTIONS:
1. Answer the question using ONLY the provided CURRICULUM CONTEXT.
2. If the context does not contain enough information to fully answer, explain what is covered in the curriculum and politely state that further details are not in the current material.
3. Be clear, encouraging, structured, and easy for a student to understand.
4. Respond in language: {language}.
5. Use bullet points and clear formatting where helpful.
"""

    def build_prompt(
        self,
        question: str,
        retrieved_chunks: List[CurriculumChunk],
        language: str = "en",
        conversation_history: Optional[List[Dict[str, str]]] = None,
        subject: Optional[str] = None
    ) -> Dict[str, str]:
        """
        Builds system prompt and formatted user prompt.
        
        Returns:
            Dict containing 'system_prompt' and 'user_prompt'.
        """
        # Format System Prompt
        system_prompt = self.SYSTEM_PROMPT_TEMPLATE.format(
            language=language.upper() if language else "ENGLISH"
        )

        # Format Curriculum Context
        if retrieved_chunks:
            context_blocks = []
            for i, chunk in enumerate(retrieved_chunks, 1):
                block = (
                    f"--- Chunk #{i} [{chunk.chunk_id}] ---\n"
                    f"Subject: {chunk.subject} | Class: {chunk.class_name} | Board: {chunk.board}\n"
                    f"Chapter: {chunk.chapter} | Topic: {chunk.topic} | Page: {chunk.source_page}\n"
                    f"Content:\n{chunk.content}\n"
                )
                context_blocks.append(block)
            context_str = "\n".join(context_blocks)
        else:
            context_str = "No specific curriculum context found in offline database."

        # Format Conversation History
        history_str = ""
        if conversation_history:
            history_lines = []
            for turn in conversation_history[-3:]:  # Keep last 3 turns
                role = turn.get("role", "user").capitalize()
                content = turn.get("content", "")
                history_lines.append(f"{role}: {content}")
            if history_lines:
                history_str = "CONVERSATION HISTORY:\n" + "\n".join(history_lines) + "\n\n"

        # Assemble Final User Prompt
        subject_str = f" (Subject: {subject})" if subject else ""
        user_prompt = (
            f"{history_str}"
            f"CURRICULUM CONTEXT:\n{context_str}\n\n"
            f"INSTRUCTIONS:\nAnswer the student's question based ONLY on the above curriculum context.\n\n"
            f"QUESTION{subject_str}: {question}"
        )

        return {
            "system_prompt": system_prompt,
            "user_prompt": user_prompt
        }
