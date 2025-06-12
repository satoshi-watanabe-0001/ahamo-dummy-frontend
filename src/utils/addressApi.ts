import { apiClient } from './api';

export interface AddressInfo {
  prefecture: string;
  city: string;
  addressLine1: string;
}

const addressCache = new Map<string, AddressInfo>();

export const addressApi = {
  lookupByPostalCode: async (postalCode: string): Promise<AddressInfo | null> => {
    if (addressCache.has(postalCode)) {
      return addressCache.get(postalCode)!;
    }

    try {
      const response = await Promise.race([
        apiClient.get<AddressInfo>(`/api/address/lookup?postal_code=${postalCode}`),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        )
      ]);
      
      const addressInfo = response.data;
      addressCache.set(postalCode, addressInfo);
      return addressInfo;
    } catch (error) {
      console.warn('Address lookup failed:', error);
      return null;
    }
  }
};
