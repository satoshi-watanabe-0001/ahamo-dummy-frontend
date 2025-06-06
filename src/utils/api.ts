const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
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
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
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
        } as ApiError;
      }

      return {
        data,
        status: response.status,
        message: data.message,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0,
          details: error,
        } as ApiError;
      }
      throw error;
    }
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

export const apiClient = new ApiClient();

export const contractApi = {
  getContracts: () => apiClient.get('/api/contracts'),
  getContract: (id: string) => apiClient.get(`/api/contracts/${id}`),
  createContract: (data: any) => apiClient.post('/api/contracts', data),
  updateContract: (id: string, data: any) => apiClient.put(`/api/contracts/${id}`, data),
  deleteContract: (id: string) => apiClient.delete(`/api/contracts/${id}`),
};

export const planApi = {
  getPlans: () => apiClient.get('/api/plans'),
  getPlan: (id: string) => apiClient.get(`/api/plans/${id}`),
};

export const deviceApi = {
  getDevices: () => apiClient.get('/api/devices'),
  getDevice: (id: string) => apiClient.get(`/api/devices/${id}`),
};

export const adminDeviceApi = {
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
