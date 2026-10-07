import { LearningModule } from '../types/module';
import { mockModules } from '../data/mockModules';

class ModuleService {
  private modules: LearningModule[] = [...mockModules];

  async getModules(): Promise<LearningModule[]> {
    return this.modules;
  }

  async getModuleDetails(moduleId: string): Promise<LearningModule | undefined> {
    return this.modules.find((m) => m.id === moduleId);
  }

  async getDownloadedModules(): Promise<LearningModule[]> {
    return this.modules.filter((m) => m.downloaded);
  }

  async markAsDownloaded(moduleId: string): Promise<boolean> {
    const mod = this.modules.find((m) => m.id === moduleId);
    if (mod) {
      mod.downloaded = true;
      mod.downloadProgress = 100;
      mod.isDownloading = false;
      return true;
    }
    return false;
  }

  async deleteModule(moduleId: string): Promise<boolean> {
    const mod = this.modules.find((m) => m.id === moduleId);
    if (mod) {
      mod.downloaded = false;
      mod.downloadProgress = 0;
      return true;
    }
    return false;
  }

  async updateModule(moduleId: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 800));
    return true;
  }
}

export const moduleService = new ModuleService();
