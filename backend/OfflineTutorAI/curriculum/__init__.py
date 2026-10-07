"""Curriculum package initialization."""
from OfflineTutorAI.curriculum.ingestion.pipeline import CurriculumIngestionPipeline
from OfflineTutorAI.curriculum.extraction.pdf_extractor import PDFExtractor
from OfflineTutorAI.curriculum.cleaning.text_cleaner import TextCleaner
from OfflineTutorAI.curriculum.chunking.semantic_chunker import SemanticChunker
from OfflineTutorAI.curriculum.indexing.indexer import CurriculumIndexer
from OfflineTutorAI.curriculum.packaging.package_builder import PackageBuilder
from OfflineTutorAI.curriculum.versioning.version_control import CurriculumVersionControl

__all__ = [
    "CurriculumIngestionPipeline",
    "PDFExtractor",
    "TextCleaner",
    "SemanticChunker",
    "CurriculumIndexer",
    "PackageBuilder",
    "CurriculumVersionControl"
]
