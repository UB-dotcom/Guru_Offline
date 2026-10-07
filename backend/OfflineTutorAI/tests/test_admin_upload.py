"""
Test A: Admin Upload and PDF Ingestion
"""

import unittest
import tempfile
from pathlib import Path
from OfflineTutorAI.admin.upload.pdf_uploader import AdminPDFUploader
from OfflineTutorAI.config import SOURCE_DIR


class TestAdminUpload(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.uploader = AdminPDFUploader(source_dir=Path(self.temp_dir.name))

        # Create dummy source text file
        self.sample_file = Path(self.temp_dir.name) / "sample_test.txt"
        with open(self.sample_file, "w", encoding="utf-8") as f:
            f.write("Mathematics\nNumber Systems: Integers and fractions.")

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_upload_pdf_with_authoritative_metadata(self):
        meta = self.uploader.upload_pdf(
            pdf_path=self.sample_file,
            board="General",
            class_level="Class 7",
            subject="Mathematics",
            version="1.0"
        )
        self.assertEqual(meta["curriculum_id"], "general-class7-mathematics")
        self.assertEqual(meta["board"], "General")
        self.assertEqual(meta["class_level"], "Class 7")
        self.assertEqual(meta["subject"], "Mathematics")
        self.assertTrue(Path(meta["saved_path"]).exists())


if __name__ == "__main__":
    unittest.main()
