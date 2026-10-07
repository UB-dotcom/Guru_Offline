export type EducationLevel =
  | 'primary' // Classes 1-5
  | 'middle' // Classes 6-8
  | 'secondary' // Classes 9-10
  | 'higher_secondary'; // Classes 11-12

export type GradeClass = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type AppLanguage = 'en' | 'hi' | 'bilingual';

export type BoardType = 'cbse' | 'icse' | 'state';

export type StreamType = 'science' | 'commerce' | 'arts' | null;

export interface Board {
  id: BoardType;
  name: string;
  shortName: string;
  type: 'national' | 'state';
  description?: string;
}

export interface StateOption {
  id: string;
  name: string;
  hindiName?: string;
  boardName: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  language: AppLanguage;
  board: BoardType;
  state: string | null;
  classLevel: number;
  stream: StreamType;
  selectedSubjects: string[];
  downloadedModules: string[];
  avatarId?: string;
  educationLevel?: EducationLevel;
  classNumber?: number;
  activeSubjectId?: string;
  createdAt?: string;
  updatedAt?: string;
}
