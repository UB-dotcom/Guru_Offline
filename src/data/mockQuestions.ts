import { PracticeQuestion } from '../types/quiz';

export const mockPracticeQuestions: PracticeQuestion[] = [
  {
    id: 'pr_01',
    topic: 'Linear Equations',
    chapterId: 'ch03',
    question: 'Solve for x: 2x + 6 = 14',
    options: [
      { id: 'A', text: 'x = 2' },
      { id: 'B', text: 'x = 4' },
      { id: 'C', text: 'x = 6' },
      { id: 'D', text: 'x = 8' },
    ],
    correctOptionId: 'B',
    stepByStepSolution: [
      'Step 1: Subtract 6 from both sides of the equation.',
      '2x + 6 - 6 = 14 - 6',
      '2x = 8',
      'Step 2: Divide both sides by 2.',
      'x = 8 / 2 = 4',
    ],
    finalAnswer: 'x = 4',
    hint: 'Isolate the term with x by subtracting the constant first.',
  },
  {
    id: 'pr_02',
    topic: 'Quadratic Equations',
    chapterId: 'ch04',
    question: 'Find the discriminant of 2x² - 4x + 3 = 0',
    options: [
      { id: 'A', text: 'D = -8' },
      { id: 'B', text: 'D = 8' },
      { id: 'C', text: 'D = 16' },
      { id: 'D', text: 'D = 0' },
    ],
    correctOptionId: 'A',
    stepByStepSolution: [
      'Step 1: Identify coefficients a = 2, b = -4, c = 3.',
      'Step 2: Use the discriminant formula D = b² - 4ac.',
      'D = (-4)² - 4(2)(3)',
      'D = 16 - 24 = -8',
      'Step 3: Since D < 0, there are no real roots.',
    ],
    finalAnswer: 'D = -8 (No real roots)',
    hint: 'Formula: D = b² - 4ac',
  },
  {
    id: 'pr_03',
    topic: 'Speed, Distance and Time',
    chapterId: 'sci06',
    question: 'A car travels at 20 m/s for 5 seconds. What distance does it travel?',
    options: [
      { id: 'A', text: '50 m' },
      { id: 'B', text: '100 m' },
      { id: 'C', text: '150 m' },
      { id: 'D', text: '200 m' },
    ],
    correctOptionId: 'B',
    stepByStepSolution: [
      'Step 1: Identify given quantities: Speed = 20 m/s, Time = 5 seconds.',
      'Step 2: Recall curriculum formula: Distance = Speed × Time.',
      'Distance = 20 m/s × 5 s = 100 meters.',
    ],
    finalAnswer: 'Distance = 100 meters',
    hint: 'Multiply speed by time.',
  },
];
