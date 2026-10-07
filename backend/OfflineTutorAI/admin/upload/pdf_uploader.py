"""
Admin PDF Uploader Module

Handles authoritative upload of curriculum PDFs with admin-provided metadata:
board, class_level, subject, version, and optional package name.
"""

import shutil
from pathlib import Path
from typing import Dict, Any, Optional
from OfflineTutorAI.config import SOURCE_DIR


class AdminPDFUploader:
    """Manages curriculum PDF uploads and metadata validation."""

    def __init__(self, source_dir: Optional[Path] = None):
        self.source_dir = Path(source_dir) if source_dir else SOURCE_DIR
        self.source_dir.mkdir(parents=True, exist_ok=True)

    def generate_curriculum_id(self, board: str, class_level: str, subject: str) -> str:
        """Generates a clean deterministic curriculum_id."""
        b = board.lower().replace(" ", "")
        c = class_level.lower().replace(" ", "")
        s = subject.lower().replace(" ", "")
        return f"{b}-{c}-{s}"

    def upload_pdf(
        self,
        pdf_path: Path,
        board: str,
        class_level: str,
        subject: str,
        version: str = "1.0",
        custom_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Processes upload of an admin PDF and returns curriculum payload metadata.
        Authoritative metadata provided by admin.
        """
        src = Path(pdf_path)
        if not src.exists():
            raise FileNotFoundError(f"Source PDF file not found at {src}")
        if src.suffix.lower() not in [".pdf", ".txt", ".md"]:
            raise ValueError(f"Unsupported file format: {src.suffix}. Must be PDF or TXT.")

        curriculum_id = self.generate_curriculum_id(board, class_level, subject)
        target_name = f"{curriculum_id}_v{version}{src.suffix}"
        target_path = self.source_dir / target_name

        # Copy file to managed source directory
        shutil.copy2(src, target_path)

        package_name = custom_name or f"{board} {class_level} {subject}"

        return {
            "curriculum_id": curriculum_id,
            "board": board.strip(),
            "class_level": class_level.strip(),
            "subject": subject.strip(),
            "name": package_name,
            "version": version.strip(),
            "source_file": target_name,
            "saved_path": str(target_path)
        }
