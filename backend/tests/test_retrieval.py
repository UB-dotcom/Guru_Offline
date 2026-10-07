"""
Curriculum Retrieval Isolation Test Suite

Tests mandatory metadata-filtered retrieval for Class 7 curriculum.

Required Test Cases:
A. "What is photosynthesis?" (class_level="Class 7", board="General", subject="Science")
B. "Why do plants need sunlight?" (class_level="Class 7", board="General", subject="Science")
C. "What is chlorophyll?" (class_level="Class 7", board="General", subject="Science")
D. Unrelated / out-of-curriculum question (e.g. "What is quantum computing?")
E. Cross-class isolation proof ("What is Snell's Law?" with class_level="Class 7")
"""

import sys
from pathlib import Path

# UTF-8 stdout configuration for Windows console
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from OfflineTutorAI.rag.retriever.sqlite_retriever import retrieve, SQLiteRetriever
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository


def run_test_cases():
    print("======================================================================")
    print("              CLASS 7 CURRICULUM RETRIEVAL TEST SUITE                ")
    print("======================================================================")

    test_cases = [
        {
            "id": "Test A",
            "question": "What is photosynthesis?",
            "class_level": "Class 7",
            "board": "General",
            "subject": "Science"
        },
        {
            "id": "Test B",
            "question": "Why do plants need sunlight?",
            "class_level": "Class 7",
            "board": "General",
            "subject": "Science"
        },
        {
            "id": "Test C",
            "question": "What is chlorophyll?",
            "class_level": "Class 7",
            "board": "General",
            "subject": "Science"
        },
        {
            "id": "Test D (Out-of-Curriculum)",
            "question": "What is quantum computing?",
            "class_level": "Class 7",
            "board": "General",
            "subject": "Science"
        },
        {
            "id": "Test E (Class 10 Query on Class 7 Filter)",
            "question": "What is Snell's Law of refraction?",
            "class_level": "Class 7",
            "board": "General",
            "subject": "Science"
        }
    ]

    for tc in test_cases:
        print(f"\n----------------------------------------------------------------------")
        print(f"Executing {tc['id']}")
        print(f"  Question         : {tc['question']}")
        print(f"  Selected Class   : {tc['class_level']}")
        print(f"  Selected Board   : {tc['board']}")
        print(f"  Selected Subject : {tc['subject']}")
        print(f"----------------------------------------------------------------------")

        results = retrieve(
            question=tc['question'],
            class_level=tc['class_level'],
            board=tc['board'],
            subject=tc['subject'],
            top_k=3
        )

        if not results:
            print("  [RESULT: NOT COVERED BY SELECTED CURRICULUM]")
            print("  (0 matching chunks returned for the selected Class/Board/Subject filter).")
            continue

        for idx, item in enumerate(results, 1):
            print(f"  --- Result #{idx} ---")
            print(f"  Question         : {tc['question']}")
            print(f"  Selected Class   : {tc['class_level']}")
            print(f"  Selected Board   : {tc['board']}")
            print(f"  Selected Subject : {tc['subject']}")
            print(f"  Retrieved Chunk  : {item['chunk_id']}")
            print(f"  Chapter          : {item['chapter']}")
            print(f"  Topic            : {item['topic']}")
            print(f"  Source Page      : Page {item['source_page']}")
            print(f"  Relevance Score  : {item['relevance_score']:.4f}")
            print(f"  Content          : {item['content']}\n")

            # Assert Class Isolation
            assert "10" not in str(item['class']), f"CRITICAL: Class 10 chunk {item['chunk_id']} leaked into Class 7 query!"
            assert item['board'] == tc['board'], f"CRITICAL: Board mismatch {item['board']} != {tc['board']}"

    print("======================================================================")
    print("      ALL RETRIEVAL TESTS COMPLETED WITH STRICT CLASS ISOLATION       ")
    print("======================================================================")


def main():
    if len(sys.argv) > 1:
        q = " ".join(sys.argv[1:])
        results = retrieve(question=q, class_level="Class 7", board="General", subject="Science")
        print(f"\nQuestion: {q}")
        print(f"Retrieved {len(results)} chunk(s).")
        for r in results:
            print(f"Chunk: {r['chunk_id']} | Score: {r['relevance_score']} | Topic: {r['topic']}")
            print(f"Content: {r['content']}\n")
    else:
        run_test_cases()


if __name__ == "__main__":
    main()
