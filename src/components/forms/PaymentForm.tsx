import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ProgressIndicator } from '../ui/progress-indicator';
import { SaveStatus } from '../ui/save-status';
import { RestoreDialog } from '../ui/restore-dialog';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useSessionRestore } from '../../hooks/useSessionRestore';
import { toast } from '../../hooks/use-toast';

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
    const subscription = watch((data) => {
      updateFormData(data);
      onSave?.(data as PaymentFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onSave, updateFormData]);

  const handleFormSubmit = (data: PaymentFormData) => {
    if (!data.agreementTerms || !data.agreementPrivacy) {
      toast({
        title: '同意が必要です',
        description: '利用規約とプライバシーポリシーに同意してください',
        severity: 'WARNING'
      });
      return;
    }
    clearData();
    onSubmit(data);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
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
          totalSteps={5}
          steps={['個人情報', 'プラン選択', '本人確認', '決済', '完了']}
          showCompletionStatus={true}
          completedSteps={['personal-info', 'plan-selection', 'verification']}
        />
        
        <SaveStatus
          status={saveStatus}
          onManualSave={manualSave}
          lastSavedTime={lastSavedTime}
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">カード番号</label>
                  <Input
                    {...register('creditCardNumber')}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setValue('creditCardNumber', formatted);
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">有効期限</label>
                    <Input
                      {...register('creditCardExpiry')}
                      placeholder="MM/YY"
                      maxLength={5}
                      onChange={(e) => {
                        const formatted = formatExpiry(e.target.value);
                        setValue('creditCardExpiry', formatted);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">セキュリティコード</label>
                    <Input
                      {...register('creditCardCvc')}
                      placeholder="123"
                      maxLength={4}
                      type="password"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">カード名義人</label>
                  <Input
                    {...register('creditCardName')}
                    placeholder="TARO YAMADA"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'bank' && (
            <div>
              <h3 className="text-lg font-medium mb-4">銀行口座情報</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">銀行名</label>
                  <Input
                    {...register('bankName')}
                    placeholder="○○銀行"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">支店名</label>
                  <Input
                    {...register('bankBranch')}
                    placeholder="○○支店"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">口座番号</label>
                  <Input
                    {...register('bankAccount')}
                    placeholder="1234567"
                    inputMode="numeric"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">口座名義人</label>
                  <Input
                    {...register('bankAccountName')}
                    placeholder="ヤマダ タロウ"
                  />
                </div>
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
