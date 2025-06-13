export const PAYMENT_METHODS = [
  { 
    value: 'credit', 
    label: 'クレジットカード', 
    description: 'Visa, Mastercard, JCB, American Express対応',
    icon: '💳'
  },
  { 
    value: 'bank', 
    label: '銀行口座振替', 
    description: '毎月自動引き落とし（手数料無料）',
    icon: '🏦'
  },
  { 
    value: 'convenience', 
    label: 'コンビニ払い', 
    description: '毎月コンビニでお支払い（手数料110円）',
    icon: '🏪'
  }
] as const;

export type PaymentMethodType = typeof PAYMENT_METHODS[number]['value'];
