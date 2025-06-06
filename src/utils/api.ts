const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';
const USE_MOCK_API = (import.meta as any).env?.VITE_USE_MOCK_API === 'true';

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

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const maxRetries = 3;
    let retries = 0;
    
    while (true) {
      try {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultHeaders = {
          'Content-Type': 'application/json',
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
  initializeMockData 
} from './mockApi';

if (USE_MOCK_API) {
  initializeMockData();
}

export const apiClient = USE_MOCK_API ? mockApiClient : new ApiClient();

export const contractApi = USE_MOCK_API ? mockContractApi : {
  getContracts: () => apiClient.get('/api/contracts'),
  getContract: (id: string) => apiClient.get(`/api/contracts/${id}`),
  createContract: (data: any) => apiClient.post('/api/contracts', data),
  updateContract: (id: string, data: any) => apiClient.put(`/api/contracts/${id}`, data),
  deleteContract: (id: string) => apiClient.delete(`/api/contracts/${id}`),
};

export const planApi = USE_MOCK_API ? mockPlanApi : {
  getPlans: () => apiClient.get('/api/v1/plans'),
  getPlan: (id: string) => apiClient.get(`/api/v1/plans/${id}`),
};

export const feeApi = {
  calculateFee: (data: any) => 
    apiClient.post('/api/calculate-fee', data),
  compareFeePlans: (usage: any, planIds: string[]) => 
    apiClient.post('/api/compare-fee-plans', { usage, planIds }),
};

export const deviceApi = USE_MOCK_API ? mockDeviceApi : {
  getDevices: () => apiClient.get('/api/devices'),
  getDevice: (id: string) => apiClient.get(`/api/devices/${id}`),
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

export default apiClient;
