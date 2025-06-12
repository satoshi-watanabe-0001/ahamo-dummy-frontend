export interface FormStep {
  id: string;
  name: string;
  completed: boolean;
  data?: any;
}

export interface ProgressState {
  currentStep: number;
  totalSteps: number;
  steps: FormStep[];
  lastUpdated: number;
}

const PROGRESS_STORAGE_KEY = 'ahamo_contract_progress';

export const progressManager = {
  getDefaultSteps: (): FormStep[] => [
    { id: 'personal-info', name: '個人情報', completed: false },
    { id: 'plan-selection', name: 'プラン選択', completed: false },
    { id: 'verification', name: '本人確認', completed: false },
    { id: 'payment', name: '決済', completed: false },
    { id: 'completion', name: '完了', completed: false }
  ],

  saveProgress: (progressState: ProgressState): void => {
    try {
      const dataToStore = {
        ...progressState,
        lastUpdated: Date.now()
      };
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  },

  loadProgress: (): ProgressState | null => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!stored) return null;
      
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load progress:', error);
      return null;
    }
  },

  updateStepCompletion: (stepId: string, completed: boolean, data?: any): void => {
    const currentProgress = progressManager.loadProgress();
    if (!currentProgress) return;

    const stepIndex = currentProgress.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return;

    currentProgress.steps[stepIndex].completed = completed;
    if (data) {
      currentProgress.steps[stepIndex].data = data;
    }

    if (completed) {
      currentProgress.currentStep = Math.max(currentProgress.currentStep, stepIndex + 1);
    }

    progressManager.saveProgress(currentProgress);
  },

  initializeProgress: (): ProgressState => {
    const defaultSteps = progressManager.getDefaultSteps();
    const initialState: ProgressState = {
      currentStep: 0,
      totalSteps: defaultSteps.length,
      steps: defaultSteps,
      lastUpdated: Date.now()
    };
    
    progressManager.saveProgress(initialState);
    return initialState;
  },

  clearProgress: (): void => {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
  },

  getCompletedStepsCount: (): number => {
    const progress = progressManager.loadProgress();
    if (!progress) return 0;
    
    return progress.steps.filter(step => step.completed).length;
  },

  getProgressPercentage: (): number => {
    const progress = progressManager.loadProgress();
    if (!progress) return 0;
    
    const completedCount = progressManager.getCompletedStepsCount();
    return Math.round((completedCount / progress.totalSteps) * 100);
  }
};
