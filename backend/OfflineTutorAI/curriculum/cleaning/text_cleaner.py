"""
Text Cleaner Module

Cleans extracted raw textbook text by removing invisible control characters,
running headers/footers, and normalizing whitespace.
"""

import re
from typing import List, Dict, Any


class TextCleaner:
    """Normalizes and cleans raw page text."""

    def clean_page_text(self, raw_text: str) -> str:
        """Cleans a single string of text."""
        if not raw_text:
            return ""

        text = raw_text

        # Strip unprintable control characters (except newline/tab)
        text = re.sub(r'[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f-\x9f]', '', text)

        # De-hyphenate line breaks
        text = re.sub(r'(\w+)-\s*\n\s*(\w+)', r'\1\2', text)

        # Remove running page number footers e.g. "Page 12 of 150"
        text = re.sub(r'(?i)page\s+\d+\s+of\s+\d+', '', text)
        text = re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE)

        # Strip unprintable bullet characters
        text = re.sub(r'^[•\-\*\s]+', '', text, flags=re.MULTILINE)

        # Normalize multiple spaces and newlines
        text = re.sub(r'[ \t]+', ' ', text)
        text = re.sub(r'\n{3,}', '\n\n', text)

        return text.strip()

    def clean_pages(self, pages_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Cleans a list of page data dicts."""
        cleaned = []
        for p in pages_data:
            c_text = self.clean_page_text(p.get("text", ""))
            if c_text:
                cleaned.append({
                    "page": p.get("page", 1),
                    "text": c_text
                })
        return cleaned
