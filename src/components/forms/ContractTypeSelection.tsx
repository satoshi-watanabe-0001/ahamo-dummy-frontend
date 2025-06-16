import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { ProgressIndicator } from '../ui/progress-indicator';
import { SaveStatus } from '../ui/save-status';
import { RestoreDialog } from '../ui/restore-dialog';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useSessionRestore } from '../../hooks/useSessionRestore';
import { toast } from '../../hooks/use-toast';
export interface ContractTypeData {
  contractType: 'new' | 'mnp' | 'upgrade';
}

interface ContractTypeSelectionProps {
  onSubmit: (data: ContractTypeData) => void;
  onSave?: (data: ContractTypeData) => void;
  onBack?: () => void;
}

const CONTRACT_TYPES = [
  { 
    value: 'new', 
    label: '新規契約',
    description: '新しく携帯電話番号を取得して契約',
    icon: '📱'
  },
  { 
    value: 'mnp', 
    label: 'MNP転入',
    description: '現在の電話番号を引き継いで乗り換え',
    icon: '🔄'
  },
  { 
    value: 'upgrade', 
    label: '機種変更',
    description: 'ahamoをご利用中で端末のみ変更',
    icon: '📲'
  }
];

export const ContractTypeSelection = ({ onSubmit, onSave, onBack }: ContractTypeSelectionProps) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm<ContractTypeData>({
    defaultValues: {
      contractType: 'new'
    }
  });

  const {
    saveStatus,
    lastSavedTime,
    updateFormData,
    manualSave,
    clearData,
    loadData
  } = useFormPersistence({
    formId: 'contract-type',
    onSave,
    onRestore: (data) => {
      if (setValue && data?.contractType) {
        setValue('contractType', data.contractType);
      }
    }
  });

  const {
    showRestoreDialog,
    handleRestore,
    handleStartFresh,
    closeDialog
  } = useSessionRestore({
    onRestore: (data) => {
      if (setValue && data?.contractType) {
        setValue('contractType', data.contractType);
      }
      toast({
        title: 'データを復元しました',
        description: '契約タイプの選択を復元しました',
        severity: 'INFO'
      });
    },
    onStartFresh: () => {
      reset();
      toast({
        title: '新規作成',
        description: '最初から契約タイプを選択します',
        severity: 'INFO'
      });
    }
  });

  useEffect(() => {
    const savedData = loadData();
    if (savedData?.contractType && setValue) {
      setValue('contractType', savedData.contractType);
    }
  }, [loadData, setValue]);

  const contractType = watch('contractType');

  useEffect(() => {
    const subscription = watch((data) => {
      updateFormData(data);
      onSave?.(data as ContractTypeData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onSave, updateFormData]);

  const handleFormSubmit = (data: ContractTypeData) => {
    clearData();
    onSubmit(data);
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
          currentStep={0}
          totalSteps={10}
          steps={['契約タイプ', '利用状況', 'プラン選択', '端末選択', '料金確認', '個人情報', '本人確認', '決済', '契約確認', '完了']}
          showCompletionStatus={true}
          completedSteps={[]}
        />
        
        <SaveStatus
          status={saveStatus}
          onManualSave={manualSave}
          lastSavedTime={lastSavedTime}
          className="mb-6"
        />
      
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">契約タイプを選択してください</h2>
            <p className="text-gray-600 mb-6">ご希望の契約方法を選択してください。</p>
            
            <div className="space-y-4">
              {CONTRACT_TYPES.map(type => (
                <label key={type.value} className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    {...register('contractType')}
                    type="radio"
                    value={type.value}
                    className="mt-1 mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{type.icon}</span>
                      <h3 className="text-lg font-medium">{type.label}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {contractType === 'mnp' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">MNP転入について</h4>
              <p className="text-sm text-blue-800">
                現在ご利用中の携帯電話会社でMNP予約番号を取得してからお申し込みください。
                MNP予約番号の有効期限は取得日を含めて15日間です。
              </p>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              戻る
            </Button>
            <div className="space-x-3">
              <Button type="button" variant="outline" onClick={clearData}>
                選択をクリア
              </Button>
              <Button type="submit" disabled={!contractType}>
                次へ進む
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
