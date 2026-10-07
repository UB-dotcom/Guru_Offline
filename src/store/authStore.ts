import { create } from 'zustand';
import { User, LoginCredentials, SignupData } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: true, // Default to true for instant hackathon demonstration
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const user = await authService.login(credentials);
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  signup: async (data) => {
    set({ isLoading: true });
    try {
      const user = await authService.signup(data);
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  verifyOTP: async (otp) => {
    set({ isLoading: true });
    const success = await authService.verifyOTP(otp);
    set({ isLoading: false });
    return success;
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  continueAsGuest: () => {
    set({
      user: { id: 'guest', name: 'Student', isGuest: true },
      isAuthenticated: true,
    });
  },
}));
