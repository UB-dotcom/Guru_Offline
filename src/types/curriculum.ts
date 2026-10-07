import { AppLanguage, BoardType, StreamType } from './student';

export interface CurriculumSubject {
  id: string;
  name: string;
  hindiName?: string;
  icon: string;
  description: string;
  chapterCount: number;
  totalSizeMB: number;
}

export interface CurriculumFilter {
  board: BoardType;
  state?: string | null;
  classLevel: number;
  stream?: StreamType;
  language: AppLanguage;
  subject?: string;
}

export interface CurriculumPackageMetadata {
  id: string;
  board: BoardType;
  state: string | null;
  classLevel: number;
  stream: StreamType;
  language: AppLanguage;
  subject: string;
  chapter?: string;
  version: string;
  size: string;
}
