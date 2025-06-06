import { ApiResponse, ApiError, ErrorSeverity } from './api';
import { Device, Contract, AdminDeviceRequest, DeviceImportResult } from '../types';
import { mockPlans, mockDevices, mockContracts } from '../data/mockData';

const STORAGE_KEYS = {
  PLANS: 'ahamo_mock_plans',
  DEVICES: 'ahamo_mock_devices',
  CONTRACTS: 'ahamo_mock_contracts'
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredDataTyped = <T>(key: string, defaultData: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T[] : defaultData;
  } catch {
    return defaultData;
  }
};

const setStoredData = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const createMockResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  data,
  message,
  status: 200
});

const createMockError = (message: string, status: number = 400): ApiError => ({
  message,
  status,
  severity: ErrorSeverity.CRITICAL,
  resolution: 'データを確認して再試行してください'
});

class MockApiClient {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    await delay(300 + Math.random() * 500);
    
    if (endpoint === '/api/v1/plans') {
      const plans = getStoredDataTyped(STORAGE_KEYS.PLANS, mockPlans);
      return createMockResponse({ plans, total: plans.length } as T);
    }
    
    if (endpoint.startsWith('/api/v1/plans/')) {
      const id = endpoint.split('/').pop();
      const plans = getStoredDataTyped(STORAGE_KEYS.PLANS, mockPlans);
      const plan = plans.find(p => p.id === id);
      if (!plan) {
        throw createMockError('プランが見つかりません', 404);
      }
      return createMockResponse(plan as T);
    }
    
    if (endpoint === '/api/devices') {
      const devices = getStoredDataTyped(STORAGE_KEYS.DEVICES, mockDevices);
      return createMockResponse({ devices, total: devices.length } as T);
    }
    
    if (endpoint.startsWith('/api/devices/')) {
      const id = endpoint.split('/').pop();
      const devices = getStoredDataTyped(STORAGE_KEYS.DEVICES, mockDevices);
      const device = devices.find(d => d.id === id);
      if (!device) {
        throw createMockError('デバイスが見つかりません', 404);
      }
      return createMockResponse(device as T);
    }
    
    if (endpoint === '/api/v1/admin/devices') {
      const devices = getStoredDataTyped(STORAGE_KEYS.DEVICES, mockDevices);
      return createMockResponse(devices as T);
    }
    
    if (endpoint === '/api/v1/admin/devices/export') {
      const devices = getStoredDataTyped(STORAGE_KEYS.DEVICES, mockDevices);
      const csvHeader = 'ID,名前,ブランド,カテゴリ,価格帯,価格,在庫\n';
      const csvData = devices.map((device: Device) => 
        `${device.id},${device.name},${device.brand},${device.category},${device.priceRange},${device.price},${device.inStock ? '有り' : '無し'}`
      ).join('\n');
      return createMockResponse((csvHeader + csvData) as T);
    }
    
    if (endpoint === '/api/contracts') {
      const contracts = getStoredDataTyped(STORAGE_KEYS.CONTRACTS, mockContracts);
      return createMockResponse({ contracts, total: contracts.length } as T);
    }
    
    if (endpoint.startsWith('/api/contracts/')) {
      const id = endpoint.split('/').pop();
      const contracts = getStoredDataTyped(STORAGE_KEYS.CONTRACTS, mockContracts);
      const contract = contracts.find(c => c.id === id);
      if (!contract) {
        throw createMockError('契約が見つかりません', 404);
      }
      return createMockResponse(contract as T);
    }
    
    throw createMockError('エンドポイントが見つかりません', 404);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    await delay(500 + Math.random() * 700);
    
    if (endpoint === '/api/v1/admin/devices') {
      const devices = getStoredDataTyped(STORAGE_KEYS.DEVICES, mockDevices);
      const newDevice: Device = {
        ...data,
        id: generateId(),
        colors: data.colors || [],
        storageOptions: data.storageOptions || [],
        galleryImages: data.galleryImages || []
      };
      devices.push(newDevice);
      setStoredData(STORAGE_KEYS.DEVICES, devices);
      return createMockResponse(newDevice as T, 'デバイスが作成されました');
    }
    
    if (endpoint === '/api/contracts') {
      const contracts = getStoredDataTyped(STORAGE_KEYS.CONTRACTS, mockContracts);
      const newContract: Contract = {
        ...data,
        id: generateId()
      };
      contracts.push(newContract);
      setStoredData(STORAGE_KEYS.CONTRACTS, contracts);
      return createMockResponse(newContract as T, '契約が作成されました');
    }
    
    throw createMockError('エンドポイントが見つかりません', 404);
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    await delay(400 + Math.random() * 600);
    
    if (endpoint.startsWith('/api/v1/admin/devices/')) {
      const id = endpoint.split('/').pop();
      const devices = getStoredDataTyped(STORAGE_KEYS.DEVICES, mockDevices);
      const index = devices.findIndex(d => d.id === id);
      if (index === -1) {
        throw createMockError('デバイスが見つかりません', 404);
      }
      devices[index] = { ...devices[index], ...data };
      setStoredData(STORAGE_KEYS.DEVICES, devices);
      return createMockResponse(devices[index] as T, 'デバイスが更新されました');
    }
    
    if (endpoint.startsWith('/api/contracts/')) {
      const id = endpoint.split('/').pop();
      const contracts = getStoredDataTyped(STORAGE_KEYS.CONTRACTS, mockContracts);
      const index = contracts.findIndex(c => c.id === id);
      if (index === -1) {
        throw createMockError('契約が見つかりません', 404);
      }
      contracts[index] = { ...contracts[index], ...data };
      setStoredData(STORAGE_KEYS.CONTRACTS, contracts);
      return createMockResponse(contracts[index] as T, '契約が更新されました');
    }
    
    throw createMockError('エンドポイントが見つかりません', 404);
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.put<T>(endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    await delay(300 + Math.random() * 400);
    
    if (endpoint.startsWith('/api/v1/admin/devices/')) {
      const id = endpoint.split('/').pop();
      const devices = getStoredDataTyped(STORAGE_KEYS.DEVICES, mockDevices);
      const index = devices.findIndex(d => d.id === id);
      if (index === -1) {
        throw createMockError('デバイスが見つかりません', 404);
      }
      const deletedDevice = devices.splice(index, 1)[0];
      setStoredData(STORAGE_KEYS.DEVICES, devices);
      return createMockResponse(deletedDevice as T, 'デバイスが削除されました');
    }
    
    if (endpoint.startsWith('/api/contracts/')) {
      const id = endpoint.split('/').pop();
      const contracts = getStoredDataTyped(STORAGE_KEYS.CONTRACTS, mockContracts);
      const index = contracts.findIndex(c => c.id === id);
      if (index === -1) {
        throw createMockError('契約が見つかりません', 404);
      }
      const deletedContract = contracts.splice(index, 1)[0];
      setStoredData(STORAGE_KEYS.CONTRACTS, contracts);
      return createMockResponse(deletedContract as T, '契約が削除されました');
    }
    
    throw createMockError('エンドポイントが見つかりません', 404);
  }
}

export const mockApiClient = new MockApiClient();

export const mockContractApi = {
  getContracts: () => mockApiClient.get('/api/contracts'),
  getContract: (id: string) => mockApiClient.get(`/api/contracts/${id}`),
  createContract: (data: any) => mockApiClient.post('/api/contracts', data),
  updateContract: (id: string, data: any) => mockApiClient.put(`/api/contracts/${id}`, data),
  deleteContract: (id: string) => mockApiClient.delete(`/api/contracts/${id}`),
};

export const mockPlanApi = {
  getPlans: () => mockApiClient.get('/api/v1/plans'),
  getPlan: (id: string) => mockApiClient.get(`/api/v1/plans/${id}`),
};

export const mockDeviceApi = {
  getDevices: () => mockApiClient.get('/api/devices'),
  getDevice: (id: string) => mockApiClient.get(`/api/devices/${id}`),
};

export const mockAdminDeviceApi = {
  getAllDevices: () => mockApiClient.get('/api/v1/admin/devices'),
  createDevice: (data: AdminDeviceRequest) => mockApiClient.post('/api/v1/admin/devices', data),
  updateDevice: (id: string, data: AdminDeviceRequest) => mockApiClient.put(`/api/v1/admin/devices/${id}`, data),
  deleteDevice: (id: string) => mockApiClient.delete(`/api/v1/admin/devices/${id}`),
  importDevices: async (file: File): Promise<Response> => {
    await delay(1000 + Math.random() * 1500);
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvContent = e.target?.result as string;
          const lines = csvContent.split('\n').filter(line => line.trim());
          
          let successfulRows = 0;
          let failedRows = 0;
          const errors: Array<{ rowNumber: number; deviceId: string; errorMessage: string }> = [];
          
          const devices = getStoredDataTyped(STORAGE_KEYS.DEVICES, mockDevices);
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= 6) {
              try {
                const newDevice: Device = {
                  id: generateId(),
                  name: values[1] || `インポートデバイス${i}`,
                  brand: values[2] || 'Unknown',
                  category: (values[3] === 'iPhone' ? 'iPhone' : 'Android') as 'iPhone' | 'Android',
                  priceRange: (['entry', 'mid', 'premium'].includes(values[4]) ? values[4] : 'mid') as 'entry' | 'mid' | 'premium',
                  price: parseInt(values[5]) || 0,
                  colors: [],
                  storageOptions: [],
                  inStock: values[6] === '有り',
                  imageUrl: '',
                  specifications: '',
                  galleryImages: []
                };
                devices.push(newDevice);
                successfulRows++;
              } catch (error) {
                failedRows++;
                errors.push({
                  rowNumber: i + 1,
                  deviceId: values[0] || `row-${i}`,
                  errorMessage: 'データの形式が正しくありません'
                });
              }
            } else {
              failedRows++;
              errors.push({
                rowNumber: i + 1,
                deviceId: values[0] || `row-${i}`,
                errorMessage: '必要な列数が不足しています'
              });
            }
          }
          
          setStoredData(STORAGE_KEYS.DEVICES, devices);
          
          const result: DeviceImportResult = {
            successfulRows,
            failedRows,
            totalRows: lines.length - 1,
            errors
          };
          
          resolve(new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }));
        } catch (error) {
          const result: DeviceImportResult = {
            successfulRows: 0,
            failedRows: 0,
            totalRows: 0,
            errors: [{
              rowNumber: 1,
              deviceId: 'unknown',
              errorMessage: 'ファイルの読み込みに失敗しました'
            }]
          };
          
          resolve(new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
      };
      reader.readAsText(file);
    });
  },
  exportDevices: () => mockApiClient.get('/api/v1/admin/devices/export'),
  uploadImage: async (file: File): Promise<Response> => {
    await delay(800 + Math.random() * 1200);
    
    const mockImageUrl = `https://example.com/uploaded/${file.name}`;
    return new Response(JSON.stringify({ imageUrl: mockImageUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  },
};

export const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PLANS)) {
    setStoredData(STORAGE_KEYS.PLANS, mockPlans);
  }
  if (!localStorage.getItem(STORAGE_KEYS.DEVICES)) {
    setStoredData(STORAGE_KEYS.DEVICES, mockDevices);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTRACTS)) {
    setStoredData(STORAGE_KEYS.CONTRACTS, mockContracts);
  }
};
