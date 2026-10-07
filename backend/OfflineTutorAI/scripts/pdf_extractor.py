"""
Script 1: PDF Text Extraction

Extracts page-by-page text from curriculum PDF files in curriculum/source/
and saves structured JSON page data in curriculum/processed/.
"""

import sys
import json
from pathlib import Path
from typing import List, Dict, Any

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from OfflineTutorAI.config import SOURCE_DIR, PROCESSED_DIR


def extract_text_from_pdf(file_path: Path) -> List[Dict[str, Any]]:
    """
    Extracts text page by page from a single PDF or text file.
    
    Returns list of dicts: [{"page": page_num, "text": content}]
    """
    pages_data = []

    # Handle direct text/markdown files
    if file_path.suffix.lower() in [".txt", ".md"]:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        pages_data.append({"page": 1, "text": content})
        print(f"[PDF Extractor] Read text file {file_path.name}")
        return pages_data

    # Try PyPDF / PyMuPDF for actual PDF files
    extracted = False

    # Attempt 1: pypdf
    if not extracted:
        try:
            import pypdf
            reader = pypdf.PdfReader(str(file_path))
            for i, page in enumerate(reader.pages, start=1):
                text = page.extract_text() or ""
                pages_data.append({"page": i, "text": text})
            extracted = True
            print(f"[PDF Extractor] Extracted {len(pages_data)} pages using pypdf")
        except Exception as e:
            pass

    # Attempt 2: fitz (PyMuPDF)
    if not extracted:
        try:
            import fitz
            doc = fitz.open(str(file_path))
            for i, page in enumerate(doc, start=1):
                text = page.get_text()
                pages_data.append({"page": i, "text": text})
            extracted = True
            print(f"[PDF Extractor] Extracted {len(pages_data)} pages using PyMuPDF")
        except Exception:
            pass

    return pages_data


def process_all_source_pdfs(source_dir: Path = SOURCE_DIR, output_dir: Path = PROCESSED_DIR):
    """Processes all PDFs and TXTs in source_dir and outputs JSON files in output_dir."""
    source_files = list(source_dir.glob("*.pdf")) + list(source_dir.glob("*.txt")) + list(source_dir.glob("*.md"))
    if not source_files:
        print(f"[PDF Extractor] No PDF, TXT, or MD files found in {source_dir}")
        return

    output_dir.mkdir(parents=True, exist_ok=True)

    for file_path in source_files:
        print(f"[PDF Extractor] Extracting {file_path.name}...")
        extracted_pages = extract_text_from_pdf(file_path)
        
        out_filename = file_path.stem + "_raw.json"
        out_path = output_dir / out_filename
        
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump({
                "source_file": file_path.name,
                "total_pages": len(extracted_pages),
                "pages": extracted_pages
            }, f, indent=2, ensure_ascii=False)

        print(f"[PDF Extractor] Saved page text to {out_path}")


if __name__ == "__main__":
    process_all_source_pdfs()
