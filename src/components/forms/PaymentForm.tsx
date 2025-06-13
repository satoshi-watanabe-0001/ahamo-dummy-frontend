import { useForm } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ProgressIndicator } from '../ui/progress-indicator';
import { SaveStatus } from '../ui/save-status';
import { RestoreDialog } from '../ui/restore-dialog';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useSessionRestore } from '../../hooks/useSessionRestore';
import { toast } from '../../hooks/use-toast';

import { paymentTokenizer } from '../../services/paymentTokenizer';
import type { BankInfo, BranchInfo, PaymentValidationResult } from '../../types/payment';

export interface PaymentFormData {
  paymentMethod: 'credit' | 'bank' | 'convenience';
  creditCardNumber?: string;
  creditCardExpiry?: string;
  creditCardCvc?: string;
  creditCardName?: string;
  bankName?: string;
  bankBranch?: string;
  bankAccount?: string;
  bankAccountName?: string;
  bankCode?: string;
  branchCode?: string;
  paymentToken?: string;
  billingAddress: {
    postalCode: string;
    prefecture: string;
    city: string;
    addressLine1: string;
    addressLine2?: string;
  };
  agreementTerms: boolean;
  agreementPrivacy: boolean;
}

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  onSave?: (data: PaymentFormData) => void;
  onBack?: () => void;
}

const PAYMENT_METHODS = [
  { value: 'credit', label: 'クレジットカード', description: 'Visa, Mastercard, JCB対応' },
  { value: 'bank', label: '銀行口座振替', description: '毎月自動引き落とし' },
  { value: 'convenience', label: 'コンビニ払い', description: '毎月コンビニでお支払い' }
];

export const PaymentForm = ({ onSubmit, onSave, onBack }: PaymentFormProps) => {
  const [paymentToken, setPaymentToken] = useState<string>('');
  const [maskedCardNumber, setMaskedCardNumber] = useState<string>('');
  const [bankSuggestions, setBankSuggestions] = useState<BankInfo[]>([]);
  const [branchSuggestions, setBranchSuggestions] = useState<BranchInfo[]>([]);
  const [selectedBank, setSelectedBank] = useState<BankInfo | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchInfo | null>(null);
  const [bankAccountValidation, setBankAccountValidation] = useState<PaymentValidationResult | null>(null);

  const {
    saveStatus,
    lastSavedTime,
    updateFormData,
    manualSave,
    clearData,
    loadData
  } = useFormPersistence({
    formId: 'payment',
    onSave,
    onRestore: (data) => {
      Object.keys(data).forEach(key => {
        if (key === 'billingAddress' && data[key]) {
          Object.keys(data[key]).forEach(addressKey => {
            setValue(`billingAddress.${addressKey}` as any, data[key][addressKey]);
          });
        } else {
          setValue(key as keyof PaymentFormData, data[key]);
        }
      });
    }
  });

  const {
    showRestoreDialog,
    handleRestore,
    handleStartFresh,
    closeDialog
  } = useSessionRestore({
    onRestore: (data) => {
      Object.keys(data).forEach(key => {
        if (key === 'billingAddress' && data[key]) {
          Object.keys(data[key]).forEach(addressKey => {
            setValue(`billingAddress.${addressKey}` as any, data[key][addressKey]);
          });
        } else {
          setValue(key as keyof PaymentFormData, data[key]);
        }
      });
      toast({
        title: 'データを復元しました',
        description: '決済情報の内容を復元しました',
        severity: 'INFO'
      });
    },
    onStartFresh: () => {
      reset();
      toast({
        title: '新規作成',
        description: '最初から決済情報を入力します',
        severity: 'INFO'
      });
    }
  });

  const { register, handleSubmit, setValue, watch, reset } = useForm<PaymentFormData>({
    defaultValues: loadData() || {
      paymentMethod: 'credit',
      billingAddress: {
        postalCode: '',
        prefecture: '',
        city: '',
        addressLine1: '',
        addressLine2: ''
      },
      agreementTerms: false,
      agreementPrivacy: false
    }
  });

  const paymentMethod = watch('paymentMethod');
  const agreementTerms = watch('agreementTerms');
  const agreementPrivacy = watch('agreementPrivacy');

  useEffect(() => {
    const subscription = watch((data: any) => {
      updateFormData(data);
      onSave?.(data as PaymentFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onSave, updateFormData]);

  const handleTokenReceived = useCallback((token: string, maskedCard: string) => {
    setPaymentToken(token);
    setMaskedCardNumber(maskedCard);
    setValue('paymentToken', token);
  }, [setValue]);

  const handleTokenError = useCallback((error: string) => {
    toast({
      title: 'カード情報エラー',
      description: error,
      severity: 'WARNING'
    });
  }, []);

  const handleClearToken = useCallback(() => {
    setPaymentToken('');
    setMaskedCardNumber('');
    setValue('paymentToken', '');
  }, [setValue]);

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
        setBankAccountValidation(validation);
      }
    }
  }, [selectedBank, selectedBranch, watch]);

  useEffect(() => {
    if (paymentMethod === 'bank') {
      validateBankAccount();
    }
  }, [paymentMethod, validateBankAccount]);

  const handleFormSubmit = (data: PaymentFormData) => {
    if (!data.agreementTerms || !data.agreementPrivacy) {
      toast({
        title: '同意が必要です',
        description: '利用規約とプライバシーポリシーに同意してください',
        severity: 'WARNING'
      });
      return;
    }
    
    if (data.paymentMethod === 'credit' && !paymentToken) {
      toast({
        title: 'カード情報が必要です',
        description: 'クレジットカード情報を入力してください',
        severity: 'WARNING'
      });
      return;
    }
    
    clearData();
    onSubmit({
      ...data,
      paymentToken: paymentToken || undefined
    });
  };



  return (
    <>
      <RestoreDialog
        isOpen={showRestoreDialog}
        onRestore={handleRestore}
        onStartFresh={handleStartFresh}
        onClose={closeDialog}
      />
      
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <ProgressIndicator 
          currentStep={4}
          totalSteps={6}
          steps={['個人情報', 'プラン選択', '本人確認', '決済', '契約確認', '完了']}
          showCompletionStatus={true}
          completedSteps={['personal-info', 'plan-selection', 'verification']}
        />
        
        <SaveStatus
          status={saveStatus}
          onManualSave={manualSave}
          lastSavedTime={lastSavedTime || undefined}
          className="mb-6"
        />
      
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">お支払い方法</h3>
            <div className="space-y-3">
              {PAYMENT_METHODS.map(method => (
                <label key={method.value} className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value={method.value}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <h4 className="font-medium">{method.label}</h4>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {paymentMethod === 'credit' && (
            <div>
              <h3 className="text-lg font-medium mb-4">クレジットカード情報</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-3">
                  セキュリティのため、カード情報は安全な環境で入力されます
                </p>
                {!paymentToken ? (
                  <iframe
                    src="/secure-card-form.html"
                    className="w-full h-96 border-0 rounded"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    title="Secure Card Input"
                    onLoad={() => {
                      window.addEventListener('message', (event) => {
                        if (event.data.type === 'PAYMENT_TOKEN_SUCCESS') {
                          handleTokenReceived(event.data.token, event.data.maskedCardNumber);
                        } else if (event.data.type === 'PAYMENT_TOKEN_ERROR') {
                          handleTokenError(event.data.error);
                        }
                      });
                    }}
                  />
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-700 font-medium">カード情報が安全に保存されました</span>
                    </div>
                    <p className="text-green-600 text-sm mt-1">{maskedCardNumber}</p>
                    <button
                      type="button"
                      onClick={handleClearToken}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                    >
                      カード情報を変更する
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {paymentMethod === 'bank' && (
            <div>
              <h3 className="text-lg font-medium mb-4">銀行口座情報</h3>
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium mb-2">銀行名</label>
                  <Input
                    {...register('bankName')}
                    placeholder="○○銀行"
                    onChange={handleBankSearch}
                    autoComplete="off"
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
                  <Input
                    {...register('bankBranch')}
                    placeholder="○○支店"
                    onChange={handleBranchSearch}
                    disabled={!selectedBank}
                    autoComplete="off"
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
                  <Input
                    {...register('bankAccount')}
                    placeholder="1234567"
                    inputMode="numeric"
                    maxLength={8}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setValue('bankAccount', value);
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">口座名義人</label>
                  <Input
                    {...register('bankAccountName')}
                    placeholder="ヤマダ タロウ"
                  />
                </div>
                
                {bankAccountValidation && (
                  <div className={`p-3 rounded-md ${bankAccountValidation.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`text-sm ${bankAccountValidation.valid ? 'text-green-700' : 'text-red-700'}`}>
                      {bankAccountValidation.message}
                    </p>
                    {bankAccountValidation.errors && bankAccountValidation.errors.length > 0 && (
                      <ul className="text-red-600 text-sm mt-1 list-disc list-inside">
                        {bankAccountValidation.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-4">請求先住所</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">郵便番号</label>
                <Input
                  {...register('billingAddress.postalCode')}
                  placeholder="000-0000"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">都道府県</label>
                  <Input
                    {...register('billingAddress.prefecture')}
                    placeholder="東京都"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">市区町村</label>
                  <Input
                    {...register('billingAddress.city')}
                    placeholder="渋谷区"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">住所</label>
                <Input
                  {...register('billingAddress.addressLine1')}
                  placeholder="○○町1-2-3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">住所2（任意）</label>
                <Input
                  {...register('billingAddress.addressLine2')}
                  placeholder="○○マンション101号室"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">同意事項</h3>
            
            <label className="flex items-start space-x-3">
              <input
                {...register('agreementTerms')}
                type="checkbox"
                className="mt-1"
              />
              <div>
                <span className="text-sm">
                  <a href="#" className="text-blue-600 hover:underline">利用規約</a>に同意します
                </span>
              </div>
            </label>
            
            <label className="flex items-start space-x-3">
              <input
                {...register('agreementPrivacy')}
                type="checkbox"
                className="mt-1"
              />
              <div>
                <span className="text-sm">
                  <a href="#" className="text-blue-600 hover:underline">プライバシーポリシー</a>に同意します
                </span>
              </div>
            </label>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              戻る
            </Button>
            <div className="space-x-3">
              <Button type="button" variant="outline" onClick={clearData}>
                入力内容をクリア
              </Button>
              <Button 
                type="submit" 
                disabled={!agreementTerms || !agreementPrivacy}
                className="bg-green-600 hover:bg-green-700"
              >
                契約を完了する
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
