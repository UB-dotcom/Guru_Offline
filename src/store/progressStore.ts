import { create } from 'zustand';
import { LearningProgress, SubjectProgress } from '../types/progress';

interface ProgressState {
  progress: LearningProgress;
  recordQuestionAttempt: (moduleId: string, isCorrect: boolean) => void;
  recordQuizScore: (moduleId: string, scorePct: number) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  progress: {
    totalQuestionsSolved: 47,
    overallAccuracyPercent: 83,
    currentStreakDays: 4,
    lastActiveDate: '2026-10-07',
    subjects: {
      class10_math: {
        moduleId: 'class10_math',
        subjectName: 'Mathematics',
        classNumber: 10,
        completedPercentage: 78,
        chaptersCompleted: 3,
        totalChapters: 15,
        questionsAttempted: 32,
        quizAverage: 85,
      },
      class10_science: {
        moduleId: 'class10_science',
        subjectName: 'Science',
        classNumber: 10,
        completedPercentage: 55,
        chaptersCompleted: 2,
        totalChapters: 13,
        questionsAttempted: 15,
        quizAverage: 80,
      },
    },
  },

  recordQuestionAttempt: (moduleId, isCorrect) =>
    set((state) => {
      const sub = state.progress.subjects[moduleId];
      const updatedTotal = state.progress.totalQuestionsSolved + 1;
      const updatedAttempted = sub ? sub.questionsAttempted + 1 : 1;

      return {
        progress: {
          ...state.progress,
          totalQuestionsSolved: updatedTotal,
          subjects: {
            ...state.progress.subjects,
            ...(sub && {
              [moduleId]: {
                ...sub,
                questionsAttempted: updatedAttempted,
                completedPercentage: Math.min(100, sub.completedPercentage + (isCorrect ? 2 : 1)),
              },
            }),
          },
        },
      };
    }),

  recordQuizScore: (moduleId, scorePct) =>
    set((state) => {
      const sub = state.progress.subjects[moduleId];
      if (!sub) return state;

      const newAvg = Math.round((sub.quizAverage + scorePct) / 2);
      return {
        progress: {
          ...state.progress,
          subjects: {
            ...state.progress.subjects,
            [moduleId]: {
              ...sub,
              quizAverage: newAvg,
            },
          },
        },
      };
    }),
}));
