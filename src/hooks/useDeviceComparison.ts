import { useState, useCallback } from 'react';
import { deviceApi } from '../utils/api';
import { Device } from '../types';

interface UseDeviceComparisonResult {
  comparisonDevices: Device[];
  loading: boolean;
  error: string | null;
  addDevice: (deviceId: string) => Promise<void>;
  removeDevice: (deviceId: string) => void;
  clearComparison: () => void;
  canAddMore: boolean;
}

export function useDeviceComparison(): UseDeviceComparisonResult {
  const [comparisonDevices, setComparisonDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDevice = useCallback(async (deviceId: string) => {
    if (comparisonDevices.length >= 3) {
      setError('最大3台まで比較できます。');
      return;
    }

    if (comparisonDevices.some(device => device.id === deviceId)) {
      setError('このデバイスは既に比較リストに追加されています。');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await deviceApi.getDevice(deviceId);
      const device = response.data as Device;
      
      setComparisonDevices(prev => [...prev, device]);
    } catch (err) {
      setError('デバイス情報の取得に失敗しました。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [comparisonDevices]);

  const removeDevice = useCallback((deviceId: string) => {
    setComparisonDevices(prev => prev.filter(device => device.id !== deviceId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonDevices([]);
  }, []);

  return {
    comparisonDevices,
    loading,
    error,
    addDevice,
    removeDevice,
    clearComparison,
    canAddMore: comparisonDevices.length < 3
  };
}
