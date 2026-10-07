import { create } from 'zustand';
import { TutorMessage, TutorActionType } from '../types/tutor';
import { initialTutorMessages } from '../data/mockTutorMessages';
import { aiService } from '../services/aiService';

interface TutorState {
  messages: TutorMessage[];
  isThinking: boolean;
  currentContext: string;
  setContext: (context: string) => void;
  askGuru: (question: string, actionType?: TutorActionType) => Promise<void>;
  clearChat: () => void;
}

export const useTutorStore = create<TutorState>((set, get) => ({
  messages: initialTutorMessages,
  isThinking: false,
  currentContext: 'Class 10 Mathematics — Chapter 4: Quadratic Equations',

  setContext: (currentContext) => set({ currentContext }),

  askGuru: async (question: string, actionType: TutorActionType = 'ask_followup') => {
    const studentMessage: TutorMessage = {
      id: `msg_s_${Date.now()}`,
      role: 'student',
      text: question,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, studentMessage],
      isThinking: true,
    }));

    try {
      const response = await aiService.ask(question, get().currentContext, actionType);
      const guruMessage: TutorMessage = {
        id: `msg_g_${Date.now()}`,
        role: 'guru',
        text: response.answer,
        timestamp: Date.now(),
        steps: response.steps,
        finalAnswer: response.finalAnswer,
        citations: response.citations,
        latencyMs: response.latencyMs,
        ramUsageMB: response.ramUsageMB,
        isOffline: response.isOffline,
      };

      set((state) => ({
        messages: [...state.messages, guruMessage],
        isThinking: false,
      }));
    } catch {
      set({ isThinking: false });
    }
  },

  clearChat: () => {
    set({
      messages: [
        {
          id: `msg_welcome_${Date.now()}`,
          role: 'guru',
          text: 'Chat cleared. Ask me any new curriculum question!',
          timestamp: Date.now(),
          isOffline: true,
        },
      ],
    });
  },
}));
