"""
OfflineTutorAI Service Interface

Main entry point for the offline tutoring module.
Exposes ask_tutor API for React Native or Android client integrations.

Internal Flow:
question
→ curriculum/safety check
→ local retrieval
→ relevant curriculum chunks
→ prompt builder
→ local SLM
→ response processor
→ answer
"""

import time
from typing import List, Optional, Dict, Any

from OfflineTutorAI.models.chunk_model import CurriculumChunk
from OfflineTutorAI.models.tutor_response import TutorResponse, TutorRequest, SafetyCheckResult
from OfflineTutorAI.safety.safety_guard import SafetyGuard
from OfflineTutorAI.rag.retriever.sqlite_retriever import SQLiteRetriever
from OfflineTutorAI.ai.prompt_builder.tutor_prompt_builder import TutorPromptBuilder
from OfflineTutorAI.ai.local_llm.llama_cpp_engine import LlamaCppEngine
from OfflineTutorAI.ai.local_llm.offline_engine import LocalOfflineEngine
from OfflineTutorAI.ai.response_processor.response_processor import ResponseProcessor
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository


class TutorService:
    """Tutor Service class managing offline RAG pipeline execution."""

    def __init__(
        self,
        repository: Optional[CurriculumRepository] = None,
        retriever: Optional[SQLiteRetriever] = None,
        safety_guard: Optional[SafetyGuard] = None,
        prompt_builder: Optional[TutorPromptBuilder] = None,
        slm_engine: Optional[Any] = None,
        response_processor: Optional[ResponseProcessor] = None
    ):
        self.repository = repository or CurriculumRepository()
        self.retriever = retriever or SQLiteRetriever(repository=self.repository)
        self.safety_guard = safety_guard or SafetyGuard()
        self.prompt_builder = prompt_builder or TutorPromptBuilder()
        self.response_processor = response_processor or ResponseProcessor()

        # Initialize SLM engine (Try GGUF LlamaCpp first, fallback to LocalOfflineEngine)
        if slm_engine:
            self.slm_engine = slm_engine
        else:
            llama_engine = LlamaCppEngine()
            if llama_engine.is_available():
                self.slm_engine = llama_engine
            else:
                self.slm_engine = LocalOfflineEngine()

    def ask_tutor(
        self,
        question: str,
        subject: Optional[str] = None,
        language: str = "en",
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> TutorResponse:
        """
        Main API interface for asking tutoring questions offline.
        
        Args:
            question: Student's query string.
            subject: Optional subject filter (e.g. 'Science', 'Physics').
            language: Preferred language code (e.g. 'en', 'hi', 'hinglish').
            conversation_history: List of previous chat turn dicts [{"role": "user"/"assistant", "content": "..."}].
            
        Returns:
            TutorResponse object containing answer text, sources, chunks, and metadata.
        """
        start_time = time.time()

        # Step 1: Curriculum / Safety Check
        safety_result: SafetyCheckResult = self.safety_guard.check_input(question, subject)
        if not safety_result.is_safe:
            elapsed_ms = (time.time() - start_time) * 1000
            return TutorResponse(
                answer=safety_result.suggested_response or "Invalid query.",
                sources=[],
                retrieved_chunks=[],
                safety_status={
                    "is_safe": False,
                    "reason": safety_result.reason
                },
                latency_ms=round(elapsed_ms, 2)
            )

        # Step 2: Local Retrieval
        retrieved_chunks: List[CurriculumChunk] = self.retriever.retrieve(
            query=question,
            subject=subject,
            top_k=3
        )

        # Step 3: Relevant Curriculum Chunks (available in retrieved_chunks)

        # Step 4: Prompt Builder
        prompt_dict = self.prompt_builder.build_prompt(
            question=question,
            retrieved_chunks=retrieved_chunks,
            language=language,
            conversation_history=conversation_history,
            subject=subject
        )

        # Step 5: Local SLM Inference
        raw_slm_output = self.slm_engine.generate(
            prompt=prompt_dict["user_prompt"],
            system_prompt=prompt_dict["system_prompt"],
            max_tokens=512,
            temperature=0.3
        )

        # Step 6: Response Processor
        processed = self.response_processor.process_response(
            raw_text=raw_slm_output,
            retrieved_chunks=retrieved_chunks
        )

        # Step 7: Answer Assembly & Return
        elapsed_ms = (time.time() - start_time) * 1000
        return TutorResponse(
            answer=processed["cleaned_answer"],
            sources=processed["sources"],
            retrieved_chunks=retrieved_chunks,
            safety_status={"is_safe": True, "reason": None},
            latency_ms=round(elapsed_ms, 2)
        )


# Global singleton instance for easy function import
_default_service = None


def ask_tutor(
    question: str,
    subject: Optional[str] = None,
    language: str = "en",
    conversation_history: Optional[List[Dict[str, str]]] = None
) -> Dict[str, Any]:
    """
    Global function interface matching the exact signature requirement:
    ask_tutor(question, subject, language, conversation_history)
    
    Returns a dictionary representation of TutorResponse for easy serialization.
    """
    global _default_service
    if _default_service is None:
        _default_service = TutorService()
        # Initialize DB if empty
        if _default_service.repository.count_chunks() == 0:
            from OfflineTutorAI.scripts.build_db import build_database
            build_database()

    response = _default_service.ask_tutor(
        question=question,
        subject=subject,
        language=language,
        conversation_history=conversation_history
    )
    return response.to_dict()
