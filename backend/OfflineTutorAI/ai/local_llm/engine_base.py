"""
Base Local SLM Engine Interface

Abstract base class for all local Small Language Model (SLM) runners.
Ensures strictly local execution without cloud model API dependencies.
"""

from abc import ABC, abstractmethod
from typing import Optional, Dict, Any


class BaseLocalSLMEngine(ABC):
    """Abstract interface for local language model engines."""

    @abstractmethod
    def generate(
        self,
        prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.3,
        system_prompt: Optional[str] = None
    ) -> str:
        """
        Generate text locally from the given prompt.
        
        Args:
            prompt: The full assembled prompt string.
            max_tokens: Maximum response token count.
            temperature: Sampling temperature for local inference.
            system_prompt: Optional system prompt context.
            
        Returns:
            Generated text response string.
        """
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """Check if local model weights/engine are loaded and ready."""
        pass
