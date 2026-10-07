"""
LlamaCpp Engine Implementation

Local SLM runner using llama-cpp-python for GGUF model files (e.g. Phi-3, Llama-3.2, Qwen2.5, Gemma).
Runs 100% offline on CPU/NPU without internet calls.
"""

from pathlib import Path
from typing import Optional
from OfflineTutorAI.ai.local_llm.engine_base import BaseLocalSLMEngine
from OfflineTutorAI.config import DEFAULT_MODEL_PATH


class LlamaCppEngine(BaseLocalSLMEngine):
    """Local SLM runner powered by llama-cpp-python."""

    def __init__(self, model_path: Optional[Path] = None):
        self.model_path = Path(model_path) if model_path else DEFAULT_MODEL_PATH
        self._llm = None
        self._initialized = False
        self._load_model_if_exists()

    def _load_model_if_exists(self):
        """Attempt to load GGUF model if file exists and llama_cpp is installed."""
        if not self.model_path.exists():
            return
        
        try:
            from llama_cpp import Llama
            self._llm = Llama(
                model_path=str(self.model_path),
                n_ctx=2048,
                n_threads=4,
                verbose=False
            )
            self._initialized = True
        except ImportError:
            # llama_cpp python library not installed in environment
            pass
        except Exception:
            pass

    def is_available(self) -> bool:
        return self._initialized and self._llm is not None

    def generate(
        self,
        prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.3,
        system_prompt: Optional[str] = None
    ) -> str:
        if not self.is_available():
            raise RuntimeError(f"LlamaCpp model not loaded at {self.model_path}")

        full_prompt = prompt
        if system_prompt:
            full_prompt = f"<|system|>\n{system_prompt}<|end|>\n<|user|>\n{prompt}<|end|>\n<|assistant|>\n"

        output = self._llm(
            full_prompt,
            max_tokens=max_tokens,
            temperature=temperature,
            stop=["<|end|>", "<|user|>", "System:"]
        )

        return output["choices"][0]["text"].strip()
