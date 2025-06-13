export interface PaymentToken {
  token: string;
  maskedCardNumber: string;
  cardType: string;
  expiresAt: string;
}

export interface BankInfo {
  code: string;
  name: string;
  kana: string;
  isAvailable: boolean;
}

export interface BranchInfo {
  code: string;
  name: string;
  kana: string;
  bankCode: string;
  isAvailable: boolean;
}

export interface PaymentValidationResult {
  valid: boolean;
  message: string;
  errors: string[];
}

export interface CardValidationRules {
  minLength: number;
  maxLength: number;
  luhnCheck: boolean;
  cvvLength: number;
}

export interface PaymentSecurityConfig {
  encryptionEnabled: boolean;
  tokenizationEnabled: boolean;
  pciDssCompliant: boolean;
  maxRetries: number;
}
