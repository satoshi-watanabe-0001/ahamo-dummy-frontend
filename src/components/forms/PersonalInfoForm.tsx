import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ProgressIndicator } from '../ui/progress-indicator';
import { SaveStatus } from '../ui/save-status';
import { RestoreDialog } from '../ui/restore-dialog';
import { personalInfoSchema, PersonalInfoFormData } from '../../schemas/personalInfoSchema';
import { addressApi } from '../../utils/addressApi';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useSessionRestore } from '../../hooks/useSessionRestore';
import { useDebounce } from '../../hooks/useDebounce';
import { toast } from '../../hooks/use-toast';

interface PersonalInfoFormProps {
  onSubmit: (data: PersonalInfoFormData) => void;
  onSave?: (data: PersonalInfoFormData) => void;
}

export const PersonalInfoForm = ({ onSubmit, onSave }: PersonalInfoFormProps) => {
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  
  const {
    saveStatus,
    lastSavedTime,
    updateFormData,
    manualSave,
    clearData,
    loadData
  } = useFormPersistence({
    formId: 'personal-info',
    onSave,
    onRestore: (data) => {
      Object.keys(data).forEach(key => {
        setValue(key as keyof PersonalInfoFormData, data[key]);
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
        setValue(key as keyof PersonalInfoFormData, data[key]);
      });
      toast({
        title: 'データを復元しました',
        description: '前回の入力内容を復元しました',
        severity: 'INFO'
      });
    },
    onStartFresh: () => {
      reset();
      toast({
        title: '新規作成',
        description: '最初から入力を開始します',
        severity: 'INFO'
      });
    }
  });
  
  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger, reset } = useForm<PersonalInfoFormData>({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: loadData() || {}
  });

  const postalCode = watch('postalCode');
  const debouncedPostalCode = useDebounce(postalCode, 500);

  useEffect(() => {
    const subscription = watch((data) => {
      updateFormData(data);
      onSave?.(data as PersonalInfoFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onSave, updateFormData]);

  useEffect(() => {
    if (debouncedPostalCode && /^\d{3}-\d{4}$/.test(debouncedPostalCode)) {
      setIsAddressLoading(true);
      addressApi.lookupByPostalCode(debouncedPostalCode)
        .then(addressInfo => {
          if (addressInfo) {
            setValue('prefecture', addressInfo.prefecture);
            setValue('city', addressInfo.city);
            setValue('addressLine1', addressInfo.addressLine1);
            trigger(['prefecture', 'city', 'addressLine1']);
          }
        })
        .catch(() => {
          toast({
            title: '住所検索エラー',
            description: '郵便番号から住所を取得できませんでした',
            severity: 'WARNING'
          });
        })
        .finally(() => setIsAddressLoading(false));
    }
  }, [debouncedPostalCode, setValue, trigger]);

  const handleFormSubmit = (data: PersonalInfoFormData) => {
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
          currentStep={1}
          totalSteps={6}
          steps={['個人情報', 'プラン選択', '本人確認', '決済', '契約確認', '完了']}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">氏名（漢字）*</label>
            <Input
              {...register('nameKanji')}
              imeMode="active"
              aria-invalid={!!errors.nameKanji}
              className={errors.nameKanji ? 'border-red-500' : ''}
            />
            {errors.nameKanji && (
              <p className="text-red-500 text-sm mt-1">{errors.nameKanji.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">氏名（カナ）*</label>
            <Input
              {...register('nameKana')}
              imeMode="active"
              aria-invalid={!!errors.nameKana}
              className={errors.nameKana ? 'border-red-500' : ''}
            />
            {errors.nameKana && (
              <p className="text-red-500 text-sm mt-1">{errors.nameKana.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">生年月日*</label>
            <Input
              {...register('birthDate')}
              type="date"
              aria-invalid={!!errors.birthDate}
              className={errors.birthDate ? 'border-red-500' : ''}
            />
            {errors.birthDate && (
              <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">性別*</label>
            <select
              {...register('gender')}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">選択してください</option>
              <option value="male">男性</option>
              <option value="female">女性</option>
              <option value="other">その他</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">郵便番号*</label>
          <Input
            {...register('postalCode')}
            placeholder="000-0000"
            inputMode="numeric"
            aria-invalid={!!errors.postalCode}
            className={errors.postalCode ? 'border-red-500' : ''}
          />
          {isAddressLoading && (
            <p className="text-blue-500 text-sm mt-1">住所を検索中...</p>
          )}
          {errors.postalCode && (
            <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">都道府県*</label>
            <Input
              {...register('prefecture')}
              aria-invalid={!!errors.prefecture}
              className={errors.prefecture ? 'border-red-500' : ''}
            />
            {errors.prefecture && (
              <p className="text-red-500 text-sm mt-1">{errors.prefecture.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">市区町村*</label>
            <Input
              {...register('city')}
              aria-invalid={!!errors.city}
              className={errors.city ? 'border-red-500' : ''}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">住所*</label>
          <Input
            {...register('addressLine1')}
            aria-invalid={!!errors.addressLine1}
            className={errors.addressLine1 ? 'border-red-500' : ''}
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-sm mt-1">{errors.addressLine1.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">住所2（任意）</label>
          <Input {...register('addressLine2')} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">建物名（任意）</label>
          <Input {...register('building')} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">電話番号*</label>
            <Input
              {...register('phone')}
              inputMode="tel"
              placeholder="000-0000-0000"
              aria-invalid={!!errors.phone}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">メールアドレス*</label>
            <Input
              {...register('email')}
              type="email"
              inputMode="email"
              aria-invalid={!!errors.email}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={clearData}>
            入力内容をクリア
          </Button>
          <Button type="submit">
            次へ進む
          </Button>
        </div>
      </form>
    </div>
    </>
  );
};
