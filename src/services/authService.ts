import { User, LoginCredentials, SignupData } from '../types/auth';

class AuthService {
  private currentUser: User | null = {
    id: 'student_101',
    name: 'Aarav Sharma',
    email: 'aarav@school.edu',
    phone: '+91 98765 43210',
    isGuest: false,
  };

  async login(credentials: LoginCredentials): Promise<User> {
    // Simulated network delay for auth
    await new Promise((res) => setTimeout(res, 500));
    const user: User = {
      id: 'student_101',
      name: credentials.emailOrPhone.split('@')[0] || 'Student',
      email: credentials.type === 'email' ? credentials.emailOrPhone : undefined,
      phone: credentials.type === 'phone' ? credentials.emailOrPhone : undefined,
    };
    this.currentUser = user;
    return user;
  }

  async signup(data: SignupData): Promise<User> {
    await new Promise((res) => setTimeout(res, 600));
    const user: User = {
      id: `student_${Date.now()}`,
      name: data.fullName,
      email: data.emailOrPhone.includes('@') ? data.emailOrPhone : undefined,
      phone: !data.emailOrPhone.includes('@') ? data.emailOrPhone : undefined,
    };
    this.currentUser = user;
    return user;
  }

  async verifyOTP(otp: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 400));
    return otp.length === 6;
  }

  async resetPassword(emailOrPhone: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 400));
    return true;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export const authService = new AuthService();
