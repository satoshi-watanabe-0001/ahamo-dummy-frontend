import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ProgressIndicator } from '../ui/progress-indicator';
import { SaveStatus } from '../ui/save-status';
import { RestoreDialog } from '../ui/restore-dialog';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useSessionRestore } from '../../hooks/useSessionRestore';
import { toast } from '../../hooks/use-toast';
export interface UsageProfileData {
  monthlyDataUsage: number;
  callFrequency: 'low' | 'medium' | 'high';
  smsUsage: 'low' | 'medium' | 'high';
  budget: {
    min: number;
    max: number;
  };
  currentCarrier?: string;
  primaryUse: 'personal' | 'business' | 'both';
}

interface UsageProfilingFormProps {
  onSubmit: (data: UsageProfileData) => void;
  onSave?: (data: UsageProfileData) => void;
  onBack?: () => void;
}

const DATA_USAGE_OPTIONS = [
  { value: 1, label: '1GB未満', description: 'メール・LINEが中心' },
  { value: 3, label: '1-3GB', description: 'SNS・ウェブ閲覧' },
  { value: 7, label: '3-7GB', description: '動画視聴も時々' },
  { value: 15, label: '7-15GB', description: '動画・音楽をよく利用' },
  { value: 25, label: '15-25GB', description: 'ヘビーユーザー' },
  { value: 50, label: '25GB以上', description: '大容量利用' }
];

const USAGE_FREQUENCY_OPTIONS = [
  { value: 'low', label: '少ない', description: '月10分未満' },
  { value: 'medium', label: '普通', description: '月10-60分' },
  { value: 'high', label: '多い', description: '月60分以上' }
];

const PRIMARY_USE_OPTIONS = [
  { value: 'personal', label: '個人利用', description: 'プライベート中心' },
  { value: 'business', label: 'ビジネス利用', description: '仕事中心' },
  { value: 'both', label: '両方', description: '個人・仕事両方' }
];

export const UsageProfilingForm = ({ onSubmit, onSave, onBack }: UsageProfilingFormProps) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm<UsageProfileData>({
    defaultValues: {
      monthlyDataUsage: 7,
      callFrequency: 'medium',
      smsUsage: 'low',
      budget: {
        min: 2000,
        max: 5000
      },
      primaryUse: 'personal'
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
    formId: 'usage-profile',
    onSave,
    onRestore: (data) => {
      if (setValue && data) {
        Object.keys(data).forEach(key => {
          if (key === 'budget' && data[key]) {
            setValue('budget.min', data[key].min || 2000);
            setValue('budget.max', data[key].max || 5000);
          } else {
            setValue(key as keyof UsageProfileData, data[key]);
          }
        });
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
      if (setValue && data) {
        Object.keys(data).forEach(key => {
          if (key === 'budget' && data[key]) {
            setValue('budget.min', data[key].min || 2000);
            setValue('budget.max', data[key].max || 5000);
          } else {
            setValue(key as keyof UsageProfileData, data[key]);
          }
        });
      }
      toast({
        title: 'データを復元しました',
        description: '利用状況の内容を復元しました',
        severity: 'INFO'
      });
    },
    onStartFresh: () => {
      reset();
      toast({
        title: '新規作成',
        description: '最初から利用状況を入力します',
        severity: 'INFO'
      });
    }
  });

  useEffect(() => {
    const savedData = loadData();
    if (savedData && setValue) {
      Object.keys(savedData).forEach(key => {
        if (key === 'budget' && savedData[key]) {
          setValue('budget.min', savedData[key].min || 2000);
          setValue('budget.max', savedData[key].max || 5000);
        } else {
          setValue(key as keyof UsageProfileData, savedData[key]);
        }
      });
    }
  }, []);

  const monthlyDataUsage = watch('monthlyDataUsage');
  const callFrequency = watch('callFrequency');
  const smsUsage = watch('smsUsage');
  const primaryUse = watch('primaryUse');

  useEffect(() => {
    const subscription = watch((data) => {
      if (data && Object.keys(data).length > 0) {
        updateFormData(data);
        onSave?.(data as UsageProfileData);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleFormSubmit = (data: UsageProfileData) => {
    clearData();
    onSubmit(data);
  };

  const getRecommendedPlan = () => {
    if (monthlyDataUsage <= 3) return 'ahamo基本プラン (20GB)';
    if (monthlyDataUsage <= 20) return 'ahamo基本プラン (20GB)';
    return 'ahamoラージ (100GB)';
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
          currentStep={1}
          totalSteps={10}
          steps={['契約タイプ', '利用状況', 'プラン選択', '端末選択', '料金確認', '個人情報', '本人確認', '決済', '契約確認', '完了']}
          showCompletionStatus={true}
          completedSteps={['contract-type']}
        />
        
        <SaveStatus
          status={saveStatus}
          onManualSave={manualSave}
          lastSavedTime={lastSavedTime}
          className="mb-6"
        />
      
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">利用状況をお聞かせください</h2>
            <p className="text-gray-600 mb-6">あなたに最適なプランをご提案するため、現在の利用状況を教えてください。</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">月間データ使用量</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DATA_USAGE_OPTIONS.map(option => (
                <label key={option.value} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    {...register('monthlyDataUsage')}
                    type="radio"
                    value={option.value}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">通話頻度</h3>
              <div className="space-y-3">
                {USAGE_FREQUENCY_OPTIONS.map(option => (
                  <label key={option.value} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('callFrequency')}
                      type="radio"
                      value={option.value}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">SMS利用頻度</h3>
              <div className="space-y-3">
                {USAGE_FREQUENCY_OPTIONS.map(option => (
                  <label key={option.value} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('smsUsage')}
                      type="radio"
                      value={option.value}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">主な利用目的</h3>
            <div className="space-y-3">
              {PRIMARY_USE_OPTIONS.map(option => (
                <label key={option.value} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    {...register('primaryUse')}
                    type="radio"
                    value={option.value}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">月額予算</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">最低予算</label>
                <Input
                  {...register('budget.min')}
                  type="number"
                  min="1000"
                  max="10000"
                  step="500"
                  className="w-full"
                />
                <span className="text-sm text-gray-500">円/月</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">最高予算</label>
                <Input
                  {...register('budget.max')}
                  type="number"
                  min="1000"
                  max="10000"
                  step="500"
                  className="w-full"
                />
                <span className="text-sm text-gray-500">円/月</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">現在のキャリア（任意）</label>
            <Input
              {...register('currentCarrier')}
              placeholder="例: docomo, au, SoftBank"
              className="w-full"
            />
          </div>

          {monthlyDataUsage && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">おすすめプラン</h4>
              <p className="text-sm text-blue-800">
                あなたの利用状況から、<strong>{getRecommendedPlan()}</strong>がおすすめです。
              </p>
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
              <Button type="submit" disabled={!monthlyDataUsage || !callFrequency || !smsUsage || !primaryUse}>
                次へ進む
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
