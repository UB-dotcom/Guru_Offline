"""
Script 4: Meaningful Chunk Creation

Takes segmented curriculum files and uses TextChunker to generate
meaningful CurriculumChunk objects with all 9 required schema fields.
Saves chunk JSON datasets in curriculum/chunks/.
"""

import sys
import json
from pathlib import Path
from typing import List, Dict, Any

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from OfflineTutorAI.config import PROCESSED_DIR, CHUNKS_DIR
from OfflineTutorAI.rag.chunker.text_chunker import TextChunker
from OfflineTutorAI.models.chunk_model import CurriculumChunk


def create_chunks_from_segments(processed_dir: Path = PROCESSED_DIR, chunks_dir: Path = CHUNKS_DIR):
    """Generates chunk JSON files from segmented JSON files."""
    segmented_files = list(processed_dir.glob("*_segmented.json"))
    if not segmented_files:
        print(f"[Chunk Creator] No *_segmented.json files found in {processed_dir}")
        return

    chunks_dir.mkdir(parents=True, exist_ok=True)
    chunker = TextChunker(target_chunk_size=500, overlap=50)

    for seg_file in segmented_files:
        print(f"[Chunk Creator] Chunking {seg_file.name}...")
        with open(seg_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        all_chunks: List[Dict[str, Any]] = []
        segments = data.get("segments", [])

        for idx, seg in enumerate(segments, start=1):
            chunks = chunker.chunk_section(
                text=seg.get("content", ""),
                board=seg.get("board", "CBSE"),
                class_name=seg.get("class", "Class 10"),
                subject=seg.get("subject", "Science"),
                chapter=seg.get("chapter", "General Curriculum"),
                topic=seg.get("topic", "General Topic"),
                source_page=seg.get("source_page", "1"),
                chunk_prefix=f"SEG{idx:02d}"
            )
            for c in chunks:
                all_chunks.append(c.to_dict())

        out_path = chunks_dir / (seg_file.stem.replace("_segmented", "") + "_chunks.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump({
                "source_file": data.get("source_file"),
                "total_chunks": len(all_chunks),
                "chunks": all_chunks
            }, f, indent=2, ensure_ascii=False)

        print(f"[Chunk Creator] Generated {len(all_chunks)} chunks -> {out_path}")


if __name__ == "__main__":
    create_chunks_from_segments()
