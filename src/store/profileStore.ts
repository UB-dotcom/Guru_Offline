import { create } from 'zustand';
import {
  StudentProfile,
  EducationLevel,
  GradeClass,
  AppLanguage,
  BoardType,
  StreamType,
} from '../types/student';

interface ProfileState {
  profile: StudentProfile;
  setName: (name: string) => void;
  setAvatar: (avatarId: string) => void;
  setLanguage: (lang: AppLanguage) => void;
  setBoard: (board: BoardType) => void;
  setState: (stateName: string | null) => void;
  setClassLevel: (classLevel: number) => void;
  setStream: (stream: StreamType) => void;
  setSelectedSubjects: (subjects: string[]) => void;
  toggleSubject: (subjectId: string) => void;
  setDownloadedModules: (modules: string[]) => void;
  addDownloadedModule: (moduleId: string) => void;
  setEducationLevel: (level: EducationLevel) => void;
  setClassNumber: (classNum: GradeClass) => void;
  setActiveSubject: (subjectId: string) => void;
  updateProfile: (partial: Partial<StudentProfile>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: {
    id: 'student_101',
    name: 'Aarav Sharma',
    avatarId: 'avatar_boy_1',
    language: 'hi',
    board: 'cbse',
    state: null,
    classLevel: 10,
    stream: null,
    selectedSubjects: ['mathematics', 'science'],
    downloadedModules: ['class10_math'],
    educationLevel: 'secondary',
    classNumber: 10,
    activeSubjectId: 'class10_math',
    createdAt: '2026-10-07',
    updatedAt: '2026-10-07',
  },

  setName: (name) =>
    set((state) => ({ profile: { ...state.profile, name, updatedAt: new Date().toISOString() } })),

  setAvatar: (avatarId) =>
    set((state) => ({ profile: { ...state.profile, avatarId, updatedAt: new Date().toISOString() } })),

  setLanguage: (language) =>
    set((state) => ({ profile: { ...state.profile, language, updatedAt: new Date().toISOString() } })),

  setBoard: (board) =>
    set((state) => ({
      profile: {
        ...state.profile,
        board,
        state: board === 'state' ? state.profile.state || 'bihar' : null,
        updatedAt: new Date().toISOString(),
      },
    })),

  setState: (stateName) =>
    set((state) => ({ profile: { ...state.profile, state: stateName, updatedAt: new Date().toISOString() } })),

  setClassLevel: (classLevel) =>
    set((state) => ({
      profile: {
        ...state.profile,
        classLevel,
        classNumber: classLevel,
        stream: classLevel >= 11 ? (state.profile.stream || 'science') : null,
        updatedAt: new Date().toISOString(),
      },
    })),

  setStream: (stream) =>
    set((state) => ({ profile: { ...state.profile, stream, updatedAt: new Date().toISOString() } })),

  setSelectedSubjects: (selectedSubjects) =>
    set((state) => ({ profile: { ...state.profile, selectedSubjects, updatedAt: new Date().toISOString() } })),

  toggleSubject: (subjectId) =>
    set((state) => {
      const exists = state.profile.selectedSubjects.includes(subjectId);
      const updated = exists
        ? state.profile.selectedSubjects.filter((s) => s !== subjectId)
        : [...state.profile.selectedSubjects, subjectId];
      return { profile: { ...state.profile, selectedSubjects: updated, updatedAt: new Date().toISOString() } };
    }),

  setDownloadedModules: (downloadedModules) =>
    set((state) => ({ profile: { ...state.profile, downloadedModules, updatedAt: new Date().toISOString() } })),

  addDownloadedModule: (moduleId) =>
    set((state) => {
      if (state.profile.downloadedModules.includes(moduleId)) return state;
      return {
        profile: {
          ...state.profile,
          downloadedModules: [...state.profile.downloadedModules, moduleId],
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  setEducationLevel: (educationLevel) =>
    set((state) => ({ profile: { ...state.profile, educationLevel, updatedAt: new Date().toISOString() } })),

  setClassNumber: (classNumber) =>
    set((state) => ({
      profile: {
        ...state.profile,
        classNumber,
        classLevel: classNumber,
        stream: classNumber >= 11 ? (state.profile.stream || 'science') : null,
        updatedAt: new Date().toISOString(),
      },
    })),

  setActiveSubject: (activeSubjectId) =>
    set((state) => ({ profile: { ...state.profile, activeSubjectId, updatedAt: new Date().toISOString() } })),

  updateProfile: (partial) =>
    set((state) => ({ profile: { ...state.profile, ...partial, updatedAt: new Date().toISOString() } })),
}));
