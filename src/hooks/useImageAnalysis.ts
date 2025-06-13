import { useState, useEffect, useCallback, useRef } from 'react';
import { analyzeImageQuality, QualityCheckResult, QualityCheckOptions } from '../utils/imageQualityCheck';
import { useDebounce } from './useDebounce';

export interface UseImageAnalysisOptions extends QualityCheckOptions {
  enabled?: boolean;
  interval?: number;
  debounceMs?: number;
}

export const useImageAnalysis = (
  videoRef: React.RefObject<HTMLVideoElement>,
  options: UseImageAnalysisOptions = {}
) => {
  const {
    enabled = true,
    interval = 1000,
    debounceMs = 300,
    ...qualityOptions
  } = options;

  const [result, setResult] = useState<QualityCheckResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  const debouncedEnabled = useDebounce(enabled, debounceMs);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current) return null;

    const video = videoRef.current;
    if (video.readyState !== video.HAVE_ENOUGH_DATA) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, [videoRef]);

  const analyzeCurrentFrame = useCallback(async () => {
    if (!debouncedEnabled || isAnalyzing) return;

    const frameData = captureFrame();
    if (!frameData) return;

    setIsAnalyzing(true);
    try {
      const analysisResult = await analyzeImageQuality(frameData, qualityOptions);
      setResult(analysisResult);
    } catch (error) {
      console.error('Image analysis failed:', error);
      setResult({
        isBlurry: true,
        hasGlare: false,
        isComplete: false,
        hasAdequateResolution: false,
        score: 0,
        feedback: ['解析エラーが発生しました']
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [debouncedEnabled, isAnalyzing, captureFrame, qualityOptions]);

  const startAnalysis = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(analyzeCurrentFrame, interval);
  }, [analyzeCurrentFrame, interval]);

  const stopAnalysis = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const analyzeImage = useCallback(async (imageData: string): Promise<QualityCheckResult> => {
    return await analyzeImageQuality(imageData, qualityOptions);
  }, [qualityOptions]);

  useEffect(() => {
    if (debouncedEnabled) {
      startAnalysis();
    } else {
      stopAnalysis();
    }

    return () => {
      stopAnalysis();
    };
  }, [debouncedEnabled, startAnalysis, stopAnalysis]);

  useEffect(() => {
    return () => {
      stopAnalysis();
    };
  }, [stopAnalysis]);

  return {
    result,
    isAnalyzing,
    analyzeCurrentFrame,
    analyzeImage,
    startAnalysis,
    stopAnalysis
  };
};
