import { Quiz, QuizResult } from '../types/quiz';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  OTP: { phone?: string; email?: string } | undefined;
  ForgotPassword: undefined;
};

export type OnboardingStackParamList = {
  ProfileSetup: undefined;
  EducationLevel: undefined;
  ClassSelection: undefined;
  LanguageSelection: undefined;
  ModuleSelection: undefined;
  ModuleDownload: { selectedModuleIds: string[] };
};

export type MainTabParamList = {
  HomeTab: undefined;
  ModulesTab: undefined;
  TutorTab: { initialPrompt?: string; context?: string } | undefined;
  ProgressTab: undefined;
  ProfileTab: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  ModuleDetails: { moduleId: string };
  Reader: { moduleId: string; chapterId: string };
  Practice: { topic?: string; chapterId?: string } | undefined;
  Quiz: { quizId?: string } | undefined;
  QuizResult: { result: QuizResult; quiz: Quiz };
  Settings: undefined;
  Storage: undefined;
  AIInfo: undefined;
  EducationLevel: undefined;
  ClassSelection: undefined;
  LanguageSelection: undefined;
  ModuleSelection: undefined;
  ModuleDownload: { selectedModuleIds: string[] };
  Tutor: { initialPrompt?: string; context?: string } | undefined;
  Modules: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
};
