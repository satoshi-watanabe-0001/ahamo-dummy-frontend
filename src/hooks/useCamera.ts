import { useState, useEffect, useCallback, useRef } from 'react';

export interface CameraState {
  isActive: boolean;
  isReady: boolean;
  hasPermission: boolean | null;
  error: string | null;
  stream: MediaStream | null;
  devices: MediaDeviceInfo[];
  currentDeviceId: string | null;
}

export interface UseCameraOptions {
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
}

export const useCamera = (options: UseCameraOptions = {}) => {
  const [state, setState] = useState<CameraState>({
    isActive: false,
    isReady: false,
    hasPermission: null,
    error: null,
    stream: null,
    devices: [],
    currentDeviceId: null,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setState(prev => ({ ...prev, devices: videoDevices }));
      return videoDevices;
    } catch (error) {
      console.error('Failed to enumerate devices:', error);
      return [];
    }
  }, []);

  const startCamera = useCallback(async (deviceId?: string) => {
    try {
      setState(prev => ({ ...prev, error: null, isActive: true }));

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: options.facingMode || 'environment',
          width: { ideal: options.width || 1920 },
          height: { ideal: options.height || 1080 },
          ...(deviceId && { deviceId: { exact: deviceId } })
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setState(prev => ({
        ...prev,
        stream,
        hasPermission: true,
        isReady: true,
        isActive: true,
        currentDeviceId: deviceId || null,
        error: null
      }));

      await getDevices();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'カメラの起動に失敗しました';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        hasPermission: false,
        isActive: false,
        isReady: false
      }));
    }
  }, [options.facingMode, options.width, options.height, getDevices]);

  const stopCamera = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState(prev => ({
      ...prev,
      stream: null,
      isActive: false,
      isReady: false
    }));
  }, [state.stream]);

  const switchCamera = useCallback(async (deviceId: string) => {
    stopCamera();
    await startCamera(deviceId);
  }, [stopCamera, startCamera]);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !state.isReady) return null;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  }, [state.isReady]);

  const checkCameraSupport = useCallback(() => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    ...state,
    videoRef,
    startCamera,
    stopCamera,
    switchCamera,
    captureImage,
    checkCameraSupport,
    getDevices
  };
};
