import { create } from 'zustand';
import { StudentProfile, EducationLevel, GradeClass, AppLanguage } from '../types/student';

interface ProfileState {
  profile: StudentProfile;
  setName: (name: string) => void;
  setAvatar: (avatarId: string) => void;
  setEducationLevel: (level: EducationLevel) => void;
  setClassNumber: (classNum: GradeClass) => void;
  setLanguage: (lang: AppLanguage) => void;
  setActiveSubject: (subjectId: string) => void;
  updateProfile: (partial: Partial<StudentProfile>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: {
    id: 'student_101',
    name: 'Aarav Sharma',
    avatarId: 'avatar_boy_1',
    educationLevel: 'secondary',
    classNumber: 10,
    language: 'en',
    activeSubjectId: 'class10_math',
    createdAt: '2026-10-07',
    updatedAt: '2026-10-07',
  },

  setName: (name) =>
    set((state) => ({ profile: { ...state.profile, name } })),

  setAvatar: (avatarId) =>
    set((state) => ({ profile: { ...state.profile, avatarId } })),

  setEducationLevel: (educationLevel) =>
    set((state) => ({ profile: { ...state.profile, educationLevel } })),

  setClassNumber: (classNumber) =>
    set((state) => ({ profile: { ...state.profile, classNumber } })),

  setLanguage: (language) =>
    set((state) => ({ profile: { ...state.profile, language } })),

  setActiveSubject: (activeSubjectId) =>
    set((state) => ({ profile: { ...state.profile, activeSubjectId } })),

  updateProfile: (partial) =>
    set((state) => ({ profile: { ...state.profile, ...partial } })),
}));
