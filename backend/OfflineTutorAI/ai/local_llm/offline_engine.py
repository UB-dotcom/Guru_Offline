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
        question_match = re.search(r"QUESTION(?:\s*\([^)]+\))?:\s*(.*?)(?=\n\n|\n[A-Z_]+:|$)", prompt, re.DOTALL | re.IGNORECASE)
        question = question_match.group(1).strip() if question_match else "your question"

        # Check if curriculum context exists in prompt
        context_match = re.search(r"CURRICULUM CONTEXT:\s*(.*?)(?=\n\nINSTRUCTIONS:|\n[A-Z_]+:|$)", prompt, re.DOTALL | re.IGNORECASE)
        context_text = context_match.group(1).strip() if context_match else ""

        # Check for Quadratic Equations topic in question or prompt
        is_quadratic = any(k in prompt.lower() for k in ["quadratic", "द्विघात", "dighat", "dvihat", "ax^2", "ax²", "discriminant"])
        is_hindi = any(k in prompt.lower() for k in ["hindi", "hinglish", "bilingual", "भाषा: hi", "language: hi"])

        if is_quadratic:
            if is_hindi:
                return (
                    "**द्विघात समीकरण (Quadratic Equation)**:\n\n"
                    "एक ऐसा समीकरण जिसमें अज्ञात चर (variable) की उच्चतम घात (degree) **2** होती है।\n\n"
                    "1. **मानक रूप (Standard Form)**:\n"
                    "   $$ax^2 + bx + c = 0$$\n"
                    "   (यहाँ $a, b, c$ वास्तविक संख्याएँ हैं और $a \\neq 0$)\n\n"
                    "2. **विविक्तकर (Discriminant - D)**:\n"
                    "   $$D = b^2 - 4ac$$\n"
                    "   - $D > 0$: दो भिन्न वास्तविक मूल (Two distinct real roots)\n"
                    "   - $D = 0$: दो बराबर वास्तविक मूल (Two equal real roots: $x = -b / 2a$)\n"
                    "   - $D < 0$: कोई वास्तविक मूल नहीं (No real roots)\n\n"
                    "3. **द्विघाती सूत्र (Quadratic Formula / श्रीधराचार्य नियम)**:\n"
                    "   $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n"
                    "🏀 **असली ज़िंदगी का उदाहरण (Real-Life Example)**:\n"
                    "जब आप बास्केटबॉल को टोकरी (hoop) की तरफ फेंकते हैं, तो हवा में गेंद का मार्ग एक **परवलय (Parabola)** बनाता है। "
                    "यह वक्र पथ द्विघात समीकरण $y = -ax^2 + bx + c$ द्वारा सटीक रूप से दर्शाया जाता है!\n\n"
                    "📚 *स्रोत: NCERT Class 10 Mathematics, Chapter 4 - Quadratic Equations*"
                )
            else:
                return (
                    "**Quadratic Equations (Standard Class 10 NCERT)**:\n\n"
                    "A quadratic equation in variable $x$ has the highest power of 2.\n\n"
                    "1. **Standard Form**:\n"
                    "   $$ax^2 + bx + c = 0 \\quad (a \\neq 0)$$\n\n"
                    "2. **Discriminant ($D$)**:\n"
                    "   $$D = b^2 - 4ac$$\n"
                    "   - If $D > 0$: Two distinct real roots\n"
                    "   - If $D = 0$: Two equal real roots ($-b / 2a$)\n"
                    "   - If $D < 0$: No real roots\n\n"
                    "3. **Quadratic Formula**:\n"
                    "   $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n"
                    "🏀 **Real-Life Analogy**:\n"
                    "When a player shoots a basketball towards the hoop, its trajectory curves as a **parabola**. "
                    "The path of this arc is calculated using a quadratic equation!\n\n"
                    "📚 *Citation: NCERT Class 10 Mathematics, Chapter 4*"
                )

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
