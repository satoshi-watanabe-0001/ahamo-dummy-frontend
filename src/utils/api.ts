const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '';
const USE_MOCK_API = (import.meta as any).env?.VITE_USE_MOCK_API !== 'false';

console.log('API Configuration Debug:', {
  VITE_API_URL: (import.meta as any).env?.VITE_API_URL,
  VITE_USE_MOCK_API: (import.meta as any).env?.VITE_USE_MOCK_API,
  API_BASE_URL,
  USE_MOCK_API,
  NODE_ENV: (import.meta as any).env?.NODE_ENV,
  MODE: (import.meta as any).env?.MODE
});

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export enum ErrorSeverity {
  CRITICAL = 'CRITICAL',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
  severity?: ErrorSeverity;
  resolution?: string;
}

class ApiClient {
  private baseURL: string;
  private authHeader?: string;
  private getAuthToken?: () => string | null;

  constructor(baseURL: string = API_BASE_URL, getAuthToken?: () => string | null) {
    if (baseURL.includes('@')) {
      const url = new URL(baseURL);
      if (url.username && url.password) {
        const credentials = btoa(`${url.username}:${url.password}`);
        this.authHeader = `Basic ${credentials}`;
        this.baseURL = `${url.protocol}//${url.host}${url.pathname}`;
      } else {
        this.baseURL = baseURL;
      }
    } else {
      this.baseURL = baseURL;
    }
    this.getAuthToken = getAuthToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const maxRetries = 3;
    let retries = 0;
    
    while (true) {
      try {
        const url = this.baseURL ? `${this.baseURL}${endpoint}` : endpoint;
        
        const authToken = this.getAuthToken?.();
        
        const defaultHeaders = {
          'Content-Type': 'application/json',
          ...(this.authHeader && { 'Authorization': this.authHeader }),
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
          ...options.headers,
        };

        const response = await fetch(url, {
          ...options,
          headers: defaultHeaders,
        });

        const data = await response.json();

        if (!response.ok) {
          throw {
            message: data.message || 'API request failed',
            status: response.status,
            details: data,
            severity: data.severity,
            resolution: data.resolution,
          } as ApiError;
        }

        return {
          data,
          status: response.status,
          message: data.message,
        };
      } catch (error) {
        const apiError = error as ApiError;
        const shouldRetry = this.isRetryableError(apiError) && retries < maxRetries;
        
        if (!shouldRetry) {
          if (error instanceof Error) {
            throw {
              message: error.message,
              status: 0,
              details: error,
              severity: ErrorSeverity.CRITICAL,
              resolution: 'ネットワーク接続を確認してください'
            } as ApiError;
          }
          throw error;
        }
        
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        retries++;
      }
    }
  }

  private isRetryableError(error: ApiError): boolean {
    if (!error) return false;
    
    if (error instanceof TypeError && error.message.includes('Network')) return true;
    
    if (error.status && error.status >= 500 && error.status < 600) return true;
    
    return false;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

import { 
  mockApiClient, 
  mockContractApi, 

  mockPlanApi, 
  mockDeviceApi, 
  mockAdminDeviceApi,
  mockFeeApi,
  mockOptionApi,
  initializeMockData 
} from './mockApi';

if (USE_MOCK_API) {
  initializeMockData();
}

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const apiClient = USE_MOCK_API ? mockApiClient : new ApiClient(API_BASE_URL, getAuthToken);

export const contractApi = USE_MOCK_API ? mockContractApi : {
  getContracts: () => apiClient.get('/api/v1/contracts'),
  getContract: (id: string) => apiClient.get(`/api/v1/contracts/${id}`),
  createContract: (data: any) => apiClient.post('/api/v1/contracts', data),
  updateContract: (id: string, data: any) => apiClient.put(`/api/v1/contracts/${id}`, data),
  deleteContract: (id: string) => apiClient.delete(`/api/v1/contracts/${id}`),
  confirmContract: (id: string, data: any) => apiClient.post(`/api/v1/contracts/${id}/confirm`, data),
  generateContractDocument: (id: string) => apiClient.get(`/api/v1/contracts/${id}/document`),
  getContractDetails: (id: string) => apiClient.get(`/api/v1/contracts/${id}/details`),
  getContractHistory: (id: string) => apiClient.get(`/api/v1/contracts/${id}/history`),
  getCurrentOptions: (id: string) => apiClient.get(`/api/v1/contracts/${id}/options`),
  changePlan: (id: string, data: any) => apiClient.post(`/api/v1/contracts/${id}/plan-change`, data),
  simulatePlanChange: (id: string, data: any) => apiClient.post(`/api/v1/contracts/${id}/plan-change/simulate`, data),
  getAvailablePlans: (id: string) => apiClient.get(`/api/v1/contracts/${id}/available-plans`),
  addOption: (id: string, data: any) => apiClient.post(`/api/v1/contracts/${id}/options`, data),
  removeOption: (id: string, optionId: string) => apiClient.delete(`/api/v1/contracts/${id}/options/${optionId}`),
  suspendOption: (id: string, optionId: string) => apiClient.put(`/api/v1/contracts/${id}/options/${optionId}/suspend`),
  getAvailableOptions: (id: string) => apiClient.get(`/api/v1/contracts/${id}/available-options`)
};

export const planApi = USE_MOCK_API ? mockPlanApi : {
  getPlans: () => apiClient.get('/api/v1/plans'),
  getPlan: (id: string) => apiClient.get(`/api/v1/plans/${id}`),
};

export const feeApi = USE_MOCK_API ? mockFeeApi : {
  calculateFee: (data: any) => 
    apiClient.post('/api/v1/fee/calculate-fee', data),
  calculateTotal: (data: any) => 
    apiClient.post('/api/v1/fee/calculate-total', data),
  compareFeePlans: (usage: any, planIds: string[]) => 
    apiClient.post('/api/v1/fee/compare-fee-plans', { usage, planIds }),
};

export const deviceApi = USE_MOCK_API ? mockDeviceApi : {
  getDevices: () => apiClient.get('/api/v1/devices'),
  getDevice: (id: string) => apiClient.get(`/api/v1/devices/${id}`),
  getInventory: (id: string) => apiClient.get(`/api/v1/devices/${id}/inventory`),
};

export const adminDeviceApi = USE_MOCK_API ? mockAdminDeviceApi : {
  getAllDevices: () => apiClient.get('/api/v1/admin/devices'),
  createDevice: (data: any) => apiClient.post('/api/v1/admin/devices', data),
  updateDevice: (id: string, data: any) => apiClient.put(`/api/v1/admin/devices/${id}`, data),
  deleteDevice: (id: string) => apiClient.delete(`/api/v1/admin/devices/${id}`),
  importDevices: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE_URL}/api/v1/admin/devices/import`, {
      method: 'POST',
      body: formData,
    });
  },
  exportDevices: () => apiClient.get('/api/v1/admin/devices/export'),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE_URL}/api/v1/admin/devices/upload-image`, {
      method: 'POST',
      body: formData,
    });
  },
};

export const optionApi = USE_MOCK_API ? mockOptionApi : {
  getOptions: (category?: string) => 
    apiClient.get(`/api/v1/options${category ? `?category=${category}` : ''}`),
};

export const authApi = USE_MOCK_API ? {
  login: async (data: { email: string; password: string }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = JSON.parse(localStorage.getItem('ahamo_mock_users') || '[]');
    const user = users.find((u: any) => u.email === data.email && u.password === data.password);
    if (!user) {
      throw { message: 'メールアドレスまたはパスワードが正しくありません', status: 401 };
    }
    const accessToken = `mock_token_${Date.now()}`;
    const refreshToken = `mock_refresh_${Date.now()}`;
    return { data: { accessToken, refreshToken, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } } };
  },
  register: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = JSON.parse(localStorage.getItem('ahamo_mock_users') || '[]');
    if (users.find((u: any) => u.email === data.email)) {
      throw { message: 'このメールアドレスは既に登録されています', status: 409 };
    }
    const newUser = { ...data, id: `user_${Date.now()}` };
    users.push(newUser);
    localStorage.setItem('ahamo_mock_users', JSON.stringify(users));
    return { data: { message: 'アカウントが作成されました' } };
  },
  refresh: async (refreshToken: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Mock refresh token:', refreshToken);
    const accessToken = `mock_token_${Date.now()}`;
    const newRefreshToken = `mock_refresh_${Date.now()}`;
    return { data: { accessToken, refreshToken: newRefreshToken } };
  },
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { data: { message: 'ログアウトしました' } };
  },
  verify: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log('Mock verify data:', data);
    return { data: { message: '認証が完了しました' } };
  },
  loginWithContract: async (data: { contractNumber: string; password: string }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Mock contract login:', data);
    const accessToken = `mock_contract_token_${Date.now()}`;
    const refreshToken = `mock_contract_refresh_${Date.now()}`;
    return { data: { accessToken, refreshToken, user: { id: 'contract_user', email: 'contract@example.com' } } };
  }
} : {
  login: (data: { email: string; password: string }) => apiClient.post('/api/v1/auth/login', data),
  register: (data: any) => apiClient.post('/api/v1/auth/register', data),
  refresh: (refreshToken: string) => apiClient.post('/api/v1/auth/refresh', { refreshToken }),
  logout: () => apiClient.post('/api/v1/auth/logout'),
  verify: (data: { type: string; email?: string; phone?: string; code: string }) => 
    apiClient.post('/api/v1/auth/verify', data),
  loginWithContract: (data: { contractNumber: string; password: string }) => 
    apiClient.post('/api/v1/auth/login/contract', data)
};

export const paymentApi = {
  getPaymentMethods: () => apiClient.get('/api/v1/payments/methods'),
  processPayment: (data: any) => apiClient.post('/api/v1/payments/process', data),
  tokenizeCard: (data: any) => apiClient.post('/api/v1/payments/tokenize', data),
  validateToken: (token: string) => apiClient.post('/api/v1/payments/validate-token', { token }),
  searchBanks: (query: string) => apiClient.get(`/api/v1/payments/banks/search?q=${encodeURIComponent(query)}`),
  searchBranches: (bankCode: string, query: string) => 
    apiClient.get(`/api/v1/payments/banks/${bankCode}/branches/search?q=${encodeURIComponent(query)}`),
  validateBankAccount: (data: any) => apiClient.post('/api/v1/payments/validate-bank-account', data),
  getPaymentStatus: (paymentId: string) => apiClient.get(`/api/v1/payments/${paymentId}/status`),
  getPaymentHistory: (contractId: string) => apiClient.get(`/api/v1/payments/history/${contractId}`),
  checkMethodAvailability: (methodId: string) => apiClient.get(`/api/v1/payments/methods/${methodId}/availability`),
  retryPayment: (transactionId: string, data: any) => apiClient.post(`/api/v1/payments/${transactionId}/retry`, data)
};

export const pollPaymentStatus = async (transactionId: string, maxAttempts: number = 30): Promise<any> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await paymentApi.getPaymentStatus(transactionId);
      const paymentData = response.data as any;
      
      if (paymentData.status === 'completed' || paymentData.status === 'failed') {
        return paymentData;
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Payment status polling error:', error);
      if (attempt === maxAttempts - 1) {
        throw error;
      }
    }
  }
  
  throw new Error('Payment status polling timeout');
};

export const classifyPaymentError = (error: any): ApiError => {
  const errorMessage = error.message || error.error_message || '決済処理中にエラーが発生しました';
  const errorStatus = error.status || 400;
  
  let severity = ErrorSeverity.CRITICAL;
  let resolution = 'データを確認して再試行してください';
  
  if (error.message?.includes('カード') || error.code?.startsWith('CARD_')) {
    resolution = 'カード情報を確認するか、別のお支払い方法をお試しください';
  } else if (error.message?.includes('システム') || error.code?.startsWith('SYSTEM_')) {
    resolution = 'しばらく時間をおいてから再度お試しください';
    severity = ErrorSeverity.CRITICAL;
  } else if (error.message?.includes('入力') || error.code?.startsWith('USER_')) {
    resolution = '入力内容を確認して再度お試しください';
    severity = ErrorSeverity.WARNING;
  }
  
  return {
    message: errorMessage,
    status: errorStatus,
    details: error.details,
    severity,
    resolution
  };
};

export default apiClient;
