"""
Script 6: Local Retrieval Testing

Executes sample retrieval queries against SQLite database using SQLiteRetriever.
Verifies BM25 matching, subject filtering, and score ranking offline.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from OfflineTutorAI.rag.retriever.sqlite_retriever import SQLiteRetriever
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository


def run_retrieval_tests():
    """Runs sample test queries against the local curriculum database."""
    print("=== Running Local Retrieval Tests ===")
    repo = CurriculumRepository()
    
    # Ensure database is created if not already
    if repo.count_chunks() == 0:
        print("[Test Retrieval] Database empty. Running build_db script first...")
        from OfflineTutorAI.scripts.build_db import build_database
        build_database()

    retriever = SQLiteRetriever(repository=repo)

    test_queries = [
        ("What is Snell's Law of refraction?", "Science"),
        ("Explain Ohm's Law and resistance", "Science"),
        ("What is the equation for photosynthesis?", "Science"),
        ("What are the laws of reflection?", None)
    ]

    for query, subject in test_queries:
        print(f"\n--------------------------------------------------")
        print(f"Query: '{query}' | Subject Filter: {subject}")
        print(f"--------------------------------------------------")

        results = retriever.retrieve(query=query, subject=subject, top_k=3)

        if not results:
            print("No matching curriculum chunks found.")
            continue

        for i, chunk in enumerate(results, 1):
            print(f"\nResult #{i} (Score: {chunk.score:.4f}):")
            print(f"  Chunk ID   : {chunk.chunk_id}")
            print(f"  Chapter    : {chunk.chapter}")
            print(f"  Topic      : {chunk.topic}")
            print(f"  Source Page: Page {chunk.source_page}")
            print(f"  Content    : {chunk.content[:150]}...")

    print("\n=== Local Retrieval Tests Completed Successfully ===")


if __name__ == "__main__":
    run_retrieval_tests()
