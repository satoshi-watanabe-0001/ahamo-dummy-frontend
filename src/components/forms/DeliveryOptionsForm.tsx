
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { DeliveryTimeSelector } from './DeliveryTimeSelector';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { ShippingFormData, DeliveryTimeSlot } from '../../types';
import { ProgressIndicator } from '../ui/progress-indicator';
import { SaveStatus } from '../ui/save-status';

interface DeliveryOptionsFormProps {
  onSubmit: (data: ShippingFormData) => void;
  onSave?: (data: ShippingFormData) => void;
  onBack?: () => void;
}

const DELIVERY_OPTIONS = [
  { 
    value: 'unattended', 
    label: '置き配', 
    description: '玄関前などに荷物を置いて配送完了',
    requiresRecipient: false 
  },
  { 
    value: 'delivery_box', 
    label: '宅配ボックス', 
    description: 'マンション等の宅配ボックスに配送',
    requiresRecipient: false 
  },
  { 
    value: 'face_to_face', 
    label: '対面受取', 
    description: '受取人との対面での受け渡し',
    requiresRecipient: true 
  },
  { 
    value: 'recipient_only', 
    label: '本人限定受取', 
    description: '本人確認書類による本人限定受取',
    requiresRecipient: true 
  }
];

export const DeliveryOptionsForm = ({ 
  onSubmit, 
  onSave, 
  onBack 
}: DeliveryOptionsFormProps) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<DeliveryTimeSlot | null>(null);

  const {
    saveStatus,
    lastSavedTime,
    updateFormData,
    manualSave,
    clearData,
    loadData
  } = useFormPersistence({
    formId: 'delivery-options',
    onSave,
    onRestore: (data) => {
      Object.keys(data).forEach(key => {
        setValue(key as keyof ShippingFormData, data[key]);
      });
      if (data.deliveryTimeSlot) {
        setSelectedTimeSlot(data.deliveryTimeSlot);
      }
    }
  });

  const { register, handleSubmit, setValue, watch } = useForm<ShippingFormData>({
    defaultValues: loadData() || {
      deliveryOption: '',
      recipientName: '',
      recipientPhone: '',
      delegationInfo: '',
      absenceHandling: ''
    }
  });

  const deliveryOption = watch('deliveryOption');
  const selectedOption = DELIVERY_OPTIONS.find(opt => opt.value === deliveryOption);

  useEffect(() => {
    const subscription = watch((data) => {
      updateFormData(data);
      onSave?.(data as ShippingFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onSave, updateFormData]);

  const handleFormSubmit = (data: ShippingFormData) => {
    const submitData = {
      ...data,
      deliveryTimeSlot: selectedTimeSlot
    };
    
    clearData();
    onSubmit(submitData);
  };

  const handleTimeSlotSelect = (timeSlot: DeliveryTimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setValue('deliveryTimeSlot', timeSlot);
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
          <h3 className="text-lg font-medium mb-4">配送時間帯</h3>
          <DeliveryTimeSelector 
            onTimeSlotSelect={handleTimeSlotSelect}
            selectedTimeSlot={selectedTimeSlot}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">配送オプション</h3>
          <RadioGroup value={deliveryOption} onValueChange={(value: string) => {
            setValue('deliveryOption', value);
          }}>
            {DELIVERY_OPTIONS.map(option => (
              <div key={option.value} className="flex items-start p-4 border rounded-lg">
                <RadioGroupItem value={option.value} id={option.value} className="mt-1 mr-3" />
                <div className="flex-1">
                  <Label htmlFor={option.value} className="font-medium cursor-pointer">
                    {option.label}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {selectedOption && selectedOption.requiresRecipient && (
          <div className="space-y-4">
            <h4 className="font-medium">受取人情報</h4>
            
            <div>
              <label className="block text-sm font-medium mb-2">受取人氏名</label>
              <Input
                {...register('recipientName')}
                placeholder="山田 太郎"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">受取人電話番号</label>
              <Input
                {...register('recipientPhone')}
                placeholder="090-1234-5678"
                type="tel"
              />
            </div>
            
            {selectedOption.value === 'recipient_only' && (
              <div>
                <label className="block text-sm font-medium mb-2">委任情報（代理受取の場合）</label>
                <textarea
                  {...register('delegationInfo')}
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  placeholder="代理で受け取る場合の委任情報を入力してください"
                />
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">不在時の対応</label>
          <RadioGroup value={watch('absenceHandling') || ''} onValueChange={(value: string) => {
            setValue('absenceHandling', value);
          }}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="redelivery" id="redelivery" />
              <Label htmlFor="redelivery">再配達依頼</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pickup" id="pickup" />
              <Label htmlFor="pickup">営業所受取</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="neighbor" id="neighbor" />
              <Label htmlFor="neighbor">近隣への配達</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            戻る
          </Button>
          <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700"
            disabled={!deliveryOption || !selectedTimeSlot}
          >
            配送設定を完了
          </Button>
        </div>
      </form>
    </div>
  );
};
