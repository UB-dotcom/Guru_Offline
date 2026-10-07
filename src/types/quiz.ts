export interface QuizOption {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
}

export interface PracticeQuestion {
  id: string;
  topic: string;
  chapterId: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  stepByStepSolution: string[];
  finalAnswer: string;
  hint?: string;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  moduleId: string;
  chapterId?: string;
  questions: QuizQuestion[];
  timeLimitSeconds: number;
}

export interface QuizResult {
  quizId: string;
  quizTitle: string;
  totalQuestions: number;
  correctAnswersCount: number;
  scorePercentage: number;
  strongTopics: string[];
  weakTopics: string[];
  completedAt: string;
  userAnswers: Record<string, string>; // questionId -> selectedOptionId
}
