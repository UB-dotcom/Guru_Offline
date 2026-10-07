"""
Student Tutor Service Module

Handles student profile resolution (Board + Class + Subject -> curriculum_id)
and executes the 100% offline student tutoring pipeline with conversational follow-up support.

Student Question Flow:
Student registers / selects academic profile
↓
Backend resolves curriculum package (curriculum_id)
↓
Student asks question
↓
Curriculum guard
↓
Retrieve relevant chunks (strictly filtered by curriculum_id)
↓
Prompt builder (incorporating conversation history & follow-ups)
↓
Local SLM (LlamaCppEngine / LocalOfflineEngine)
↓
Response processor
↓
Answer
"""

import time
from typing import List, Dict, Any, Optional

from OfflineTutorAI.models.chunk_model import CurriculumChunk
from OfflineTutorAI.models.tutor_response import TutorResponse, SafetyCheckResult
from OfflineTutorAI.safety.safety_guard import SafetyGuard
from OfflineTutorAI.rag.retriever.sqlite_retriever import SQLiteRetriever
from OfflineTutorAI.ai.prompt_builder.tutor_prompt_builder import TutorPromptBuilder
from OfflineTutorAI.ai.local_llm.llama_cpp_engine import LlamaCppEngine
from OfflineTutorAI.ai.local_llm.offline_engine import LocalOfflineEngine
from OfflineTutorAI.ai.response_processor.response_processor import ResponseProcessor
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository
from OfflineTutorAI.database.repositories.package_repository import PackageRepository


class StudentTutorService:
    """Offline Student Tutor Service resolving curriculum identity and running local RAG SLM pipeline."""

    def __init__(
        self,
        package_repo: Optional[PackageRepository] = None,
        curriculum_repo: Optional[CurriculumRepository] = None,
        retriever: Optional[SQLiteRetriever] = None,
        safety_guard: Optional[SafetyGuard] = None,
        prompt_builder: Optional[TutorPromptBuilder] = None,
        slm_engine: Optional[Any] = None,
        response_processor: Optional[ResponseProcessor] = None
    ):
        self.package_repo = package_repo or PackageRepository()
        self.curriculum_repo = curriculum_repo or CurriculumRepository()
        self.retriever = retriever or SQLiteRetriever(repository=self.curriculum_repo)
        self.safety_guard = safety_guard or SafetyGuard()
        self.prompt_builder = prompt_builder or TutorPromptBuilder()
        self.response_processor = response_processor or ResponseProcessor()

        # Local SLM Selection (GGUF LlamaCpp first, fallback to LocalOfflineEngine)
        if slm_engine:
            self.slm_engine = slm_engine
        else:
            llama = LlamaCppEngine()
            self.slm_engine = llama if llama.is_available() else LocalOfflineEngine()

    def resolve_student_curriculum(
        self,
        board: str,
        class_level: str,
        subject: str
    ) -> Dict[str, Any]:
        """
        Resolves a student's academic profile (Board, Class, Subject) to a published curriculum_id.
        Validates that the package exists and is PUBLISHED.
        """
        package = self.package_repo.resolve_package(board, class_level, subject)
        if not package:
            raise ValueError(
                f"No published curriculum package found for Board: '{board}', Class: '{class_level}', Subject: '{subject}'."
            )
        return package

    def ask_tutor_student(
        self,
        student_id: str,
        question: str,
        board: str,
        class_level: str,
        subject: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        language: str = "en"
    ) -> TutorResponse:
        """
        Main Student Tutoring Entry Point.
        100% Offline execution.
        """
        start_time = time.time()

        # Step 1: Resolve Curriculum Package Identity
        try:
            package = self.resolve_student_curriculum(board, class_level, subject)
            curriculum_id = package["id"]
        except ValueError as e:
            elapsed_ms = (time.time() - start_time) * 1000
            return TutorResponse(
                answer=f"This topic is not covered in your selected curriculum ({board} {class_level} {subject}). I can help you with topics from your published syllabus.",
                sources=[],
                retrieved_chunks=[],
                safety_status={"is_safe": True, "reason": str(e)},
                latency_ms=round(elapsed_ms, 2)
            )

        # Step 2: Curriculum / Safety Guard
        safety_res: SafetyCheckResult = self.safety_guard.check_input(question, subject)
        if not safety_res.is_safe:
            elapsed_ms = (time.time() - start_time) * 1000
            return TutorResponse(
                answer=safety_res.suggested_response or "Invalid input.",
                sources=[],
                retrieved_chunks=[],
                safety_status={"is_safe": False, "reason": safety_res.reason},
                latency_ms=round(elapsed_ms, 2)
            )

        # Step 3: Local Retrieval strictly filtered by curriculum_id
        # Handle follow-up query expansion if conversation history exists
        search_query = question
        if conversation_history and len(conversation_history) > 0:
            last_turn = conversation_history[-1].get("content", "")
            if len(question.split()) < 5:  # Short follow-up question
                search_query = f"{last_turn} {question}"

        retrieved_chunks: List[CurriculumChunk] = self.retriever.retrieve(
            question=search_query,
            curriculum_id=curriculum_id,
            top_k=3
        )

        # Out-of-Curriculum Check
        if not retrieved_chunks:
            elapsed_ms = (time.time() - start_time) * 1000
            return TutorResponse(
                answer="This topic is not covered in your selected curriculum. I can help you with topics from your current syllabus.",
                sources=[],
                retrieved_chunks=[],
                safety_status={"is_safe": True, "reason": "No matching chunks in selected curriculum"},
                latency_ms=round(elapsed_ms, 2)
            )

        # Step 4: Prompt Builder with follow-up context
        prompt_dict = self.prompt_builder.build_prompt(
            question=question,
            retrieved_chunks=retrieved_chunks,
            language=language,
            conversation_history=conversation_history,
            subject=subject
        )

        # Step 5: Local SLM Generation (100% Offline)
        raw_output = self.slm_engine.generate(
            prompt=prompt_dict["user_prompt"],
            system_prompt=prompt_dict["system_prompt"],
            max_tokens=512,
            temperature=0.3
        )

        # Step 6: Response Processor & Citation Formatting
        processed = self.response_processor.process_response(
            raw_text=raw_output,
            retrieved_chunks=retrieved_chunks
        )

        elapsed_ms = (time.time() - start_time) * 1000
        return TutorResponse(
            answer=processed["cleaned_answer"],
            sources=processed["sources"],
            retrieved_chunks=retrieved_chunks,
            safety_status={"is_safe": True, "reason": None},
            latency_ms=round(elapsed_ms, 2)
        )
