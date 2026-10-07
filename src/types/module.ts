export type ChapterStatus = 'completed' | 'current' | 'locked' | 'unlocked';

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  summary: string;
  content: string;
  formulas: string[];
  status: ChapterStatus;
  progressPercent: number;
}

export interface LearningModule {
  id: string;
  title: string;
  classNumber: number;
  subject: string;
  totalChapters: number;
  sizeMB: number;
  downloaded: boolean;
  downloadProgress: number; // 0 - 100
  isDownloading: boolean;
  isPaused: boolean;
  version: string;
  curriculumCode: string;
  description: string;
  chapters: Chapter[];
  lastAccessedChapterId?: string;
  updatedAt: string;
}

export interface ModuleDownloadState {
  moduleId: string;
  bytesDownloaded: number;
  totalBytes: number;
  progress: number;
  status: 'idle' | 'downloading' | 'paused' | 'completed' | 'error';
  errorMessage?: string;
}
