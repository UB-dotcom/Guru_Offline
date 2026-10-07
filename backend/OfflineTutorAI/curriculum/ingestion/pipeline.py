"""
Curriculum Ingestion Pipeline

Automates the 12-step ingestion workflow from raw admin PDF upload to published curriculum package.

Pipeline Steps:
1. Validate file
2. Register processing status
3. Extract PDF text page-by-page
4. Preserve page numbers
5. Clean extracted text
6. Detect chapters/sections & create semantic chunks
7. Attach metadata to every chunk
8. Store chunks & build FTS5 search index
9. Run retrieval validation
10. Generate exportable curriculum package bundle
11. Update package status (READY / PUBLISHED)
12. Return complete processing telemetry
"""

from pathlib import Path
from typing import Dict, Any, Optional

from OfflineTutorAI.admin.upload.pdf_uploader import AdminPDFUploader
from OfflineTutorAI.admin.curriculum_management.manager import CurriculumManager
from OfflineTutorAI.curriculum.extraction.pdf_extractor import PDFExtractor
from OfflineTutorAI.curriculum.cleaning.text_cleaner import TextCleaner
from OfflineTutorAI.curriculum.chunking.semantic_chunker import SemanticChunker
from OfflineTutorAI.curriculum.indexing.indexer import CurriculumIndexer
from OfflineTutorAI.curriculum.packaging.package_builder import PackageBuilder
from OfflineTutorAI.database.repositories.curriculum_repository import CurriculumRepository


class CurriculumIngestionPipeline:
    """Orchestrates end-to-end curriculum ingestion."""

    def __init__(
        self,
        uploader: Optional[AdminPDFUploader] = None,
        manager: Optional[CurriculumManager] = None,
        extractor: Optional[PDFExtractor] = None,
        cleaner: Optional[TextCleaner] = None,
        chunker: Optional[SemanticChunker] = None,
        indexer: Optional[CurriculumIndexer] = None,
        packager: Optional[PackageBuilder] = None,
        repository: Optional[CurriculumRepository] = None
    ):
        self.uploader = uploader or AdminPDFUploader()
        self.manager = manager or CurriculumManager()
        self.extractor = extractor or PDFExtractor()
        self.cleaner = cleaner or TextCleaner()
        self.chunker = chunker or SemanticChunker()
        self.indexer = indexer or CurriculumIndexer(repository=repository)
        self.packager = packager or PackageBuilder()
        self.repository = repository or CurriculumRepository()

    def process_admin_pdf(
        self,
        pdf_path: Path,
        board: str,
        class_level: str,
        subject: str,
        version: str = "1.0",
        custom_name: Optional[str] = None,
        auto_publish: bool = True
    ) -> Dict[str, Any]:
        """
        Executes full automated 12-step curriculum ingestion pipeline.
        """
        # Step 1: Upload & Validate File with Authoritative Metadata
        upload_meta = self.uploader.upload_pdf(
            pdf_path=pdf_path,
            board=board,
            class_level=class_level,
            subject=subject,
            version=version,
            custom_name=custom_name
        )
        curriculum_id = upload_meta["curriculum_id"]
        saved_pdf_path = Path(upload_meta["saved_path"])

        # Step 2: Register PROCESSING status
        self.manager.register_processing_package(
            curriculum_id=curriculum_id,
            board=upload_meta["board"],
            class_level=upload_meta["class_level"],
            subject=upload_meta["subject"],
            name=upload_meta["name"],
            version=upload_meta["version"],
            source_file=upload_meta["source_file"]
        )

        try:
            # Step 3 & 4: Extract PDF text & preserve page numbers
            raw_pages = self.extractor.extract_text(saved_pdf_path)

            # Step 5: Clean extracted text
            cleaned_pages = self.cleaner.clean_pages(raw_pages)

            # Step 6 & 7: Chunk semantically & attach metadata
            chunks = self.chunker.chunk_curriculum(
                cleaned_pages=cleaned_pages,
                curriculum_id=curriculum_id,
                board=upload_meta["board"],
                class_level=upload_meta["class_level"],
                subject=upload_meta["subject"],
                version=upload_meta["version"],
                source_file=upload_meta["source_file"]
            )

            if not chunks:
                self.manager.mark_failed(curriculum_id)
                raise RuntimeError(f"No valid chunks generated from {saved_pdf_path.name}")

            # Step 8: Store chunks & update SQLite FTS search index
            # Delete any previous chunks for this curriculum_id before inserting new version
            self.repository.delete_chunks_by_curriculum_id(curriculum_id)
            inserted_count = self.indexer.index_chunks(chunks)

            # Step 9: Retrieval Validation Test
            search_validation = self.repository.search_fts(
                query="content",
                curriculum_id=curriculum_id,
                top_k=2
            )

            # Step 10: Generate exportable curriculum package bundle
            pkg_bundle = self.packager.build_package(
                curriculum_id=curriculum_id,
                board=upload_meta["board"],
                class_level=upload_meta["class_level"],
                subject=upload_meta["subject"],
                name=upload_meta["name"],
                version=upload_meta["version"],
                source_file=upload_meta["source_file"],
                chunk_count=inserted_count
            )

            # Step 11: Update status to READY or PUBLISHED
            self.manager.mark_ready(curriculum_id)
            if auto_publish:
                self.manager.publish_package(curriculum_id)

            # Step 12: Return pipeline completion metrics
            return {
                "curriculum_id": curriculum_id,
                "status": "PUBLISHED" if auto_publish else "READY",
                "total_pages_processed": len(raw_pages),
                "total_chunks_created": inserted_count,
                "package_bundle": pkg_bundle,
                "validation_sample_chunks": len(search_validation)
            }

        except Exception as e:
            self.manager.mark_failed(curriculum_id)
            raise e
