import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { ConvenienceStoreMap } from '../maps/ConvenienceStoreMap';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { ShippingFormData, Address, ConvenienceStore } from '../../types';
import { ProgressIndicator } from '../ui/progress-indicator';
import { SaveStatus } from '../ui/save-status';

interface ShippingAddressFormProps {
  onSubmit: (data: ShippingFormData) => void;
  onSave?: (data: ShippingFormData) => void;
  onBack?: () => void;
  contractAddress?: Address;
}

export const ShippingAddressForm = ({ 
  onSubmit, 
  onSave, 
  onBack, 
  contractAddress 
}: ShippingAddressFormProps) => {
  const [addressType, setAddressType] = useState<'contract' | 'alternate' | 'work' | 'convenience'>('contract');
  const [selectedStore, setSelectedStore] = useState<ConvenienceStore | null>(null);

  const {
    saveStatus,
    lastSavedTime,
    updateFormData,
    manualSave,
    clearData,
    loadData
  } = useFormPersistence({
    formId: 'shipping-address',
    onSave,
    onRestore: (data) => {
      Object.keys(data).forEach(key => {
        setValue(key as keyof ShippingFormData, data[key]);
      });
      if (data.addressType) {
        setAddressType(data.addressType);
      }
      if (data.convenienceStore) {
        setSelectedStore(data.convenienceStore);
      }
    }
  });

  const { register, handleSubmit, setValue, watch } = useForm<ShippingFormData>({
    defaultValues: loadData() || {
      addressType: 'contract',
      deliveryOption: '',
      deliveryNotes: ''
    }
  });

  const watchedAddressType = watch('addressType');

  useEffect(() => {
    if (watchedAddressType) {
      setAddressType(watchedAddressType);
    }
  }, [watchedAddressType]);

  useEffect(() => {
    const subscription = watch((data) => {
      updateFormData(data);
      onSave?.(data as ShippingFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onSave, updateFormData]);

  const handleFormSubmit = (data: ShippingFormData) => {
    if (addressType === 'convenience' && !selectedStore) {
      return;
    }
    
    const submitData = {
      ...data,
      convenienceStore: addressType === 'convenience' ? selectedStore : undefined
    };
    
    clearData();
    onSubmit(submitData);
  };

  const handleStoreSelect = (store: ConvenienceStore) => {
    setSelectedStore(store);
    setValue('convenienceStore', store);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <ProgressIndicator 
        currentStep={5}
        totalSteps={6}
        steps={['個人情報', 'プラン選択', '本人確認', '決済', '配送', '完了']}
        showCompletionStatus={true}
        completedSteps={['personal-info', 'plan-selection', 'verification', 'payment']}
      />
      
      <SaveStatus
        status={saveStatus}
        onManualSave={manualSave}
        lastSavedTime={lastSavedTime || undefined}
        className="mb-6"
      />

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">配送先住所</h3>
          <RadioGroup value={addressType} onValueChange={(value: string) => {
            setAddressType(value as typeof addressType);
            setValue('addressType', value as typeof addressType);
          }}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="contract" id="contract" />
              <Label htmlFor="contract">契約時の住所を使用</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="alternate" id="alternate" />
              <Label htmlFor="alternate">別の住所を指定</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="work" id="work" />
              <Label htmlFor="work">勤務先</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="convenience" id="convenience" />
              <Label htmlFor="convenience">コンビニ受取</Label>
            </div>
          </RadioGroup>
        </div>

        {addressType === 'contract' && contractAddress && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">契約住所</h4>
            <p>{contractAddress.postalCode}</p>
            <p>{contractAddress.prefecture} {contractAddress.city}</p>
            <p>{contractAddress.addressLine1}</p>
            {contractAddress.addressLine2 && <p>{contractAddress.addressLine2}</p>}
          </div>
        )}

        {(addressType === 'alternate' || addressType === 'work') && (
          <div className="space-y-4">
            <h4 className="font-medium">
              {addressType === 'alternate' ? '別住所' : '勤務先住所'}
            </h4>
            
            <div>
              <label className="block text-sm font-medium mb-2">郵便番号</label>
              <Input
                {...register(`${addressType}Address.postalCode` as any)}
                placeholder="000-0000"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">都道府県</label>
                <Input
                  {...register(`${addressType}Address.prefecture` as any)}
                  placeholder="東京都"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">市区町村</label>
                <Input
                  {...register(`${addressType}Address.city` as any)}
                  placeholder="渋谷区"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">住所</label>
              <Input
                {...register(`${addressType}Address.addressLine1` as any)}
                placeholder="○○町1-2-3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">住所2（任意）</label>
              <Input
                {...register(`${addressType}Address.addressLine2` as any)}
                placeholder="○○マンション101号室"
              />
            </div>
          </div>
        )}

        {addressType === 'convenience' && (
          <ConvenienceStoreMap
            onStoreSelect={handleStoreSelect}
            selectedStore={selectedStore}
          />
        )}

        <div>
          <label className="block text-sm font-medium mb-2">配送メモ（任意）</label>
          <textarea
            {...register('deliveryNotes')}
            className="w-full p-3 border rounded-lg"
            rows={3}
            placeholder="配送に関する特別な指示があれば入力してください"
          />
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            戻る
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={addressType === 'convenience' && !selectedStore}
          >
            次へ
          </Button>
        </div>
      </form>
    </div>
  );
};
