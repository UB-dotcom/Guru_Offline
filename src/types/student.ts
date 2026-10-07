export type EducationLevel =
  | 'primary' // Classes 1-5
  | 'middle' // Classes 6-8
  | 'secondary' // Classes 9-10
  | 'higher_secondary'; // Classes 11-12

export type GradeClass = 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type AppLanguage = 'en' | 'hi';

export interface StudentProfile {
  id: string;
  name: string;
  avatarId: string;
  educationLevel: EducationLevel;
  classNumber: GradeClass;
  language: AppLanguage;
  activeSubjectId: string;
  createdAt: string;
  updatedAt: string;
}
