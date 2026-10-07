"""
Text Chunker Module

Converts structured text or segments into meaningful CurriculumChunk objects
with proper overlap, size control, and metadata preservation.
"""

import re
from typing import List, Dict, Any
from OfflineTutorAI.models.chunk_model import CurriculumChunk


class TextChunker:
    """
    Splits chapter content into meaningful chunks based on topics,
    paragraphs, or window constraints.
    """

    def __init__(self, target_chunk_size: int = 500, overlap: int = 50):
        self.target_chunk_size = target_chunk_size
        self.overlap = overlap

    def chunk_section(
        self,
        text: str,
        board: str,
        class_name: str,
        subject: str,
        chapter: str,
        topic: str,
        source_page: str,
        chunk_prefix: str = "CHK"
    ) -> List[CurriculumChunk]:
        """
        Splits section text into chunks while preserving metadata.
        """
        text = text.strip()
        if not text:
            return []

        # Split into paragraphs or natural block boundaries
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        if not paragraphs:
            paragraphs = [text]

        chunks: List[CurriculumChunk] = []
        current_buffer: List[str] = []
        current_length = 0
        chunk_index = 1

        for para in paragraphs:
            para_len = len(para)
            if current_length + para_len > self.target_chunk_size and current_buffer:
                # Flush current buffer into a chunk
                chunk_content = "\n\n".join(current_buffer)
                cid = f"{board.upper()[:4]}-{str(class_name).replace(' ', '')}-{subject.upper()[:3]}-{chunk_prefix}-{chunk_index:03d}"
                chunks.append(
                    CurriculumChunk(
                        board=board,
                        class_name=class_name,
                        subject=subject,
                        chapter=chapter,
                        topic=topic,
                        content=chunk_content,
                        source_page=str(source_page),
                        chunk_id=cid
                    )
                )
                chunk_index += 1
                
                # Overlap handling: keep last paragraph if reasonable size
                if len(current_buffer[-1]) < self.target_chunk_size // 2:
                    current_buffer = [current_buffer[-1]]
                    current_length = len(current_buffer[0])
                else:
                    current_buffer = []
                    current_length = 0

            current_buffer.append(para)
            current_length += para_len

        # Flush remaining buffer
        if current_buffer:
            chunk_content = "\n\n".join(current_buffer)
            cid = f"{board.upper()[:4]}-{str(class_name).replace(' ', '')}-{subject.upper()[:3]}-{chunk_prefix}-{chunk_index:03d}"
            chunks.append(
                CurriculumChunk(
                    board=board,
                    class_name=class_name,
                    subject=subject,
                    chapter=chapter,
                    topic=topic,
                    content=chunk_content,
                    source_page=str(source_page),
                    chunk_id=cid
                )
            )

        return chunks
