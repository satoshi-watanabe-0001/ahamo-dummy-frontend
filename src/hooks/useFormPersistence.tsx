import { useEffect, useCallback, useState } from 'react';
import { secureStorage } from '../utils/secureStorage';
import { progressManager } from '../utils/progressManager';
import { useDebounce } from './useDebounce';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseFormPersistenceOptions {
  formId: string;
  debounceMs?: number;
  autoSave?: boolean;
  onSave?: (data: any) => void;
  onRestore?: (data: any) => void;
}

export const useFormPersistence = (options: UseFormPersistenceOptions) => {
  const {
    formId,
    debounceMs = 500,
    autoSave = true,
    onSave,
    onRestore
  } = options;

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState<any>(null);

  const debouncedFormData = useDebounce(formData, debounceMs);

  const saveData = useCallback(async (data: any) => {
    if (!data || Object.keys(data).length === 0) return;

    setSaveStatus('saving');
    
    try {
      secureStorage.store(data);
      progressManager.updateStepCompletion(formId, true, data);
      
      setSaveStatus('saved');
      setLastSavedTime(new Date());
      
      onSave?.(data);
    } catch (error) {
      console.error('Failed to save form data:', error);
      setSaveStatus('error');
    }
  }, [formId, onSave]);

  const loadData = useCallback(() => {
    try {
      const storedData = secureStorage.retrieve();
      if (storedData) {
        setFormData(storedData);
        onRestore?.(storedData);
        return storedData;
      }
    } catch (error) {
      console.error('Failed to load form data:', error);
    }
    return null;
  }, [onRestore]);

  const clearData = useCallback(() => {
    secureStorage.clear();
    progressManager.updateStepCompletion(formId, false);
    setFormData(null);
    setSaveStatus('idle');
    setLastSavedTime(undefined);
  }, [formId]);

  const manualSave = useCallback(() => {
    if (formData) {
      saveData(formData);
    }
  }, [formData, saveData]);

  const updateFormData = useCallback((data: any) => {
    setFormData(data);
  }, []);

  useEffect(() => {
    if (autoSave && debouncedFormData) {
      saveData(debouncedFormData);
    }
  }, [debouncedFormData, autoSave, saveData]);

  const hasStoredData = useCallback(() => {
    return secureStorage.hasStoredData();
  }, []);

  const getExpirationTime = useCallback(() => {
    return secureStorage.getExpirationTime();
  }, []);

  const getRemainingTime = useCallback(() => {
    return secureStorage.getRemainingTime();
  }, []);

  return {
    saveStatus,
    lastSavedTime,
    formData,
    saveData,
    loadData,
    clearData,
    manualSave,
    updateFormData,
    hasStoredData,
    getExpirationTime,
    getRemainingTime
  };
};
