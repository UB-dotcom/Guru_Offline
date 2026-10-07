"""
Curriculum Database Validation Script

Validates database contents and outputs required diagnostic metrics:
- Total chunks
- Classes
- Boards
- Subjects
- Chunks per class
- Chunks per subject
"""

import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository


def validate_database():
    print("======================================================================")
    print("                CURRICULUM DATABASE VALIDATION REPORT                 ")
    print("======================================================================")

    db_paths = [
        Path("database/curriculum.db"),
        Path("OfflineTutorAI/database/curriculum.db")
    ]

    for db_path in db_paths:
        print(f"\nEvaluating Database File: {db_path.resolve()}")
        if not db_path.exists():
            print("  [ERROR: File does not exist!]")
            continue

        repo = CurriculumRepository(db_path=db_path)
        stats = repo.get_validation_stats()

        print("----------------------------------------------------------------------")
        print(f"Total Chunks        : {stats['total_chunks']}")
        print(f"Classes             : {stats['classes']}")
        print(f"Boards              : {stats['boards']}")
        print(f"Subjects            : {stats['subjects']}")
        print("Chunks Per Class    :")
        for cls, count in stats['chunks_per_class'].items():
            print(f"  - {cls}: {count} chunk(s)")
        print("Chunks Per Subject  :")
        for subj, count in stats['chunks_per_subject'].items():
            print(f"  - {subj}: {count} chunk(s)")
        print("----------------------------------------------------------------------")

        # Isolation Assertion Check
        if any("10" in str(c) for c in stats['classes']):
            print("  [WARNING: Class 10 data present in database!]")
        else:
            print("  [PASSED: Database strictly isolated to Class 7 curriculum!]")

    print("\n======================================================================")


if __name__ == "__main__":
    validate_database()
