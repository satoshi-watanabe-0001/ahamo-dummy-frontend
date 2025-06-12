import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ProgressIndicator } from '../ui/progress-indicator';
import { SaveStatus } from '../ui/save-status';
import { RestoreDialog } from '../ui/restore-dialog';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useSessionRestore } from '../../hooks/useSessionRestore';
import { toast } from '../../hooks/use-toast';

export interface PlanSelectionFormData {
  selectedPlanId: string;
  selectedOptions: string[];
  contractType: 'new' | 'mnp' | 'upgrade';
}

interface PlanSelectionFormProps {
  onSubmit: (data: PlanSelectionFormData) => void;
  onSave?: (data: PlanSelectionFormData) => void;
  onBack?: () => void;
}

const AVAILABLE_PLANS = [
  {
    id: 'ahamo-basic',
    name: 'ahamo基本プラン',
    price: 2970,
    data: '20GB',
    description: '20GB + 5分以内の国内通話無料'
  },
  {
    id: 'ahamo-large',
    name: 'ahamoラージ',
    price: 4950,
    data: '100GB',
    description: '100GB + 5分以内の国内通話無料'
  }
];

const AVAILABLE_OPTIONS = [
  {
    id: 'call-unlimited',
    name: 'かけ放題オプション',
    price: 1100,
    description: '国内通話無料'
  },
  {
    id: 'data-extra',
    name: 'データ追加オプション',
    price: 550,
    description: '1GB追加'
  }
];

export const PlanSelectionForm = ({ onSubmit, onSave, onBack }: PlanSelectionFormProps) => {
  const {
    saveStatus,
    lastSavedTime,
    updateFormData,
    manualSave,
    clearData,
    loadData
  } = useFormPersistence({
    formId: 'plan-selection',
    onSave,
    onRestore: (data) => {
      setValue('selectedPlanId', data.selectedPlanId || '');
      setValue('selectedOptions', data.selectedOptions || []);
      setValue('contractType', data.contractType || 'new');
    }
  });

  const {
    showRestoreDialog,
    handleRestore,
    handleStartFresh,
    closeDialog
  } = useSessionRestore({
    onRestore: (data) => {
      setValue('selectedPlanId', data.selectedPlanId || '');
      setValue('selectedOptions', data.selectedOptions || []);
      setValue('contractType', data.contractType || 'new');
      toast({
        title: 'データを復元しました',
        description: 'プラン選択の内容を復元しました',
        severity: 'INFO'
      });
    },
    onStartFresh: () => {
      reset();
      toast({
        title: '新規作成',
        description: '最初からプラン選択を開始します',
        severity: 'INFO'
      });
    }
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<PlanSelectionFormData>({
    defaultValues: loadData() || {
      selectedPlanId: '',
      selectedOptions: [],
      contractType: 'new'
    }
  });

  const selectedPlanId = watch('selectedPlanId');
  const selectedOptions = watch('selectedOptions');
  const contractType = watch('contractType');

  useEffect(() => {
    const subscription = watch((data) => {
      updateFormData(data);
      onSave?.(data as PlanSelectionFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onSave, updateFormData]);

  const handleFormSubmit = (data: PlanSelectionFormData) => {
    clearData();
    onSubmit(data);
  };

  const handleOptionToggle = (optionId: string) => {
    const currentOptions = selectedOptions || [];
    const newOptions = currentOptions.includes(optionId)
      ? currentOptions.filter(id => id !== optionId)
      : [...currentOptions, optionId];
    setValue('selectedOptions', newOptions);
  };

  const selectedPlan = AVAILABLE_PLANS.find(plan => plan.id === selectedPlanId);
  const totalPrice = (selectedPlan?.price || 0) + 
    AVAILABLE_OPTIONS
      .filter(option => selectedOptions?.includes(option.id))
      .reduce((sum, option) => sum + option.price, 0);

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
          currentStep={2}
          totalSteps={5}
          steps={['個人情報', 'プラン選択', '本人確認', '決済', '完了']}
          showCompletionStatus={true}
          completedSteps={['personal-info']}
        />
        
        <SaveStatus
          status={saveStatus}
          onManualSave={manualSave}
          lastSavedTime={lastSavedTime}
          className="mb-6"
        />
      
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">契約タイプ</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'new', label: '新規契約' },
                { value: 'mnp', label: 'MNP転入' },
                { value: 'upgrade', label: '機種変更' }
              ].map(type => (
                <label key={type.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    {...register('contractType')}
                    type="radio"
                    value={type.value}
                    className="mr-2"
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">プラン選択</h3>
            <div className="space-y-4">
              {AVAILABLE_PLANS.map(plan => (
                <label key={plan.id} className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    {...register('selectedPlanId')}
                    type="radio"
                    value={plan.id}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{plan.name}</h4>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                        <p className="text-sm text-gray-500">データ容量: {plan.data}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">¥{plan.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">/月</span>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {selectedPlanId && (
            <div>
              <h3 className="text-lg font-medium mb-4">オプション</h3>
              <div className="space-y-3">
                {AVAILABLE_OPTIONS.map(option => (
                  <label key={option.id} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedOptions?.includes(option.id) || false}
                      onChange={() => handleOptionToggle(option.id)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{option.name}</h4>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">¥{option.price.toLocaleString()}</span>
                          <span className="text-sm text-gray-500">/月</span>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {selectedPlanId && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">月額料金合計</span>
                <span className="text-xl font-bold text-blue-600">
                  ¥{totalPrice.toLocaleString()}/月
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              戻る
            </Button>
            <div className="space-x-3">
              <Button type="button" variant="outline" onClick={clearData}>
                入力内容をクリア
              </Button>
              <Button type="submit" disabled={!selectedPlanId}>
                次へ進む
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
