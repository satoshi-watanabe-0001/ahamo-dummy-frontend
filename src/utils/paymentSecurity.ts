export const paymentSecurity = {
  validateCardNumber: (cardNumber: string): boolean => {
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    return /^[0-9]{13,19}$/.test(cleanNumber) && luhnCheck(cleanNumber);
  },

  validateExpiryDate: (month: string, year: string): boolean => {
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    
    const fullYear = expYear < 100 ? expYear + 2000 : expYear;
    const currentDate = new Date();
    const expiryDate = new Date(fullYear, expMonth - 1);
    
    return expiryDate >= currentDate;
  },

  validateCVV: (cvv: string, cardNumber: string): boolean => {
    const cleanCardNumber = cardNumber.replace(/\s+/g, '');
    const isAmex = cleanCardNumber.startsWith('34') || cleanCardNumber.startsWith('37');
    
    if (isAmex) {
      return /^[0-9]{4}$/.test(cvv);
    } else {
      return /^[0-9]{3}$/.test(cvv);
    }
  },

  maskCardNumber: (cardNumber: string): string => {
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    if (cleanNumber.length < 4) return '****';
    return '**** **** **** ' + cleanNumber.slice(-4);
  },

  detectCardType: (cardNumber: string): string => {
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cleanNumber)) return 'visa';
    if (/^5[1-5][0-9]{14}$/.test(cleanNumber)) return 'mastercard';
    if (/^35(2[89]|[3-8][0-9])[0-9]{12}$/.test(cleanNumber)) return 'jcb';
    if (/^3[47][0-9]{13}$/.test(cleanNumber)) return 'amex';
    
    return 'unknown';
  }
};

function luhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let alternate = false;
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));
    
    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit = (digit % 10) + 1;
      }
    }
    
    sum += digit;
    alternate = !alternate;
  }
  
  return (sum % 10) === 0;
}
