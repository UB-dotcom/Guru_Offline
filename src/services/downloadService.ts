import { ModuleDownloadState } from '../types/module';

type ProgressListener = (state: ModuleDownloadState) => void;

class DownloadService {
  private activeDownloads: Map<string, ModuleDownloadState> = new Map();
  private listeners: Map<string, Set<ProgressListener>> = new Map();
  private timers: Map<string, ReturnJSInterval> = new Map();

  startDownload(
    moduleId: string,
    totalBytes: number = 50 * 1024 * 1024,
    onProgress?: ProgressListener
  ) {
    if (onProgress) {
      if (!this.listeners.has(moduleId)) {
        this.listeners.set(moduleId, new Set());
      }
      this.listeners.get(moduleId)!.add(onProgress);
    }

    const state: ModuleDownloadState = this.activeDownloads.get(moduleId) || {
      moduleId,
      bytesDownloaded: 0,
      totalBytes,
      progress: 0,
      status: 'downloading',
    };

    state.status = 'downloading';
    this.activeDownloads.set(moduleId, state);

    if (this.timers.has(moduleId)) {
      clearInterval(this.timers.get(moduleId)!);
    }

    const timer = setInterval(() => {
      const current = this.activeDownloads.get(moduleId);
      if (!current || current.status !== 'downloading') {
        clearInterval(timer);
        return;
      }

      const increment = totalBytes * 0.08;
      current.bytesDownloaded = Math.min(current.totalBytes, current.bytesDownloaded + increment);
      current.progress = Math.round((current.bytesDownloaded / current.totalBytes) * 100);

      this.notify(moduleId, current);

      if (current.bytesDownloaded >= current.totalBytes) {
        current.status = 'completed';
        current.progress = 100;
        clearInterval(timer);
        this.notify(moduleId, current);
      }
    }, 250);

    this.timers.set(moduleId, timer as unknown as ReturnJSInterval);
  }

  pauseDownload(moduleId: string) {
    const current = this.activeDownloads.get(moduleId);
    if (current && current.status === 'downloading') {
      current.status = 'paused';
      if (this.timers.has(moduleId)) {
        clearInterval(this.timers.get(moduleId)!);
      }
      this.notify(moduleId, current);
    }
  }

  resumeDownload(moduleId: string) {
    const current = this.activeDownloads.get(moduleId);
    if (current && current.status === 'paused') {
      this.startDownload(moduleId, current.totalBytes);
    }
  }

  simulateConnectionDrop(moduleId: string) {
    const current = this.activeDownloads.get(moduleId);
    if (current) {
      current.status = 'error';
      current.errorMessage = 'Connection interrupted. Your progress is saved.';
      if (this.timers.has(moduleId)) {
        clearInterval(this.timers.get(moduleId)!);
      }
      this.notify(moduleId, current);
    }
  }

  private notify(moduleId: string, state: ModuleDownloadState) {
    const callbacks = this.listeners.get(moduleId);
    if (callbacks) {
      callbacks.forEach((cb) => cb({ ...state }));
    }
  }
}

type ReturnJSInterval = any;

export const downloadService = new DownloadService();
