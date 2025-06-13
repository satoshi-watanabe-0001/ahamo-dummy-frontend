import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { CameraOverlay } from './CameraOverlay';
import { useCamera } from '../../hooks/useCamera';
import { useImageAnalysis } from '../../hooks/useImageAnalysis';
import { cn } from '../../lib/utils';
import { toast } from '../../hooks/use-toast';

export interface CameraCaptureProps {
  documentType: 'license' | 'passport' | 'mynumber';
  onCapture: (imageData: string, qualityScore: number) => void;
  onError?: (error: string) => void;
  onFallbackToUpload?: () => void;
  className?: string;
  disabled?: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  documentType,
  onCapture,
  onError,
  onFallbackToUpload,
  className,
  disabled = false
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  const {
    isReady,
    hasPermission,
    error,
    devices,
    currentDeviceId,
    videoRef,
    startCamera,
    stopCamera,
    switchCamera,
    captureImage,
    checkCameraSupport
  } = useCamera({
    facingMode: 'environment',
    width: 1920,
    height: 1080
  });

  const {
    result: qualityResult,
    analyzeImage
  } = useImageAnalysis(videoRef, {
    enabled: isReady && !isCapturing,
    interval: 1000
  });

  useEffect(() => {
    if (!checkCameraSupport()) {
      onError?.('お使いのブラウザはカメラ機能をサポートしていません');
      onFallbackToUpload?.();
      return;
    }

    setShowPermissionPrompt(true);
  }, [checkCameraSupport, onError, onFallbackToUpload]);

  const handleStartCamera = async () => {
    setShowPermissionPrompt(false);
    try {
      await startCamera();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'カメラの起動に失敗しました';
      onError?.(errorMessage);
      toast({
        title: 'カメラエラー',
        description: errorMessage,
        severity: 'WARNING'
      });
    }
  };

  const handleCapture = async () => {
    if (!isReady || isCapturing) return;

    setIsCapturing(true);
    
    try {
      const imageData = captureImage();
      if (!imageData) {
        throw new Error('画像の取得に失敗しました');
      }

      const quality = await analyzeImage(imageData);
      
      if (quality.score < 40) {
        toast({
          title: '画質が不十分です',
          description: '品質を改善してから再度撮影してください',
          severity: 'WARNING'
        });
        setIsCapturing(false);
        return;
      }

      onCapture(imageData, quality.score);
      
      toast({
        title: '撮影完了',
        description: `品質スコア: ${quality.score}/100`,
        severity: 'INFO'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '撮影に失敗しました';
      onError?.(errorMessage);
      toast({
        title: '撮影エラー',
        description: errorMessage,
        severity: 'WARNING'
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSwitchCamera = async () => {
    if (devices.length <= 1) return;
    
    const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDevice = devices[nextIndex];
    
    try {
      await switchCamera(nextDevice.deviceId);
    } catch (err) {
      toast({
        title: 'カメラ切り替えエラー',
        description: 'カメラの切り替えに失敗しました',
        severity: 'WARNING'
      });
    }
  };

  const handleFallbackToUpload = () => {
    stopCamera();
    onFallbackToUpload?.();
  };

  if (showPermissionPrompt) {
    return (
      <div className={cn('relative bg-gray-100 rounded-lg overflow-hidden', className)}>
        <div className="aspect-video flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">カメラを使用して撮影</h3>
              <p className="text-sm text-gray-600 mt-1">
                書類を鮮明に撮影するためにカメラへのアクセスを許可してください
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleStartCamera} disabled={disabled}>
                カメラを起動
              </Button>
              <Button variant="outline" onClick={handleFallbackToUpload}>
                ファイルをアップロード
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || hasPermission === false) {
    return (
      <div className={cn('relative bg-gray-100 rounded-lg overflow-hidden', className)}>
        <div className="aspect-video flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">カメラアクセスエラー</h3>
              <p className="text-sm text-gray-600 mt-1">
                {error || 'カメラへのアクセスが拒否されました'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleStartCamera} disabled={disabled}>
                再試行
              </Button>
              <Button variant="outline" onClick={handleFallbackToUpload}>
                ファイルをアップロード
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative bg-black rounded-lg overflow-hidden', className)}>
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        <CameraOverlay
          documentType={documentType}
          isCapturing={isCapturing}
          qualityFeedback={qualityResult?.feedback || []}
        />

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
          <Button
            onClick={handleCapture}
            disabled={!isReady || isCapturing || disabled || (qualityResult?.score || 0) < 40}
            size="lg"
            className={cn(
              'w-16 h-16 rounded-full p-0 transition-all duration-200',
              isCapturing 
                ? 'bg-green-600 hover:bg-green-700 animate-pulse' 
                : 'bg-white hover:bg-gray-100 text-gray-900'
            )}
          >
            {isCapturing ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="w-8 h-8 bg-current rounded-full"></div>
            )}
          </Button>
        </div>

        {devices.length > 1 && (
          <div className="absolute top-4 left-4">
            <Button
              onClick={handleSwitchCamera}
              variant="ghost"
              size="sm"
              className="bg-black/50 text-white hover:bg-black/70"
              disabled={!isReady || isCapturing}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </Button>
          </div>
        )}

        <div className="absolute top-4 right-4">
          <Button
            onClick={handleFallbackToUpload}
            variant="ghost"
            size="sm"
            className="bg-black/50 text-white hover:bg-black/70"
          >
            ファイル選択
          </Button>
        </div>
      </div>
    </div>
  );
};
