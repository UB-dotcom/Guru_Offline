import { create } from 'zustand';
import { LearningModule } from '../types/module';
import { mockModules } from '../data/mockModules';
import { downloadService } from '../services/downloadService';

interface ModuleState {
  modules: LearningModule[];
  activeModuleId: string;
  isOfflineMode: boolean; // Mock connectivity state
  toggleOfflineMode: () => void;
  setOfflineMode: (offline: boolean) => void;
  setActiveModule: (id: string) => void;
  downloadModule: (id: string) => void;
  pauseDownload: (id: string) => void;
  resumeDownload: (id: string) => void;
  deleteModule: (id: string) => void;
  getActiveModule: () => LearningModule | undefined;
}

export const useModuleStore = create<ModuleState>((set, get) => ({
  modules: mockModules,
  activeModuleId: 'class10_math',
  isOfflineMode: true, // Offline by default matching the core value prop

  toggleOfflineMode: () =>
    set((state) => ({ isOfflineMode: !state.isOfflineMode })),

  setOfflineMode: (isOfflineMode) =>
    set({ isOfflineMode }),

  setActiveModule: (id) =>
    set({ activeModuleId: id }),

  downloadModule: (id) => {
    const modules = get().modules.map((m) =>
      m.id === id ? { ...m, isDownloading: true, isPaused: false, downloadProgress: 10 } : m
    );
    set({ modules });

    downloadService.startDownload(id, 50 * 1024 * 1024, (state) => {
      set((s) => ({
        modules: s.modules.map((m) =>
          m.id === id
            ? {
                ...m,
                downloadProgress: state.progress,
                downloaded: state.status === 'completed',
                isDownloading: state.status === 'downloading',
                isPaused: state.status === 'paused',
              }
            : m
        ),
      }));
    });
  },

  pauseDownload: (id) => {
    downloadService.pauseDownload(id);
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === id ? { ...m, isDownloading: false, isPaused: true } : m
      ),
    }));
  },

  resumeDownload: (id) => {
    downloadService.resumeDownload(id);
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === id ? { ...m, isDownloading: true, isPaused: false } : m
      ),
    }));
  },

  deleteModule: (id) => {
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === id ? { ...m, downloaded: false, downloadProgress: 0 } : m
      ),
    }));
  },

  getActiveModule: () => {
    return get().modules.find((m) => m.id === get().activeModuleId);
  },
}));
