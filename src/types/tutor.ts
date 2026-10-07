export type TutorRole = 'student' | 'guru' | 'system';

export type TutorActionType =
  | 'explain_simpler'
  | 'give_example'
  | 'practice'
  | 'quiz'
  | 'ask_followup';

export interface Citation {
  chapterTitle: string;
  topic: string;
  confidenceScore: number;
}

export interface TutorMessage {
  id: string;
  role: TutorRole;
  text: string;
  timestamp: number;
  steps?: string[];
  finalAnswer?: string;
  citations?: Citation[];
  latencyMs?: number;
  ramUsageMB?: number;
  isOffline?: boolean;
}

export interface AIServiceResponse {
  answer: string;
  steps: string[];
  finalAnswer: string;
  citations: Citation[];
  latencyMs: number;
  ramUsageMB: number;
  isOffline: boolean;
  tokensPerSec: number;
}

export interface AIRuntimeStats {
  engineType: 'on_device';
  modelName: string;
  modelSizeMB: number;
  ramUsageMB: number;
  responseTimeSec: number;
  tokensPerSecond: number;
  isOffline: boolean;
  activeModule: string;
}
