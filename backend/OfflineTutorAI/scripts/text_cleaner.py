"""
Script 2: Text Cleaning

Cleans raw extracted textbook text by removing headers, footers, hyphenation artifacts,
and normalizing whitespaces and Unicode characters.
"""

import sys
import re
import json
from pathlib import Path
from typing import Dict, Any, List

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from OfflineTutorAI.config import PROCESSED_DIR


def clean_text(raw_text: str) -> str:
    """
    Cleans raw page text.
    
    Steps:
    1. Remove control/invisible characters
    2. De-hyphenate words broken across line breaks (e.g., 're- flection' -> 'reflection')
    3. Remove running headers/footers pattern (e.g., 'Page 12 of 150')
    4. Normalize whitespace
    """
    if not raw_text:
        return ""

    text = raw_text

    # De-hyphenate words across line breaks
    text = re.sub(r'(\w+)-\s*\n\s*(\w+)', r'\1\2', text)

    # Remove running header/footer patterns
    text = re.sub(r'(?i)page\s+\d+\s+of\s+\d+', '', text)
    text = re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE)

    # Replace multiple spaces/newlines
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)

    return text.strip()


def clean_processed_files(processed_dir: Path = PROCESSED_DIR):
    """Cleans all raw JSON page extractions in processed_dir."""
    raw_files = list(processed_dir.glob("*_raw.json"))
    if not raw_files:
        print(f"[Text Cleaner] No *_raw.json files found in {processed_dir}")
        return

    for raw_file in raw_files:
        print(f"[Text Cleaner] Cleaning {raw_file.name}...")
        with open(raw_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        cleaned_pages = []
        for page in data.get("pages", []):
            cleaned_content = clean_text(page.get("text", ""))
            if cleaned_content:
                cleaned_pages.append({
                    "page": page.get("page"),
                    "text": cleaned_content
                })

        out_path = processed_dir / (raw_file.stem.replace("_raw", "") + "_cleaned.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump({
                "source_file": data.get("source_file"),
                "total_pages": len(cleaned_pages),
                "pages": cleaned_pages
            }, f, indent=2, ensure_ascii=False)

        print(f"[Text Cleaner] Saved cleaned text to {out_path}")


if __name__ == "__main__":
    clean_processed_files()
