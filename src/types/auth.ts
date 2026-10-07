export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isGuest?: boolean;
}

export interface LoginCredentials {
  emailOrPhone: string;
  password?: string;
  otp?: string;
  type: 'email' | 'phone';
}

export interface SignupData {
  fullName: string;
  emailOrPhone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  logout: () => void;
}
