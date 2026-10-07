"""
Root SQLite Retriever Proxy

Provides direct access to the offline retrieval interface.
"""

from OfflineTutorAI.rag.retriever.sqlite_retriever import SQLiteRetriever, retrieve

__all__ = ["SQLiteRetriever", "retrieve"]
