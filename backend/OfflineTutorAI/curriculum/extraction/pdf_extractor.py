"""
PDF Text Extraction Module

Extracts page-by-page text from curriculum PDF or text files,
preserving page numbers and structure.
"""

from pathlib import Path
from typing import List, Dict, Any
import pypdf


class PDFExtractor:
    """Extracts text page-by-page from PDF and text documents."""

    def extract_text(self, file_path: Path) -> List[Dict[str, Any]]:
        """
        Extracts text from file page by page.
        Returns list of dicts: [{"page": page_num, "text": content}]
        """
        src = Path(file_path)
        pages_data = []

        if not src.exists():
            raise FileNotFoundError(f"File not found: {src}")

        # Direct text or markdown files
        if src.suffix.lower() in [".txt", ".md"]:
            with open(src, "r", encoding="utf-8") as f:
                content = f.read()
            pages_data.append({"page": 1, "text": content})
            return pages_data

        # PDF files via pypdf
        try:
            reader = pypdf.PdfReader(str(src))
            for i, page in enumerate(reader.pages, start=1):
                text = page.extract_text() or ""
                pages_data.append({"page": i, "text": text})
        except Exception as e:
            # Fallback to PyMuPDF if available
            try:
                import fitz
                doc = fitz.open(str(src))
                for i, page in enumerate(doc, start=1):
                    pages_data.append({"page": i, "text": page.get_text()})
            except Exception:
                raise RuntimeError(f"Failed to extract text from PDF {src.name}: {str(e)}")

        return pages_data
