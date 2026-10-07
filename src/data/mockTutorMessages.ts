import { TutorMessage } from '../types/tutor';

export const initialTutorMessages: TutorMessage[] = [
  {
    id: 'msg_welcome',
    role: 'guru',
    text: 'Namaste! I am Guru, your offline on-device AI teacher. Wi-Fi and mobile data are off, but I can guide you through your Class 10 curriculum step by step!',
    timestamp: Date.now() - 60000,
    isOffline: true,
  },
  {
    id: 'msg_student_1',
    role: 'student',
    text: 'Explain quadratic equations.',
    timestamp: Date.now() - 30000,
  },
  {
    id: 'msg_guru_1',
    role: 'guru',
    text: `Let's understand quadratic equations step by step.

Step 1: Standard Form
A quadratic equation in variable x is written as:
ax² + bx + c = 0 (where a ≠ 0, and a, b, c are real numbers)

Step 2: Methods to Solve
1. Factorization: Splitting the middle term bx into two factors.
2. Quadratic Formula:
x = (-b ± √(b² - 4ac)) / (2a)

Step 3: Nature of Roots (Discriminant D = b² - 4ac)
• If D > 0: Two distinct real roots
• If D = 0: Two equal real roots (x = -b / 2a)
• If D < 0: No real roots (complex roots)

Final Takeaway:
Always check the discriminant D first to know if real roots exist before solving!`,
    timestamp: Date.now() - 25000,
    steps: [
      'Standard Form: ax² + bx + c = 0 (a ≠ 0)',
      'Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a)',
      'Nature of roots determined by D = b² - 4ac',
    ],
    finalAnswer: 'x = (-b ± √D) / (2a)',
    citations: [
      {
        chapterTitle: 'Chapter 4: Quadratic Equations',
        topic: 'NCERT Class 10 Mathematics',
        confidenceScore: 0.94,
      },
    ],
    latencyMs: 280,
    ramUsageMB: 142.5,
    isOffline: true,
  },
];
