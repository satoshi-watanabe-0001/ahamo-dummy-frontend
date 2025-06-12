const STORAGE_KEY = 'ahamo_personal_info';
const TTL_HOURS = 24;

interface StoredData {
  data: any;
  timestamp: number;
  ttl: number;
}

export const secureStorage = {
  store: (data: any): void => {
    const storedData: StoredData = {
      data,
      timestamp: Date.now(),
      ttl: TTL_HOURS * 60 * 60 * 1000
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));
  },

  retrieve: (): any | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const storedData: StoredData = JSON.parse(stored);

      if (Date.now() - storedData.timestamp > storedData.ttl) {
        secureStorage.clear();
        return null;
      }

      return storedData.data;
    } catch (error) {
      console.warn('Failed to retrieve stored data:', error);
      return null;
    }
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
