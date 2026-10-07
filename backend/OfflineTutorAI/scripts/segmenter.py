"""
Script 3: Chapter/Topic Segmentation

Parses cleaned textbook text into structured chapter and topic segments with metadata.
"""

import sys
import re
import json
from pathlib import Path
from typing import List, Dict, Any

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from OfflineTutorAI.config import PROCESSED_DIR


class CurriculumSegmenter:
    """Segments cleaned pages into chapters and topic sections."""

    CHAPTER_PATTERN = r'(?i)^(chapter\s+\d+[\s:]*.*?|\d+\.\s+[A-Z].*?)$'
    TOPIC_PATTERN = r'(?i)^(\d+\.\d+\s+[A-Z].*?|topic[:\s]+.*?)$'

    def segment_pages(
        self,
        pages: List[Dict[str, Any]],
        board: str = "CBSE",
        class_name: str = "Class 10",
        subject: str = "Science"
    ) -> List[Dict[str, Any]]:
        """
        Segments page stream into structured sections.
        """
        segments = []
        current_chapter = "General Curriculum"
        current_topic = "Overview"
        current_buffer = []
        current_pages = []

        for p_info in pages:
            page_num = p_info.get("page", 1)
            text = p_info.get("text", "")
            lines = text.split("\n")

            for line in lines:
                line_str = line.strip()
                if not line_str:
                    continue

                # Check if line matches Chapter pattern
                if re.match(self.CHAPTER_PATTERN, line_str):
                    if current_buffer:
                        segments.append({
                            "board": board,
                            "class": class_name,
                            "subject": subject,
                            "chapter": current_chapter,
                            "topic": current_topic,
                            "content": "\n".join(current_buffer),
                            "source_page": str(min(current_pages)) if current_pages else str(page_num)
                        })
                        current_buffer = []
                        current_pages = []
                    current_chapter = line_str
                    current_topic = "Introduction"
                    continue

                # Check if line matches Topic pattern
                if re.match(self.TOPIC_PATTERN, line_str):
                    if current_buffer:
                        segments.append({
                            "board": board,
                            "class": class_name,
                            "subject": subject,
                            "chapter": current_chapter,
                            "topic": current_topic,
                            "content": "\n".join(current_buffer),
                            "source_page": str(min(current_pages)) if current_pages else str(page_num)
                        })
                        current_buffer = []
                        current_pages = []
                    current_topic = line_str
                    continue

                current_buffer.append(line_str)
                current_pages.append(page_num)

        # Flush remaining segment
        if current_buffer:
            segments.append({
                "board": board,
                "class": class_name,
                "subject": subject,
                "chapter": current_chapter,
                "topic": current_topic,
                "content": "\n".join(current_buffer),
                "source_page": str(min(current_pages)) if current_pages else "1"
            })

        return segments


def segment_processed_files(processed_dir: Path = PROCESSED_DIR):
    """Processes cleaned JSON files into segmented JSON files."""
    cleaned_files = list(processed_dir.glob("*_cleaned.json"))
    if not cleaned_files:
        print(f"[Segmenter] No *_cleaned.json files found in {processed_dir}")
        return

    segmenter = CurriculumSegmenter()

    for cleaned_file in cleaned_files:
        print(f"[Segmenter] Segmenting {cleaned_file.name}...")
        with open(cleaned_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        segments = segmenter.segment_pages(
            pages=data.get("pages", []),
            board="CBSE",
            class_name="Class 10",
            subject="Science"
        )

        out_path = processed_dir / (cleaned_file.stem.replace("_cleaned", "") + "_segmented.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump({
                "source_file": data.get("source_file"),
                "total_segments": len(segments),
                "segments": segments
            }, f, indent=2, ensure_ascii=False)

        print(f"[Segmenter] Saved {len(segments)} segments to {out_path}")


if __name__ == "__main__":
    segment_processed_files()
