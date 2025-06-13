import { paymentSecurity } from '../utils/paymentSecurity';

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaymentValidationService {
  validateCardNumber: (cardNumber: string) => ValidationError | null;
  validateExpiryDate: (month: string, year: string) => ValidationError | null;
  validateCVV: (cvv: string, cardNumber: string) => ValidationError | null;
  validateCardHolderName: (name: string) => ValidationError | null;
  validateBankCode: (code: string) => ValidationError | null;
  validateAccountNumber: (number: string) => ValidationError | null;
}

export const paymentValidationService: PaymentValidationService = {
  validateCardNumber: (cardNumber: string) => {
    if (!cardNumber.trim()) {
      return { field: 'cardNumber', message: 'カード番号を入力してください' };
    }
    
    if (!paymentSecurity.validateCardNumber(cardNumber)) {
      return { field: 'cardNumber', message: 'カード番号が無効です' };
    }
    
    return null;
  },

  validateExpiryDate: (month: string, year: string) => {
    if (!month || !year) {
      return { field: 'expiry', message: '有効期限を選択してください' };
    }
    
    if (!paymentSecurity.validateExpiryDate(month, year)) {
      return { field: 'expiry', message: '有効期限が無効です' };
    }
    
    return null;
  },

  validateCVV: (cvv: string, cardNumber: string) => {
    if (!cvv.trim()) {
      return { field: 'cvv', message: 'セキュリティコードを入力してください' };
    }
    
    if (!paymentSecurity.validateCVV(cvv, cardNumber)) {
      return { field: 'cvv', message: 'セキュリティコードが無効です' };
    }
    
    return null;
  },

  validateCardHolderName: (name: string) => {
    if (!name.trim()) {
      return { field: 'cardHolderName', message: 'カード名義人名を入力してください' };
    }
    
    if (name.trim().length < 2) {
      return { field: 'cardHolderName', message: 'カード名義人名が短すぎます' };
    }
    
    return null;
  },

  validateBankCode: (code: string) => {
    if (!code.trim()) {
      return { field: 'bankCode', message: '銀行コードを入力してください' };
    }
    
    if (!/^[0-9]{4}$/.test(code)) {
      return { field: 'bankCode', message: '銀行コードは4桁の数字である必要があります' };
    }
    
    return null;
  },

  validateAccountNumber: (number: string) => {
    if (!number.trim()) {
      return { field: 'accountNumber', message: '口座番号を入力してください' };
    }
    
    if (!/^[0-9]{7,8}$/.test(number)) {
      return { field: 'accountNumber', message: '口座番号は7-8桁の数字である必要があります' };
    }
    
    return null;
  }
};
