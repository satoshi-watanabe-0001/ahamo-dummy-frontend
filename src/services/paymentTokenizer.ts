import { encryptionUtils } from '../utils/encryptionUtils';
import { apiClient } from '../utils/api';
import type { BankInfo, BranchInfo, PaymentValidationResult } from '../types/payment';

export interface CardDetails {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolderName: string;
}

export interface TokenizationResult {
  success: boolean;
  token?: string;
  maskedCardNumber?: string;
  cardType?: string;
  errorMessage?: string;
}

export type { BankInfo, BranchInfo } from '../types/payment';

export const paymentTokenizer = {
  async tokenizeCard(cardDetails: CardDetails): Promise<TokenizationResult> {
    try {
      const encryptedData = encryptionUtils.encrypt(cardDetails);
      
      const response = await apiClient.post<TokenizationResult>('/api/v1/payments/tokenize', {
        encryptedCardData: encryptedData
      });
      
      return response.data;
    } catch (error) {
      return {
        success: false,
        errorMessage: 'カードのトークン化に失敗しました'
      };
    }
  },

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await apiClient.post<{valid: boolean}>('/api/v1/payments/validate-token', { token });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },

  async searchBanks(query: string): Promise<BankInfo[]> {
    try {
      const response = await apiClient.get<BankInfo[]>(`/api/v1/payments/banks/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async searchBranches(bankCode: string, query: string): Promise<BranchInfo[]> {
    try {
      const response = await apiClient.get<BranchInfo[]>(`/api/v1/payments/banks/${bankCode}/branches/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async validateBankAccount(bankCode: string, branchCode: string, accountNumber: string, accountName: string): Promise<PaymentValidationResult> {
    try {
      const response = await apiClient.post<PaymentValidationResult>('/api/v1/payments/validate-bank-account', {
        bankCode,
        branchCode,
        accountNumber,
        accountName
      });
      return response.data;
    } catch (error) {
      return {
        valid: false,
        message: '銀行口座の検証に失敗しました',
        errors: []
      };
    }
  }
};
