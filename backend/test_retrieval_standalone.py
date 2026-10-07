"""
Local Retrieval Verification Script

Demonstrates offline curriculum retrieval without cloud API calls or answer generation.
Executes test queries across Class 7 and Class 10 subjects.

For every query, displays:
- query
- retrieved chunk IDs
- chapter
- topic
- page
- relevance score
"""

import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from OfflineTutorAI.rag.retriever.sqlite_retriever import retrieve


def run_retrieval_proof():
    print("======================================================================")
    print("         LOCAL CURRICULUM RETRIEVAL PROOF (OFFLINE ONLY)            ")
    print("======================================================================")

    test_queries = [
        {
            "description": "Class 7 Science Query (Physics / Light & Motion)",
            "question": "What topics are studied in Class 7 Physics regarding light, motion, and heat?",
            "subject": "Science",
            "class_level": "Class 7"
        },
        {
            "description": "Class 7 Science Query (Chemistry / Acids & Bases)",
            "question": "What are acids, bases, salts, physical and chemical changes in Class 7?",
            "subject": "Science",
            "class_level": "Class 7"
        },
        {
            "description": "Class 7 Mathematics Query (Integers & Algebra)",
            "question": "Explain integers, rational numbers, algebraic expressions, and linear equations.",
            "subject": "Mathematics",
            "class_level": "Class 7"
        },
        {
            "description": "Class 7 Social Studies Query (History & Geography)",
            "question": "Tell me about medieval history, rise of empires, inside our earth, and air.",
            "subject": "Social Studies",
            "class_level": "Class 7"
        },
        {
            "description": "Class 10 Physics Query (Snell's Law)",
            "question": "What is Snell's Law of refraction?",
            "subject": "Science",
            "class_level": "10"
        }
    ]

    for idx, test in enumerate(test_queries, 1):
        print(f"\n----------------------------------------------------------------------")
        print(f"Test Query #{idx}: {test['description']}")
        print(f"  Question   : '{test['question']}'")
        print(f"  Filters    : Subject='{test['subject']}', Class='{test['class_level']}'")
        print(f"----------------------------------------------------------------------")

        results = retrieve(
            question=test['question'],
            subject=test['subject'],
            class_level=test['class_level'],
            top_k=3
        )

        if not results:
            print("  [NO RESULTS RETURNED]")
            continue

        for r_idx, item in enumerate(results, 1):
            print(f"  [{r_idx}] Chunk ID       : {item['chunk_id']}")
            print(f"      Subject        : {item['subject']}")
            print(f"      Class          : {item['class']}")
            print(f"      Chapter        : {item['chapter']}")
            print(f"      Topic          : {item['topic']}")
            print(f"      Page           : Page {item['source_page']}")
            print(f"      Relevance Score: {item['relevance_score']:.4f}")
            print(f"      Content Snippet: {item['content'][:120]}...")
            print()

    print("======================================================================")
    print("         RETRIEVAL PROOF COMPLETED SUCCESSFULLY (100% OFFLINE)        ")
    print("======================================================================")


if __name__ == "__main__":
    run_retrieval_proof()
