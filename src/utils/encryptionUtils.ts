import CryptoJS from 'crypto-js';

export interface EncryptionOptions {
  key?: string;
  algorithm?: string;
}

export const DEFAULT_ENCRYPTION_KEY = 'ahamo_contract_form_key_2024';

export const encryptionUtils = {
  encrypt: (data: any, options: EncryptionOptions = {}): string => {
    try {
      const key = options.key || DEFAULT_ENCRYPTION_KEY;
      const jsonString = JSON.stringify(data);
      return CryptoJS.AES.encrypt(jsonString, key).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('データの暗号化に失敗しました');
    }
  },

  decrypt: (encryptedData: string, options: EncryptionOptions = {}): any => {
    try {
      const key = options.key || DEFAULT_ENCRYPTION_KEY;
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) {
        throw new Error('復号化されたデータが空です');
      }
      
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('データの復号化に失敗しました');
    }
  },

  generateChecksum: (data: string): string => {
    return CryptoJS.SHA256(data).toString();
  },

  verifyChecksum: (data: string, expectedChecksum: string): boolean => {
    const actualChecksum = encryptionUtils.generateChecksum(data);
    return actualChecksum === expectedChecksum;
  },

  generateSecureKey: (): string => {
    return CryptoJS.lib.WordArray.random(256/8).toString();
  }
};
