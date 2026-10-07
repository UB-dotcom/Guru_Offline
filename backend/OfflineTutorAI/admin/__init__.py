"""Admin package initialization."""
from OfflineTutorAI.admin.upload.pdf_uploader import AdminPDFUploader
from OfflineTutorAI.admin.curriculum_management.manager import CurriculumManager
from OfflineTutorAI.admin.dashboard.admin_dashboard import AdminDashboard

__all__ = ["AdminPDFUploader", "CurriculumManager", "AdminDashboard"]
