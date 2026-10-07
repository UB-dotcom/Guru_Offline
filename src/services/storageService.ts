import { StorageUsage } from '../types/progress';

class StorageService {
  async getStorageUsage(): Promise<StorageUsage> {
    // Matches Section 30 mockup
    return {
      appSizeMB: 38,
      aiModelSizeMB: 180,
      modulesSizeMB: 100, // Math 48 MB + Science 52 MB
      totalUsedMB: 318,
      freeSpaceMB: 8400, // Typical free storage on 32GB budget phone
      breakdown: [
        { name: 'Guru App', sizeMB: 38, canDelete: false },
        { name: 'On-Device AI Model (SmolLM INT4)', sizeMB: 180, canDelete: false },
        { name: 'Class 10 Mathematics', sizeMB: 48, canDelete: true, moduleId: 'class10_math' },
        { name: 'Class 10 Science', sizeMB: 52, canDelete: true, moduleId: 'class10_science' },
      ],
    };
  }

  async getFreeStorageMB(): Promise<number> {
    return 8400;
  }
}

export const storageService = new StorageService();
