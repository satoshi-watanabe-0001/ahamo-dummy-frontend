import { ConvenienceStore, DeliveryTimeSlot, ShippingOption } from '../types';

const API_BASE_URL = '/api/v1/shipping';

export const shippingApi = {
  searchConvenienceStores: async (params: {
    prefecture?: string;
    city?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
  }): Promise<ConvenienceStore[]> => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/convenience-stores/search?${searchParams}`);
    if (!response.ok) {
      throw new Error('コンビニ店舗の検索に失敗しました');
    }
    return response.json();
  },

  getConvenienceStoreByCode: async (storeCode: string): Promise<ConvenienceStore> => {
    const response = await fetch(`${API_BASE_URL}/convenience-stores/${storeCode}`);
    if (!response.ok) {
      throw new Error('コンビニ店舗の取得に失敗しました');
    }
    return response.json();
  },

  getAllConvenienceStores: async (): Promise<ConvenienceStore[]> => {
    const response = await fetch(`${API_BASE_URL}/convenience-stores`);
    if (!response.ok) {
      throw new Error('コンビニ店舗一覧の取得に失敗しました');
    }
    return response.json();
  },

  getDeliveryTimeSlots: async (): Promise<DeliveryTimeSlot[]> => {
    const response = await fetch(`${API_BASE_URL}/delivery-time-slots`);
    if (!response.ok) {
      throw new Error('配送時間帯の取得に失敗しました');
    }
    return response.json();
  },

  getDeliveryTimeSlotsByType: async (slotType: string): Promise<DeliveryTimeSlot[]> => {
    const response = await fetch(`${API_BASE_URL}/delivery-time-slots/by-type/${slotType}`);
    if (!response.ok) {
      throw new Error('配送時間帯の取得に失敗しました');
    }
    return response.json();
  },

  getShippingOptions: async (): Promise<ShippingOption[]> => {
    const response = await fetch(`${API_BASE_URL}/options`);
    if (!response.ok) {
      throw new Error('配送オプションの取得に失敗しました');
    }
    return response.json();
  },

  getShippingOptionByCode: async (optionCode: string): Promise<ShippingOption> => {
    const response = await fetch(`${API_BASE_URL}/options/${optionCode}`);
    if (!response.ok) {
      throw new Error('配送オプションの取得に失敗しました');
    }
    return response.json();
  }
};
