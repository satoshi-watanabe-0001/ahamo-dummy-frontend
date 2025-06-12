import { useState, useEffect, useCallback } from 'react';
import { deviceApi } from '../utils/api';
import { Device } from '../types';

interface DeviceInventory {
  color: string;
  storageOptions: Array<{
    storage: string;
    inStock: boolean;
    quantity: number;
  }>;
}

interface UseDeviceDetailResult {
  device: Device | null;
  inventory: DeviceInventory[] | null;
  loading: boolean;
  error: string | null;
  selectedColor: string;
  selectedStorage: string;
  setSelectedColor: (color: string) => void;
  setSelectedStorage: (storage: string) => void;
  refetch: () => Promise<void>;
}

export function useDeviceDetail(deviceId: string): UseDeviceDetailResult {
  const [device, setDevice] = useState<Device | null>(null);
  const [inventory, setInventory] = useState<DeviceInventory[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');

  const fetchDeviceDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [deviceResponse, inventoryResponse] = await Promise.all([
        deviceApi.getDevice(deviceId),
        deviceApi.getInventory(deviceId)
      ]);
      
      const deviceData = deviceResponse.data as Device;
      const inventoryData = inventoryResponse.data as { inventory: DeviceInventory[] };
      
      setDevice(deviceData);
      setInventory(inventoryData.inventory);
      
      if (deviceData.colors && deviceData.colors.length > 0) {
        setSelectedColor(deviceData.colors[0]);
      }
      if (deviceData.storageOptions && deviceData.storageOptions.length > 0) {
        setSelectedStorage(deviceData.storageOptions[0]);
      }
      
    } catch (err) {
      setError('デバイス情報の取得に失敗しました。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    fetchDeviceDetail();
  }, [fetchDeviceDetail]);

  return {
    device,
    inventory,
    loading,
    error,
    selectedColor,
    selectedStorage,
    setSelectedColor,
    setSelectedStorage,
    refetch: fetchDeviceDetail
  };
}
