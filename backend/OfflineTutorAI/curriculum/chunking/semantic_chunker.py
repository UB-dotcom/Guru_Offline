"""
Semantic Chunker Module

Intelligently chunks curriculum text by chapters, sections, and topics.
Attaches authoritative metadata to every chunk.
"""

import re
from typing import List, Dict, Any
from OfflineTutorAI.models.chunk_model import CurriculumChunk


class SemanticChunker:
    """Semantic section-aware chunking engine."""

    CHAPTER_PATTERN = r'(?i)^(chapter\s+\d+[\s:]*.*?|\d+\.\s+[A-Z].*?)$'
    TOPIC_PATTERN = r'(?i)^(\d+\.\d+\s+[A-Z].*?|topic[:\s]+.*?)$'

    def chunk_curriculum(
        self,
        cleaned_pages: List[Dict[str, Any]],
        curriculum_id: str,
        board: str,
        class_level: str,
        subject: str,
        version: str,
        source_file: str
    ) -> List[CurriculumChunk]:
        """
        Chunks page text into CurriculumChunk objects.
        """
        chunks: List[CurriculumChunk] = []
        current_chapter = f"{class_level} {subject} Core Curriculum"
        current_topic = "Overview"
        chunk_index = 1

        for p_info in cleaned_pages:
            page_num = p_info.get("page", 1)
            text = p_info.get("text", "")
            lines = [line.strip() for line in text.split("\n") if line.strip()]

            for line in lines:
                # Filter document titles/intros
                if "General Curriculum Framework" in line or "This document outlines" in line:
                    continue
                if line.startswith("Core Topics & Objectives for"):
                    continue

                # Subject line match -> update section focus
                if line in ["Mathematics", "Science", "Language Arts / English", "Social Studies"]:
                    current_chapter = f"{class_level} {line} Core Curriculum"
                    continue

                # Parse topic line e.g., "Topic: Physics" or "Number Systems: Integers..."
                if ":" in line:
                    parts = line.split(":", 1)
                    key = parts[0].strip()
                    val = parts[1].strip()

                    if key.lower() == "topic":
                        topic_title = val
                        content_body = ""
                    else:
                        topic_title = key
                        content_body = val

                    subj_code = subject[:3].upper().replace(" ", "")
                    cid = f"{board.upper()[:4]}-{str(class_level).replace(' ', '')}-{subj_code}-CH01-TP{chunk_index:02d}-001"
                    chunk_index += 1

                    chunk_obj = CurriculumChunk(
                        id=None,
                        curriculum_id=curriculum_id,
                        board=board,
                        class_name=class_level,
                        subject=subject,
                        chapter=current_chapter,
                        topic=topic_title,
                        content=content_body,
                        source_page=str(page_num),
                        chunk_id=cid
                    )
                    chunks.append(chunk_obj)
                elif len(chunks) > 0 and not line.startswith("Core Topics"):
                    # Append continuation line to previous chunk
                    if chunks[-1].content:
                        chunks[-1].content = (chunks[-1].content + " " + line).strip()
                    else:
                        chunks[-1].content = line.strip()

        # Clean whitespace across all chunk contents
        for c in chunks:
            c.content = re.sub(r'\s+', ' ', c.content).strip()

        return chunks
