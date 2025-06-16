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
    
    if (endpoint.startsWith('/api/payments/') && endpoint.endsWith('/status')) {
      const transactionId = endpoint.split('/')[3];
      return this.getPaymentStatus(transactionId) as Promise<ApiResponse<T>>;
    }
    
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
    
    if (endpoint.startsWith('/api/devices/') && endpoint.endsWith('/inventory')) {
      const id = endpoint.split('/')[3];
      const devices = getStoredDataTyped(STORAGE_KEYS.DEVICES, mockDevices);
      const device = devices.find(d => d.id === id);
      if (!device) {
        throw createMockError('デバイスが見つかりません', 404);
      }
      const inventory = device.colors?.map(color => ({
        color,
        storageOptions: device.storageOptions?.map(storage => ({
          storage,
          inStock: Math.random() > 0.3,
          quantity: Math.floor(Math.random() * 10)
        })) || []
      })) || [];
      return createMockResponse({ inventory } as T);
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
    
    if (endpoint === '/api/payments/process') {
      return this.processPayment(data) as Promise<ApiResponse<T>>;
    }
    
    if (endpoint.startsWith('/api/payments/') && endpoint.endsWith('/retry')) {
      const transactionId = endpoint.split('/')[3];
      return this.retryPayment(transactionId, data) as Promise<ApiResponse<T>>;
    }
    
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

  async processPayment(paymentData: any): Promise<any> {
    await delay(800 + Math.random() * 1200);
    
    const scenario = Math.random();
    const transactionId = `TXN_${Date.now()}`;
    
    if (scenario > 0.7) {
      return createMockResponse({
        success: true,
        transactionId,
        status: 'completed',
        amount: paymentData.amount || 2970,
        paymentMethod: paymentData.paymentMethod || 'credit',
        timestamp: new Date(),
        message: '決済が完了しました'
      });
    } else if (scenario > 0.4) {
      throw {
        message: 'カードが拒否されました',
        status: 400,
        code: 'USER_CARD_DECLINED',
        type: 'user',
        details: { reason: 'card_declined' }
      };
    } else if (scenario > 0.2) {
      throw {
        message: '残高不足です',
        status: 400,
        code: 'CARD_INSUFFICIENT_FUNDS',
        type: 'card_issuer',
        details: { reason: 'insufficient_funds' }
      };
    } else {
      throw {
        message: 'システムがタイムアウトしました',
        status: 500,
        code: 'SYSTEM_TIMEOUT',
        type: 'system',
        details: { reason: 'timeout' }
      };
    }
  }

  async getPaymentStatus(transactionId: string): Promise<any> {
    await delay(200 + Math.random() * 300);
    
    const isProcessing = Math.random() > 0.8; // 20% still processing
    
    if (isProcessing) {
      return createMockResponse({
        transactionId,
        status: 'processing',
        message: '決済処理中です'
      });
    }
    
    return createMockResponse({
      transactionId,
      status: 'completed',
      amount: 2970,
      paymentMethod: 'credit',
      timestamp: new Date(),
      message: '決済が完了しました'
    });
  }

  async retryPayment(_transactionId: string, retryData: any): Promise<any> {
    await delay(600 + Math.random() * 800);
    
    const success = Math.random() > 0.2; // 80% success rate
    const newTransactionId = `TXN_${Date.now()}`;
    
    if (success) {
      return createMockResponse({
        success: true,
        transactionId: newTransactionId,
        status: 'completed',
        amount: retryData.amount || 2970,
        paymentMethod: retryData.paymentMethod || 'credit',
        timestamp: new Date(),
        message: '決済が完了しました'
      });
    } else {
      throw {
        message: 'カード情報に誤りがあります',
        status: 400,
        code: 'USER_VALIDATION_ERROR',
        type: 'user',
        details: { reason: 'invalid_card_info' }
      };
    }
  }
}

export const mockApiClient = new MockApiClient();

export const mockContractApi = {
  getContracts: () => mockApiClient.get('/api/contracts'),
  getContract: (id: string) => mockApiClient.get(`/api/contracts/${id}`),
  createContract: (data: any) => mockApiClient.post('/api/contracts', data),
  updateContract: (id: string, data: any) => mockApiClient.put(`/api/contracts/${id}`, data),
  deleteContract: (id: string) => mockApiClient.delete(`/api/contracts/${id}`),
  getContractDetails: (id: string) => mockApiClient.get(`/api/contracts/${id}/details`),
  getContractHistory: (id: string) => mockApiClient.get(`/api/contracts/${id}/history`),
  getCurrentOptions: (id: string) => mockApiClient.get(`/api/contracts/${id}/options`),
  changePlan: (id: string, data: any) => mockApiClient.post(`/api/contracts/${id}/plan-change`, data),
  simulatePlanChange: (id: string, data: any) => mockApiClient.post(`/api/contracts/${id}/plan-change/simulate`, data),
  getAvailablePlans: (id: string) => mockApiClient.get(`/api/contracts/${id}/available-plans`),
  addOption: (id: string, data: any) => mockApiClient.post(`/api/contracts/${id}/options`, data),
  removeOption: (id: string, optionId: string) => mockApiClient.delete(`/api/contracts/${id}/options/${optionId}`),
  suspendOption: (id: string, optionId: string) => mockApiClient.put(`/api/contracts/${id}/options/${optionId}/suspend`),
  getAvailableOptions: (id: string) => mockApiClient.get(`/api/contracts/${id}/available-options`),
  generateContractDocument: async (contractId: string): Promise<ApiResponse<Blob>> => {
    await delay(1000 + Math.random() * 1500);
    
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(ahamo契約書 - 契約ID: ${contractId}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF`;

    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    return createMockResponse(blob);
  }
};

export const mockPlanApi = {
  getPlans: () => mockApiClient.get('/api/v1/plans'),
  getPlan: (id: string) => mockApiClient.get(`/api/v1/plans/${id}`),
};

export const mockDeviceApi = {
  getDevices: () => mockApiClient.get('/api/devices'),
  getDevice: (id: string) => mockApiClient.get(`/api/devices/${id}`),
  getInventory: (id: string) => mockApiClient.get(`/api/devices/${id}/inventory`),
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
                  colors: ['ブラック', 'ホワイト'],
                  storageOptions: ['128GB', '256GB'],
                  inStock: values[6] === '有り',
                  imageUrl: '',
                  specifications: JSON.stringify({
                    'ディスプレイ': '6.1インチ',
                    'チップ': 'A15 Bionic',
                    'カメラ': '12MP',
                    'バッテリー': '3095mAh'
                  }),
                  galleryImages: [
                    'https://via.placeholder.com/400x600/000000/FFFFFF?text=Front',
                    'https://via.placeholder.com/400x600/333333/FFFFFF?text=Back',
                    'https://via.placeholder.com/400x600/666666/FFFFFF?text=Side'
                  ],
                  releaseDate: new Date().toISOString(),
                  popularity: Math.floor(Math.random() * 100),
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
  
  contractApi: {
    getContractDetails: (id: string) => Promise.resolve({
      data: {
        id: id,
        planId: 'ahamo-20gb',
        customerName: 'テストユーザー',
        customerEmail: 'test@example.com',
        customerPhone: '090-1234-5678',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        customerInfo: {
          name: 'テストユーザー',
          email: 'test@example.com',
          phoneNumber: '090-1234-5678',
          address: '東京都渋谷区'
        },
        plan: {
          id: 'ahamo-20gb',
          name: 'ahamo 20GB',
          description: '月20GBの高速データ通信',
          monthlyFee: 2970,
          dataCapacity: '20GB',
          voiceCalls: '5分以内無料',
          sms: 'SMS無料',
          features: ['5G対応', '海外ローミング'],
          isActive: true,
          isPopular: true
        },
        optionDetails: [
          {
            id: 'data-plus-80gb',
            name: 'データプラス 80GB',
            description: '月80GB追加',
            monthlyFee: 1980,
            oneTimeFee: 0,
            category: 'service',
            isActive: true
          }
        ],
        totalMonthlyFee: 4950,
        contractPeriod: {
          startDate: '2024-01-01',
          endDate: '2026-01-01'
        }
      }
    }),
    
    getContractHistory: (_id: string) => Promise.resolve({
      data: [
        {
          id: 1,
          changeType: 'PLAN_CHANGE',
          oldValue: 'ahamo-basic',
          newValue: 'ahamo-20gb',
          reason: 'データ容量増加のため',
          effectiveDate: '2024-02-01T00:00:00Z',
          createdAt: '2024-01-15T10:30:00Z',
          createdBy: 'user'
        }
      ]
    }),
    
    getCurrentOptions: (_id: string) => Promise.resolve({
      data: [
        {
          id: 'data-plus-80gb',
          name: 'データプラス 80GB',
          description: '月80GB追加',
          monthlyFee: 1980,
          oneTimeFee: 0,
          category: 'service',
          isActive: true
        }
      ]
    }),
    
    changePlan: (_id: string, _data: any) => Promise.resolve({
      data: { success: true, message: 'プラン変更が完了しました' }
    }),
    
    simulatePlanChange: (_id: string, _data: any) => Promise.resolve({
      data: {
        baseFee: 2970,
        optionsFee: 1980,
        discounts: 0,
        taxExcluded: 4950,
        tax: 495,
        taxIncluded: 5445
      }
    }),
    
    getAvailablePlans: (_id: string) => Promise.resolve({
      data: [
        {
          id: 'ahamo-basic',
          name: 'ahamo ベーシック',
          description: '月20GBの基本プラン',
          monthlyFee: 2970,
          dataCapacity: '20GB',
          voiceCalls: '5分以内無料',
          sms: 'SMS無料',
          features: ['5G対応'],
          isActive: true,
          isPopular: false
        },
        {
          id: 'ahamo-large',
          name: 'ahamo ラージ',
          description: '月100GBの大容量プラン',
          monthlyFee: 4950,
          dataCapacity: '100GB',
          voiceCalls: '5分以内無料',
          sms: 'SMS無料',
          features: ['5G対応', '海外ローミング'],
          isActive: true,
          isPopular: true
        }
      ]
    }),
    
    addOption: (_id: string, _data: any) => Promise.resolve({
      data: { success: true, message: 'オプションが追加されました' }
    }),
    
    removeOption: (_id: string, _optionId: string) => Promise.resolve({
      data: { success: true, message: 'オプションが削除されました' }
    }),
    
    suspendOption: (_id: string, _optionId: string) => Promise.resolve({
      data: { success: true, message: 'オプションが一時停止されました' }
    }),
    
    getAvailableOptions: (_id: string) => Promise.resolve({
      data: [
        {
          id: 'data-plus-80gb',
          name: 'データプラス 80GB',
          description: '月80GB追加',
          monthlyFee: 1980,
          oneTimeFee: 0,
          category: 'service',
          isActive: true
        },
        {
          id: 'voice-unlimited',
          name: '通話し放題',
          description: '国内通話無制限',
          monthlyFee: 1100,
          oneTimeFee: 0,
          category: 'service',
          isActive: true
        }
      ]
    })
  }
};

const mockOptions = [
  {
    id: 'option_insurance_001',
    name: 'ケータイ補償サービス',
    category: 'insurance',
    description: '故障・水濡れ・盗難・紛失などのトラブル時にサポート',
    monthlyFee: 825,
    oneTimeFee: 0,
    isActive: true,
    requiredOptions: [],
    excludedOptions: ['option_insurance_002']
  },
  {
    id: 'option_insurance_002',
    name: 'AppleCare+ for iPhone',
    category: 'insurance',
    description: 'Apple公式の保証サービス',
    monthlyFee: 1180,
    oneTimeFee: 0,
    isActive: true,
    requiredOptions: [],
    excludedOptions: ['option_insurance_001']
  },
  {
    id: 'option_accessory_001',
    name: 'ワイヤレス充電器',
    category: 'accessory',
    description: 'Qi対応ワイヤレス充電器',
    monthlyFee: 0,
    oneTimeFee: 3300,
    isActive: true,
    requiredOptions: [],
    excludedOptions: []
  },
  {
    id: 'option_service_001',
    name: '国際ローミング',
    category: 'service',
    description: '海外でもデータ通信・通話が可能',
    monthlyFee: 980,
    oneTimeFee: 0,
    isActive: true,
    requiredOptions: [],
    excludedOptions: []
  }
];

export const mockFeeApi = {
  calculateFee: async (data: any): Promise<ApiResponse<any>> => {
    await delay(300 + Math.random() * 500);
    
    const plans = getStoredDataTyped(STORAGE_KEYS.PLANS, mockPlans);
    const plan = plans.find(p => p.id === data.planId);
    if (!plan) {
      throw createMockError('プランが見つかりません', 404);
    }

    const baseFee = plan.monthlyFee;
    const callFee = data.callMinutes * 22;
    const dataFee = Math.max(0, (data.dataUsage - 20) * 550);
    const smsFee = data.smsCount * 3.3;
    
    let optionFees: any[] = [];
    if (data.selectedOptionIds && data.selectedOptionIds.length > 0) {
      optionFees = data.selectedOptionIds.map((optionId: string) => {
        const option = mockOptions.find(o => o.id === optionId);
        return option ? {
          id: option.id,
          name: option.name,
          fee: option.monthlyFee
        } : null;
      }).filter(Boolean);
    }
    
    const totalOptionFees = optionFees.reduce((sum, option) => sum + option.fee, 0);
    const totalFee = baseFee + callFee + dataFee + smsFee + totalOptionFees;
    const taxIncluded = Math.round(totalFee * 1.1);

    const result = {
      totalFee,
      breakdown: {
        baseFee,
        callFee: callFee + smsFee,
        dataFee,
        optionFees,
        discounts: []
      },
      taxIncluded
    };

    return createMockResponse(result);
  },

  calculateTotal: async (data: any): Promise<ApiResponse<any>> => {
    return mockFeeApi.calculateFee(data);
  },

  compareFeePlans: async (usage: any, planIds: string[]): Promise<ApiResponse<{ results: any[] }>> => {
    await delay(400 + Math.random() * 600);
    
    const plans = getStoredDataTyped(STORAGE_KEYS.PLANS, mockPlans);
    const results = planIds.map(planId => {
      const plan = plans.find(p => p.id === planId);
      if (!plan) return null;

      const baseFee = plan.monthlyFee;
      const callFee = usage.callMinutes * 22;
      const dataFee = Math.max(0, (usage.dataUsage - 20) * 550);
      const smsFee = usage.smsCount * 3.3;
      
      const totalFee = baseFee + callFee + dataFee + smsFee;
      const taxIncluded = Math.round(totalFee * 1.1);

      return {
        totalFee,
        breakdown: {
          baseFee,
          callFee: callFee + smsFee,
          dataFee,
          optionFees: [],
          discounts: []
        },
        taxIncluded
      };
    }).filter(Boolean);

    return createMockResponse({ results });
  }
};

export const mockOptionApi = {
  getOptions: async (category?: string): Promise<ApiResponse<any>> => {
    await delay(200 + Math.random() * 300);
    
    let filteredOptions = mockOptions;
    if (category) {
      filteredOptions = mockOptions.filter(option => option.category === category);
    }
    
    return createMockResponse({
      options: filteredOptions,
      total: filteredOptions.length
    });
  }
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
