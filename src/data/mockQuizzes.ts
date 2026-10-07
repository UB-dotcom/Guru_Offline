import { Quiz } from '../types/quiz';

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz_math10_ch04',
    title: 'Class 10 Mathematics — Quadratic Equations Quiz',
    moduleId: 'class10_math',
    chapterId: 'ch04',
    timeLimitSeconds: 300,
    questions: [
      {
        id: 'q1',
        topic: 'Standard Form',
        question: 'Which of the following is the standard form of a quadratic equation?',
        options: [
          { id: 'A', text: 'ax + b = 0' },
          { id: 'B', text: 'ax² + bx + c = 0 (a ≠ 0)' },
          { id: 'C', text: 'ax³ + bx² + c = 0' },
          { id: 'D', text: 'x² + y² = r²' },
        ],
        correctOptionId: 'B',
        explanation: 'A quadratic equation has degree 2 and is written as ax² + bx + c = 0 where a ≠ 0.',
      },
      {
        id: 'q2',
        topic: 'Nature of Roots',
        question: 'If the discriminant D = b² - 4ac is equal to 0, what are the roots?',
        options: [
          { id: 'A', text: 'Two distinct real roots' },
          { id: 'B', text: 'Two equal real roots' },
          { id: 'C', text: 'No real roots' },
          { id: 'D', text: 'Infinite roots' },
        ],
        correctOptionId: 'B',
        explanation: 'When D = 0, both roots equal -b / 2a.',
      },
      {
        id: 'q3',
        topic: 'Quadratic Formula',
        question: 'What is the quadratic formula used to find roots of ax² + bx + c = 0?',
        options: [
          { id: 'A', text: 'x = (-b ± √(b² - 4ac)) / (2a)' },
          { id: 'B', text: 'x = (-b ± √(b² + 4ac)) / (2a)' },
          { id: 'C', text: 'x = (b ± √(b² - 4ac)) / a' },
          { id: 'D', text: 'x = -b / 2a' },
        ],
        correctOptionId: 'A',
        explanation: 'The quadratic formula derived by completing the square is x = (-b ± √(b² - 4ac)) / (2a).',
      },
      {
        id: 'q4',
        topic: 'Discriminant Calculation',
        question: 'What is the discriminant of x² - 6x + 9 = 0?',
        options: [
          { id: 'A', text: 'D = 36' },
          { id: 'B', text: 'D = 18' },
          { id: 'C', text: 'D = 0' },
          { id: 'D', text: 'D = -36' },
        ],
        correctOptionId: 'C',
        explanation: 'D = (-6)² - 4(1)(9) = 36 - 36 = 0.',
      },
      {
        id: 'q5',
        topic: 'Factorization',
        question: 'What are the roots of x² - 5x + 6 = 0?',
        options: [
          { id: 'A', text: 'x = 1 and x = 6' },
          { id: 'B', text: 'x = 2 and x = 3' },
          { id: 'C', text: 'x = -2 and x = -3' },
          { id: 'D', text: 'x = -1 and x = 5' },
        ],
        correctOptionId: 'B',
        explanation: '(x - 2)(x - 3) = 0 gives roots x = 2 and x = 3.',
      },
    ],
  },
];
