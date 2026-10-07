"""
Root RAG Retriever Module

Exposes retrieve(question, subject, class_level) interface for offline retrieval testing.
"""

from OfflineTutorAI.rag.retriever.sqlite_retriever import SQLiteRetriever, retrieve

__all__ = ["SQLiteRetriever", "retrieve"]
