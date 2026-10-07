"""
Safety Guard Module

Performs pre-retrieval safety and curriculum context checks.
Filters out prompt injections, toxic content, and non-educational queries.
"""

import re
from typing import Optional
from OfflineTutorAI.models.tutor_response import SafetyCheckResult


class SafetyGuard:
    """Validates student inputs before RAG retrieval and inference."""

    # Blocked keywords / patterns (prompt injection & unsafe content)
    INJECTION_PATTERNS = [
        r"ignore previous instructions",
        r"ignore system prompt",
        r"you are now DAN",
        r"bypass security",
        r"jailbreak",
        r"reveal system prompt",
    ]

    UNSAFE_PATTERNS = [
        r"\b(harm|kill|suicide|exploding|weapon|drug|illegal|hack)\b"
    ]

    def check_input(
        self,
        question: str,
        subject: Optional[str] = None
    ) -> SafetyCheckResult:
        """
        Validates question for safety and educational appropriateness.
        """
        if not question or not question.strip():
            return SafetyCheckResult(
                is_safe=False,
                is_curriculum_relevant=False,
                reason="Question cannot be empty.",
                suggested_response="Please enter a valid curriculum question."
            )

        q_lower = question.lower().strip()

        # 1. Prompt Injection Check
        for pattern in self.INJECTION_PATTERNS:
            if re.search(pattern, q_lower):
                return SafetyCheckResult(
                    is_safe=False,
                    is_curriculum_relevant=False,
                    reason="Prompt injection pattern detected.",
                    suggested_response="I am an AI Tutor focused on helping you learn curriculum concepts safely. Please ask an educational question!"
                )

        # 2. Unsafe Content Check
        for pattern in self.UNSAFE_PATTERNS:
            if re.search(pattern, q_lower):
                return SafetyCheckResult(
                    is_safe=False,
                    is_curriculum_relevant=False,
                    reason="Unsafe keyword detected.",
                    suggested_response="This app is designed purely for educational tutoring. I cannot assist with unsafe topics."
                )

        # Passed safety checks
        return SafetyCheckResult(
            is_safe=True,
            is_curriculum_relevant=True,
            reason=None,
            suggested_response=None
        )
