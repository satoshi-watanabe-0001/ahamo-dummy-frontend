import React, { useState, useCallback } from 'react';
import { paymentTokenizer } from '../../services/paymentTokenizer';
import type { BankInfo, BranchInfo, PaymentValidationResult } from '../../types/payment';

interface BankAccountFormProps {
  onValidationChange: (validation: PaymentValidationResult | null) => void;
  register: any;
  setValue: any;
  watch: any;
}

export const BankAccountForm = ({ 
  onValidationChange, 
  register, 
  setValue, 
  watch 
}: BankAccountFormProps) => {
  const [bankSuggestions, setBankSuggestions] = useState<BankInfo[]>([]);
  const [branchSuggestions, setBranchSuggestions] = useState<BranchInfo[]>([]);
  const [selectedBank, setSelectedBank] = useState<BankInfo | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchInfo | null>(null);

  const handleBankSearch = useCallback(async (e: any) => {
    const query = e.target.value;
    setValue('bankName', query);
    
    if (query.length >= 2) {
      const banks = await paymentTokenizer.searchBanks(query);
      setBankSuggestions(banks);
    } else {
      setBankSuggestions([]);
    }
    
    setSelectedBank(null);
    setBranchSuggestions([]);
    setSelectedBranch(null);
  }, [setValue]);

  const selectBank = useCallback((bank: BankInfo) => {
    setSelectedBank(bank);
    setValue('bankName', bank.name);
    setValue('bankCode', bank.code);
    setBankSuggestions([]);
    setBranchSuggestions([]);
    setSelectedBranch(null);
  }, [setValue]);

  const handleBranchSearch = useCallback(async (e: any) => {
    const query = e.target.value;
    setValue('bankBranch', query);
    
    if (selectedBank && query.length >= 1) {
      const branches = await paymentTokenizer.searchBranches(selectedBank.code, query);
      setBranchSuggestions(branches);
    } else {
      setBranchSuggestions([]);
    }
    
    setSelectedBranch(null);
  }, [selectedBank, setValue]);

  const selectBranch = useCallback((branch: BranchInfo) => {
    setSelectedBranch(branch);
    setValue('bankBranch', branch.name);
    setValue('branchCode', branch.code);
    setBranchSuggestions([]);
  }, [setValue]);

  const validateBankAccount = useCallback(async () => {
    if (selectedBank && selectedBranch) {
      const accountNumber = watch('bankAccount');
      const accountName = watch('bankAccountName');
      
      if (accountNumber && accountName) {
        const validation = await paymentTokenizer.validateBankAccount(
          selectedBank.code,
          selectedBranch.code,
          accountNumber,
          accountName
        );
        onValidationChange(validation);
      }
    }
  }, [selectedBank, selectedBranch, watch, onValidationChange]);

  React.useEffect(() => {
    validateBankAccount();
  }, [validateBankAccount]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-medium mb-2">銀行名</label>
        <input
          {...register('bankName')}
          type="text"
          placeholder="○○銀行"
          onChange={handleBankSearch}
          autoComplete="off"
          className="w-full p-2 border rounded-md"
        />
        {bankSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {bankSuggestions.map((bank, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => selectBank(bank)}
              >
                <div className="font-medium">{bank.name}</div>
                <div className="text-sm text-gray-500">コード: {bank.code}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="relative">
        <label className="block text-sm font-medium mb-2">支店名</label>
        <input
          {...register('bankBranch')}
          type="text"
          placeholder="○○支店"
          onChange={handleBranchSearch}
          disabled={!selectedBank}
          autoComplete="off"
          className="w-full p-2 border rounded-md"
        />
        {branchSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {branchSuggestions.map((branch, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => selectBranch(branch)}
              >
                <div className="font-medium">{branch.name}</div>
                <div className="text-sm text-gray-500">コード: {branch.code}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">口座番号</label>
        <input
          {...register('bankAccount')}
          type="text"
          placeholder="1234567"
          maxLength={8}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setValue('bankAccount', value);
          }}
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">口座名義人</label>
        <input
          {...register('bankAccountName')}
          type="text"
          placeholder="ヤマダ タロウ"
          className="w-full p-2 border rounded-md"
        />
      </div>
    </div>
  );
};
