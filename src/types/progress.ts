export interface SubjectProgress {
  moduleId: string;
  subjectName: string;
  classNumber: number;
  completedPercentage: number;
  chaptersCompleted: number;
  totalChapters: number;
  questionsAttempted: number;
  quizAverage: number;
}

export interface LearningProgress {
  totalQuestionsSolved: number;
  overallAccuracyPercent: number;
  currentStreakDays: number;
  lastActiveDate: string;
  subjects: Record<string, SubjectProgress>;
}

export interface StorageUsage {
  appSizeMB: number;
  aiModelSizeMB: number;
  modulesSizeMB: number;
  totalUsedMB: number;
  freeSpaceMB: number;
  breakdown: {
    name: string;
    sizeMB: number;
    canDelete: boolean;
    moduleId?: string;
  }[];
}
