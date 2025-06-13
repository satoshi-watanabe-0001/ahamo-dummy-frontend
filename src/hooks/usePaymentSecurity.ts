import { useState, useCallback } from 'react';
import { paymentSecurity } from '../utils/paymentSecurity';

export const usePaymentSecurity = () => {
  const [securityErrors, setSecurityErrors] = useState<Record<string, string>>({});

  const validateCardData = useCallback((cardData: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardHolderName: string;
  }) => {
    const errors: Record<string, string> = {};

    if (!paymentSecurity.validateCardNumber(cardData.cardNumber)) {
      errors.cardNumber = 'カード番号が無効です';
    }

    if (!paymentSecurity.validateExpiryDate(cardData.expiryMonth, cardData.expiryYear)) {
      errors.expiry = '有効期限が無効です';
    }

    if (!paymentSecurity.validateCVV(cardData.cvv, cardData.cardNumber)) {
      errors.cvv = 'セキュリティコードが無効です';
    }

    if (!cardData.cardHolderName.trim()) {
      errors.cardHolderName = 'カード名義人名が必要です';
    }

    setSecurityErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  const clearSecurityErrors = useCallback(() => {
    setSecurityErrors({});
  }, []);

  return {
    securityErrors,
    validateCardData,
    clearSecurityErrors,
    paymentSecurity
  };
};
