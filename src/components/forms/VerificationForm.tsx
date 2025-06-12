import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ProgressIndicator } from '../ui/progress-indicator';
import { SaveStatus } from '../ui/save-status';
import { RestoreDialog } from '../ui/restore-dialog';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useSessionRestore } from '../../hooks/useSessionRestore';
import { toast } from '../../hooks/use-toast';

export interface VerificationFormData {
  documentType: 'license' | 'passport' | 'mynumber';
  documentNumber: string;
  documentImage?: File;
  selfieImage?: File;
  verificationCode?: string;
  isVerified: boolean;
}

interface VerificationFormProps {
  onSubmit: (data: VerificationFormData) => void;
  onSave?: (data: VerificationFormData) => void;
  onBack?: () => void;
}

const DOCUMENT_TYPES = [
  { value: 'license', label: '運転免許証' },
  { value: 'passport', label: 'パスポート' },
  { value: 'mynumber', label: 'マイナンバーカード' }
];

export const VerificationForm = ({ onSubmit, onSave, onBack }: VerificationFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'document' | 'selfie' | 'code' | 'complete'>('document');

  const {
    saveStatus,
    lastSavedTime,
    updateFormData,
    manualSave,
    clearData,
    loadData
  } = useFormPersistence({
    formId: 'verification',
    onSave,
    onRestore: (data) => {
      setValue('documentType', data.documentType || 'license');
      setValue('documentNumber', data.documentNumber || '');
      setValue('verificationCode', data.verificationCode || '');
      setValue('isVerified', data.isVerified || false);
      if (data.isVerified) {
        setVerificationStep('complete');
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
      setValue('documentType', data.documentType || 'license');
      setValue('documentNumber', data.documentNumber || '');
      setValue('verificationCode', data.verificationCode || '');
      setValue('isVerified', data.isVerified || false);
      toast({
        title: 'データを復元しました',
        description: '本人確認の内容を復元しました',
        severity: 'INFO'
      });
    },
    onStartFresh: () => {
      reset();
      setVerificationStep('document');
      toast({
        title: '新規作成',
        description: '最初から本人確認を開始します',
        severity: 'INFO'
      });
    }
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<VerificationFormData>({
    defaultValues: loadData() || {
      documentType: 'license',
      documentNumber: '',
      verificationCode: '',
      isVerified: false
    }
  });

  const documentType = watch('documentType');
  const documentNumber = watch('documentNumber');
  const verificationCode = watch('verificationCode');
  const isVerified = watch('isVerified');

  useEffect(() => {
    const subscription = watch((data) => {
      updateFormData(data);
      onSave?.(data as VerificationFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onSave, updateFormData]);

  const handleFormSubmit = (data: VerificationFormData) => {
    if (!data.isVerified) {
      toast({
        title: '本人確認が未完了です',
        description: '本人確認を完了してから次に進んでください',
        severity: 'WARNING'
      });
      return;
    }
    clearData();
    onSubmit(data);
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setValue('documentImage', file);
      setVerificationStep('selfie');
      toast({
        title: '書類アップロード完了',
        description: '次に自撮り写真をアップロードしてください',
        severity: 'INFO'
      });
    } catch (error) {
      toast({
        title: 'アップロードエラー',
        description: '書類のアップロードに失敗しました',
        severity: 'WARNING'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelfieUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setValue('selfieImage', file);
      setVerificationStep('code');
      toast({
        title: '自撮り写真アップロード完了',
        description: '認証コードを入力してください',
        severity: 'INFO'
      });
    } catch (error) {
      toast({
        title: 'アップロードエラー',
        description: '自撮り写真のアップロードに失敗しました',
        severity: 'WARNING'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerificationCodeSubmit = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: '認証コードエラー',
        description: '6桁の認証コードを入力してください',
        severity: 'WARNING'
      });
      return;
    }

    setIsUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setValue('isVerified', true);
      setVerificationStep('complete');
      toast({
        title: '本人確認完了',
        description: '本人確認が正常に完了しました',
        severity: 'INFO'
      });
    } catch (error) {
      toast({
        title: '認証エラー',
        description: '認証コードが正しくありません',
        severity: 'WARNING'
      });
    } finally {
      setIsUploading(false);
    }
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
          currentStep={3}
          totalSteps={5}
          steps={['個人情報', 'プラン選択', '本人確認', '決済', '完了']}
          showCompletionStatus={true}
          completedSteps={['personal-info', 'plan-selection']}
        />
        
        <SaveStatus
          status={saveStatus}
          onManualSave={manualSave}
          lastSavedTime={lastSavedTime}
          className="mb-6"
        />
      
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">本人確認書類</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">書類の種類</label>
                <select
                  {...register('documentType')}
                  className="w-full p-3 border rounded-lg"
                >
                  {DOCUMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">書類番号</label>
                <Input
                  {...register('documentNumber')}
                  placeholder="書類に記載されている番号を入力"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <div className="mb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                    verificationStep === 'document' ? 'bg-blue-100 text-blue-600' :
                    verificationStep !== 'document' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {verificationStep !== 'document' ? '✓' : '1'}
                  </div>
                  <h4 className="font-medium">書類写真のアップロード</h4>
                  <p className="text-sm text-gray-600">本人確認書類の写真をアップロードしてください</p>
                </div>
                
                {verificationStep === 'document' && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDocumentUpload}
                      className="hidden"
                      id="document-upload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="document-upload"
                      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isUploading ? 'アップロード中...' : '写真を選択'}
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <div className="mb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                    verificationStep === 'selfie' ? 'bg-blue-100 text-blue-600' :
                    ['code', 'complete'].includes(verificationStep) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {['code', 'complete'].includes(verificationStep) ? '✓' : '2'}
                  </div>
                  <h4 className="font-medium">自撮り写真のアップロード</h4>
                  <p className="text-sm text-gray-600">本人確認のため自撮り写真をアップロードしてください</p>
                </div>
                
                {verificationStep === 'selfie' && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSelfieUpload}
                      className="hidden"
                      id="selfie-upload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="selfie-upload"
                      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isUploading ? 'アップロード中...' : '自撮り写真を選択'}
                    </label>
                  </div>
                )}
              </div>
            </div>

            {verificationStep === 'code' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      3
                    </div>
                    <h4 className="font-medium">認証コード入力</h4>
                    <p className="text-sm text-gray-600">SMSで送信された6桁の認証コードを入力してください</p>
                  </div>
                  
                  <div className="max-w-xs mx-auto">
                    <Input
                      {...register('verificationCode')}
                      placeholder="123456"
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                    <Button
                      type="button"
                      onClick={handleVerificationCodeSubmit}
                      disabled={isUploading || !verificationCode || verificationCode.length !== 6}
                      className="w-full mt-3"
                    >
                      {isUploading ? '認証中...' : '認証する'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {verificationStep === 'complete' && (
              <div className="border-2 border-green-300 bg-green-50 rounded-lg p-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                    ✓
                  </div>
                  <h4 className="font-medium text-green-800">本人確認完了</h4>
                  <p className="text-sm text-green-600">本人確認が正常に完了しました</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              戻る
            </Button>
            <div className="space-x-3">
              <Button type="button" variant="outline" onClick={clearData}>
                入力内容をクリア
              </Button>
              <Button type="submit" disabled={!isVerified}>
                次へ進む
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
