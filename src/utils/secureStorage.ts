import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'ahamo_personal_info';
const TTL_HOURS = 24;
const ENCRYPTION_KEY = 'ahamo_contract_form_key_2024';

interface StoredData {
  data: string;
  timestamp: number;
  ttl: number;
  checksum: string;
}

interface SecureStorageOptions {
  key?: string;
  ttlHours?: number;
}

const generateChecksum = (data: string): string => {
  return CryptoJS.SHA256(data).toString();
};

const encryptData = (data: any, key: string): string => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, key).toString();
};

const decryptData = (encryptedData: string, key: string): any => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedString);
};

export const secureStorage = {
  store: (data: any, options: SecureStorageOptions = {}): void => {
    try {
      const key = options.key || ENCRYPTION_KEY;
      const ttl = (options.ttlHours || TTL_HOURS) * 60 * 60 * 1000;
      
      const encryptedData = encryptData(data, key);
      const checksum = generateChecksum(encryptedData);
      
      const storedData: StoredData = {
        data: encryptedData,
        timestamp: Date.now(),
        ttl,
        checksum
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));
    } catch (error) {
      console.error('Failed to store encrypted data:', error);
    }
  },

  retrieve: (options: SecureStorageOptions = {}): any | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const storedData: StoredData = JSON.parse(stored);

      if (Date.now() - storedData.timestamp > storedData.ttl) {
        secureStorage.clear();
        return null;
      }

      const currentChecksum = generateChecksum(storedData.data);
      if (currentChecksum !== storedData.checksum) {
        console.warn('Data integrity check failed');
        secureStorage.clear();
        return null;
      }

      const key = options.key || ENCRYPTION_KEY;
      return decryptData(storedData.data, key);
    } catch (error) {
      console.warn('Failed to retrieve stored data:', error);
      secureStorage.clear();
      return null;
    }
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  hasStoredData: (): boolean => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    
    try {
      const storedData: StoredData = JSON.parse(stored);
      return Date.now() - storedData.timestamp <= storedData.ttl;
    } catch {
      return false;
    }
  },

  getExpirationTime: (): Date | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    try {
      const storedData: StoredData = JSON.parse(stored);
      return new Date(storedData.timestamp + storedData.ttl);
    } catch {
      return null;
    }
  },

  getRemainingTime: (): number => {
    const expirationTime = secureStorage.getExpirationTime();
    if (!expirationTime) return 0;
    
    const remaining = expirationTime.getTime() - Date.now();
    return Math.max(0, remaining);
  }
};
