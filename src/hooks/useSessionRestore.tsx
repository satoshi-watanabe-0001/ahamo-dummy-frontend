import { useState, useEffect, useCallback } from 'react';
import { secureStorage } from '../utils/secureStorage';
import { progressManager } from '../utils/progressManager';

interface UseSessionRestoreOptions {
  onRestore?: (data: any) => void;
  onStartFresh?: () => void;
  autoShow?: boolean;
}

export const useSessionRestore = (options: UseSessionRestoreOptions = {}) => {
  const { onRestore, onStartFresh, autoShow = true } = options;
  
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [hasStoredData, setHasStoredData] = useState(false);

  const checkForStoredData = useCallback(() => {
    const hasData = secureStorage.hasStoredData();
    setHasStoredData(hasData);
    
    if (hasData && autoShow) {
      setShowRestoreDialog(true);
    }
    
    return hasData;
  }, [autoShow]);

  const handleRestore = useCallback(async () => {
    try {
      const storedData = secureStorage.retrieve();
      if (storedData) {
        onRestore?.(storedData);
      }
    } catch (error) {
      console.error('Failed to restore session data:', error);
    } finally {
      setShowRestoreDialog(false);
    }
  }, [onRestore]);

  const handleStartFresh = useCallback(async () => {
    try {
      secureStorage.clear();
      progressManager.clearProgress();
      onStartFresh?.();
    } catch (error) {
      console.error('Failed to clear session data:', error);
    } finally {
      setShowRestoreDialog(false);
      setHasStoredData(false);
    }
  }, [onStartFresh]);

  const closeDialog = useCallback(() => {
    setShowRestoreDialog(false);
  }, []);

  const showDialog = useCallback(() => {
    if (hasStoredData) {
      setShowRestoreDialog(true);
    }
  }, [hasStoredData]);

  useEffect(() => {
    checkForStoredData();
  }, [checkForStoredData]);

  const getStoredDataInfo = useCallback(() => {
    if (!hasStoredData) return null;
    
    return {
      expirationTime: secureStorage.getExpirationTime(),
      remainingTime: secureStorage.getRemainingTime(),
      hasData: true
    };
  }, [hasStoredData]);

  return {
    showRestoreDialog,
    hasStoredData,
    handleRestore,
    handleStartFresh,
    closeDialog,
    showDialog,
    checkForStoredData,
    getStoredDataInfo
  };
};
