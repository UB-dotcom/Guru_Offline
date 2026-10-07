import { PracticeQuestion } from '../types/quiz';

export interface ExtendedPracticeQuestion extends PracticeQuestion {
  difficulty?: 'easy' | 'hard';
  board?: string;
  classLevel?: number;
  subject?: string;
  questionHindi?: string;
}

export const mockPracticeQuestions: ExtendedPracticeQuestion[] = [
  // Easy: Quadratic Equations
  {
    id: 'pr_easy_01',
    difficulty: 'easy',
    board: 'cbse',
    classLevel: 10,
    subject: 'mathematics',
    topic: 'Quadratic Equations (Standard Form)',
    chapterId: 'ch04',
    question: 'In the quadratic equation 3x² - 5x + 2 = 0, what is the value of coefficient a?',
    questionHindi: 'द्विघात समीकरण 3x² - 5x + 2 = 0 में गुणांक a का मान क्या है?',
    options: [
      { id: 'A', text: 'a = 3' },
      { id: 'B', text: 'a = -5' },
      { id: 'C', text: 'a = 2' },
      { id: 'D', text: 'a = 0' },
    ],
    correctOptionId: 'A',
    stepByStepSolution: [
      'Step 1: Compare 3x² - 5x + 2 = 0 with standard form ax² + bx + c = 0.',
      'Step 2: Coefficient of x² is a = 3.',
      'Step 3: Coefficient of x is b = -5, constant term is c = 2.',
    ],
    finalAnswer: 'a = 3',
    hint: 'Compare with ax² + bx + c = 0.',
  },
  {
    id: 'pr_easy_02',
    difficulty: 'easy',
    board: 'cbse',
    classLevel: 10,
    subject: 'mathematics',
    topic: 'Solving Simple Quadratics',
    chapterId: 'ch04',
    question: 'Find the roots of x² - 9 = 0',
    questionHindi: 'समीकरण x² - 9 = 0 के मूल ज्ञात कीजिए',
    options: [
      { id: 'A', text: 'x = 3 only' },
      { id: 'B', text: 'x = ±3' },
      { id: 'C', text: 'x = 9' },
      { id: 'D', text: 'x = -9' },
    ],
    correctOptionId: 'B',
    stepByStepSolution: [
      'Step 1: x² = 9.',
      'Step 2: Take square root of both sides: x = ±√9 = ±3.',
    ],
    finalAnswer: 'x = 3 and x = -3',
    hint: 'Add 9 to both sides and take the square root.',
  },
  {
    id: 'pr_01',
    difficulty: 'easy',
    board: 'cbse',
    classLevel: 10,
    subject: 'mathematics',
    topic: 'Linear Equations',
    chapterId: 'ch03',
    question: 'Solve for x: 2x + 6 = 14',
    questionHindi: 'हल करें: 2x + 6 = 14',
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

  // Hard: Quadratic Equations
  {
    id: 'pr_hard_01',
    difficulty: 'hard',
    board: 'cbse',
    classLevel: 10,
    subject: 'mathematics',
    topic: 'Discriminant & Nature of Roots',
    chapterId: 'ch04',
    question: 'Find the discriminant of 2x² - 4x + 3 = 0 and state the nature of roots.',
    questionHindi: 'समीकरण 2x² - 4x + 3 = 0 का विविक्तकर (Discriminant) ज्ञात कीजिए और मूलों की प्रकृति बताइए।',
    options: [
      { id: 'A', text: 'D = -8 (No real roots)' },
      { id: 'B', text: 'D = 8 (Two distinct real roots)' },
      { id: 'C', text: 'D = 16 (Two equal roots)' },
      { id: 'D', text: 'D = 0 (Equal roots)' },
    ],
    correctOptionId: 'A',
    stepByStepSolution: [
      'Step 1: Identify coefficients a = 2, b = -4, c = 3.',
      'Step 2: Use the discriminant formula D = b² - 4ac.',
      'D = (-4)² - 4(2)(3) = 16 - 24 = -8.',
      'Step 3: Since D < 0, there are no real roots.',
    ],
    finalAnswer: 'D = -8 (No real roots)',
    hint: 'Formula: D = b² - 4ac',
  },
  {
    id: 'pr_hard_02',
    difficulty: 'hard',
    board: 'cbse',
    classLevel: 10,
    subject: 'mathematics',
    topic: 'Equal Roots Condition',
    chapterId: 'ch04',
    question: 'For what value of k does x² - 6x + k = 0 have equal real roots?',
    questionHindi: 'k के किस मान के लिए x² - 6x + k = 0 के बराबर वास्तविक मूल होंगे?',
    options: [
      { id: 'A', text: 'k = 6' },
      { id: 'B', text: 'k = 9' },
      { id: 'C', text: 'k = 12' },
      { id: 'D', text: 'k = 36' },
    ],
    correctOptionId: 'B',
    stepByStepSolution: [
      'Step 1: For equal roots, Discriminant D = 0.',
      'Step 2: D = b² - 4ac = (-6)² - 4(1)(k) = 36 - 4k.',
      'Step 3: 36 - 4k = 0 => 4k = 36 => k = 9.',
    ],
    finalAnswer: 'k = 9',
    hint: 'Set Discriminant D = b² - 4ac equal to 0.',
  },
  {
    id: 'pr_03',
    difficulty: 'easy',
    board: 'cbse',
    classLevel: 10,
    subject: 'science',
    topic: 'Speed, Distance and Time',
    chapterId: 'sci06',
    question: 'A car travels at 20 m/s for 5 seconds. What distance does it travel?',
    questionHindi: 'एक कार 20 m/s की चाल से 5 सेकंड तक चलती है। यह कितनी दूरी तय करेगी?',
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
