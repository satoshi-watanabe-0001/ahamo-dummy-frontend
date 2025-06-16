import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ProgressIndicator } from '../ui/progress-indicator';
import { SaveStatus } from '../ui/save-status';
import { RestoreDialog } from '../ui/restore-dialog';
import { CameraCapture } from '../camera/CameraCapture';
import { FaceGuidance } from '../ui/FaceGuidance';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useSessionRestore } from '../../hooks/useSessionRestore';
import { useFacialRecognition } from '../../hooks/useFacialRecognition';
import { toast } from '../../hooks/use-toast';

export interface VerificationFormData {
  documentType: 'license' | 'passport' | 'mynumber';
  documentNumber: string;
  documentImage?: File;
  documentImageData?: string;
  documentImageQuality?: number;
  selfieImage?: File;
  selfieImageData?: string;
  selfieImageQuality?: number;
  verificationCode?: string;
  isVerified: boolean;
  captureMethod: 'camera' | 'upload';
  biometricVerified?: boolean;
  faceComparisonScore?: number;
  livenessScore?: number;
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
  const [verificationStep, setVerificationStep] = useState<'document' | 'selfie' | 'biometric' | 'code' | 'complete'>('document');
  const [useCameraForDocument, setUseCameraForDocument] = useState(true);
  const [useCameraForSelfie, setUseCameraForSelfie] = useState(true);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const { register, handleSubmit, setValue, watch, reset } = useForm<VerificationFormData>({
    defaultValues: {
      documentType: 'license',
      documentNumber: '',
      verificationCode: '',
      isVerified: false,
      captureMethod: 'camera',
      biometricVerified: false,
      faceComparisonScore: 0,
      livenessScore: 0
    }
  });

  const {
    livenessState,
    isProcessing: isBiometricProcessing,
    error: biometricError,
    startLivenessDetection,
    performLivenessCheck,
    performFaceComparison,
    resetLivenessDetection,
    cleanupFacialData
  } = useFacialRecognition(sessionId);

  const {
    saveStatus,
    lastSavedTime,
    updateFormData,
    manualSave,
    clearData
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




  const verificationCode = watch('verificationCode');
  const isVerified = watch('isVerified');
  const documentType = watch('documentType');

  useEffect(() => {
    const subscription = watch((data) => {
      if (data && Object.keys(data).length > 0) {
        updateFormData(data);
        onSave?.(data as VerificationFormData);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

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
      setValue('captureMethod', 'upload');
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


  const handleDocumentCapture = (imageData: string, qualityScore: number) => {
    setValue('documentImageData', imageData);
    setValue('documentImageQuality', qualityScore);
    setValue('captureMethod', 'camera');
    setVerificationStep('selfie');
    toast({
      title: '書類撮影完了',
      description: `品質スコア: ${qualityScore}/100`,
      severity: 'INFO'
    });
  };

  const handleSelfieCapture = (imageData: string, qualityScore: number) => {
    setValue('selfieImageData', imageData);
    setValue('selfieImageQuality', qualityScore);
    setVerificationStep('biometric');
    toast({
      title: '自撮り写真撮影完了',
      description: `品質スコア: ${qualityScore}/100 - 生体認証を開始します`,
      severity: 'INFO'
    });
    
    setTimeout(() => {
      startLivenessDetection();
    }, 1000);
  };

  const handleSelfieUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setValue('selfieImage', file);
      setVerificationStep('biometric');
      toast({
        title: '自撮り写真アップロード完了',
        description: '生体認証を開始します',
        severity: 'INFO'
      });
      
      setTimeout(() => {
        startLivenessDetection();
      }, 1000);
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



  const handleBiometricComplete = async () => {
    if (!livenessState.isComplete) {
      toast({
        title: '生体認証未完了',
        description: 'すべての生体認証チャレンジを完了してください',
        severity: 'WARNING'
      });
      return;
    }

    setIsUploading(true);
    try {
      const documentImageData = watch('documentImageData');
      const selfieImageData = watch('selfieImageData');
      
      if (documentImageData && selfieImageData) {
        const comparisonResult = await performFaceComparison(documentImageData, selfieImageData);
        
        if (comparisonResult && comparisonResult.isMatch) {
          setValue('biometricVerified', true);
          setValue('faceComparisonScore', comparisonResult.similarityScore);
          setValue('livenessScore', livenessState.confidenceScore);
          setVerificationStep('code');
          
          toast({
            title: '生体認証完了',
            description: `顔照合成功 (類似度: ${comparisonResult.similarityScore.toFixed(1)}%)`,
            severity: 'INFO'
          });
        } else {
          toast({
            title: '顔照合失敗',
            description: '身分証明書の写真と自撮り写真が一致しません',
            severity: 'WARNING'
          });
          resetLivenessDetection();
          setVerificationStep('selfie');
        }
      }
    } catch (error) {
      toast({
        title: '生体認証エラー',
        description: '生体認証中にエラーが発生しました',
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
      
      await cleanupFacialData();
      
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
          currentStep={6}
          totalSteps={10}
          steps={['契約タイプ', '利用状況', 'プラン選択', '端末選択', '料金確認', '個人情報', '本人確認', '決済', '契約確認', '完了']}
          showCompletionStatus={true}
          completedSteps={['contract-type', 'usage-profile', 'plan-selection', 'device-selection', 'pricing-confirmation', 'personal-info']}
        />
        
        <SaveStatus
          status={saveStatus}
          onManualSave={manualSave}
          lastSavedTime={lastSavedTime || undefined}
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
                    ['selfie', 'code', 'complete'].includes(verificationStep) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {verificationStep !== 'document' ? '✓' : '1'}
                  </div>
                  <h4 className="font-medium">書類写真の撮影・アップロード</h4>
                  <p className="text-sm text-gray-600">本人確認書類の写真を撮影またはアップロードしてください</p>
                </div>
                
                {verificationStep === 'document' && (
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-2">
                      <Button
                        type="button"
                        variant={useCameraForDocument ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUseCameraForDocument(true)}
                      >
                        カメラ撮影
                      </Button>
                      <Button
                        type="button"
                        variant={!useCameraForDocument ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUseCameraForDocument(false)}
                      >
                        ファイル選択
                      </Button>
                    </div>
                    
                    {useCameraForDocument ? (
                      <CameraCapture
                        documentType={documentType}
                        onCapture={handleDocumentCapture}
                        onError={(error: string) => {
                          toast({
                            title: 'カメラエラー',
                            description: error,
                            severity: 'WARNING'
                          });
                        }}
                        onFallbackToUpload={() => setUseCameraForDocument(false)}
                        className="w-full max-w-md mx-auto"
                      />
                    ) : (
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
                  <h4 className="font-medium">自撮り写真の撮影・アップロード</h4>
                  <p className="text-sm text-gray-600">本人確認のため自撮り写真を撮影またはアップロードしてください</p>
                </div>
                
                {verificationStep === 'selfie' && (
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-2">
                      <Button
                        type="button"
                        variant={useCameraForSelfie ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUseCameraForSelfie(true)}
                      >
                        カメラ撮影
                      </Button>
                      <Button
                        type="button"
                        variant={!useCameraForSelfie ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUseCameraForSelfie(false)}
                      >
                        ファイル選択
                      </Button>
                    </div>
                    
                    {useCameraForSelfie ? (
                      <div className="relative">
                        <CameraCapture
                          documentType="license"
                          onCapture={handleSelfieCapture}
                          onError={(error: string) => {
                            toast({
                              title: 'カメラエラー',
                              description: error,
                              severity: 'WARNING'
                            });
                          }}
                          onFallbackToUpload={() => setUseCameraForSelfie(false)}
                          className="w-full max-w-md mx-auto"
                        />
                      </div>
                    ) : (
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
                )}
              </div>
            </div>

            {verificationStep === 'biometric' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <div className="mb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                      livenessState.isComplete ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {livenessState.isComplete ? '✓' : '3'}
                    </div>
                    <h4 className="font-medium">生体認証</h4>
                    <p className="text-sm text-gray-600">なりすまし防止のため生体認証を行います</p>
                  </div>
                  
                  {livenessState.isActive && (
                    <div className="space-y-4">
                      <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3', maxWidth: '400px', margin: '0 auto' }}>
                        <CameraCapture
                          documentType="license"
                          onCapture={(imageData) => {
                            if (livenessState.currentChallenge) {
                              performLivenessCheck(imageData);
                            }
                          }}
                          onError={(error: string) => {
                            toast({
                              title: '生体認証エラー',
                              description: error,
                              severity: 'WARNING'
                            });
                          }}
                          className="w-full h-full"
                        />
                        <FaceGuidance
                          isActive={livenessState.isActive}
                          currentChallenge={livenessState.currentChallenge?.type}
                          guidance={livenessState.guidance}
                          confidenceScore={livenessState.confidenceScore}
                          isProcessing={isBiometricProcessing}
                        />
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p>完了したチャレンジ: {livenessState.completedChallenges.length}/3</p>
                        {livenessState.currentChallenge && (
                          <p className="font-medium text-blue-600 mt-2">
                            {livenessState.currentChallenge.instruction}
                          </p>
                        )}
                      </div>
                      
                      {biometricError && (
                        <div className="text-red-600 text-sm">
                          エラー: {biometricError}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {livenessState.isComplete && (
                    <div className="space-y-4">
                      <div className="text-green-600">
                        <p className="font-medium">生体認証完了</p>
                        <p className="text-sm">信頼度スコア: {livenessState.confidenceScore.toFixed(1)}%</p>
                      </div>
                      <Button
                        type="button"
                        onClick={handleBiometricComplete}
                        disabled={isUploading}
                        className="w-full"
                      >
                        {isUploading ? '顔照合中...' : '顔照合を実行'}
                      </Button>
                    </div>
                  )}
                  
                  {!livenessState.isActive && !livenessState.isComplete && (
                    <Button
                      type="button"
                      onClick={startLivenessDetection}
                      className="w-full"
                    >
                      生体認証を開始
                    </Button>
                  )}
                </div>
              </div>
            )}

            {verificationStep === 'code' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      4
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
