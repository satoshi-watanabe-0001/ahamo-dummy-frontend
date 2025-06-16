import { useState, useCallback, useRef } from 'react';
import { 
  faceRecognitionService, 
  FacialDetectionRequest, 

  FaceComparisonRequest,
  FaceComparisonResponse 
} from '../services/faceRecognitionService';

export interface BiometricChallenge {
  type: 'blink' | 'head_turn' | 'smile';
  instruction: string;
  completed: boolean;
}

export interface LivenessDetectionState {
  isActive: boolean;
  currentChallenge: BiometricChallenge | null;
  completedChallenges: BiometricChallenge[];
  isComplete: boolean;
  confidenceScore: number;
  guidance: string[];
}

export const useFacialRecognition = (sessionId: string) => {
  const [livenessState, setLivenessState] = useState<LivenessDetectionState>({
    isActive: false,
    currentChallenge: null,
    completedChallenges: [],
    isComplete: false,
    confidenceScore: 0,
    guidance: [],
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const challengeTimeoutRef = useRef<NodeJS.Timeout>();

  const challenges: BiometricChallenge[] = [
    {
      type: 'blink',
      instruction: 'ゆっくりと瞬きをしてください',
      completed: false,
    },
    {
      type: 'head_turn',
      instruction: '頭をゆっくりと左右に動かしてください',
      completed: false,
    },
    {
      type: 'smile',
      instruction: '自然な笑顔を作ってください',
      completed: false,
    },
  ];

  const startLivenessDetection = useCallback(() => {
    setLivenessState({
      isActive: true,
      currentChallenge: challenges[0],
      completedChallenges: [],
      isComplete: false,
      confidenceScore: 0,
      guidance: [challenges[0].instruction],
    });
    setError(null);
  }, []);

  const performLivenessCheck = useCallback(async (imageData: string) => {
    if (!livenessState.currentChallenge || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const request: FacialDetectionRequest = {
        imageData: faceRecognitionService.encryptImageData(imageData),
        detectionType: 'liveness',
        challengeType: livenessState.currentChallenge.type,
        qualityThreshold: 80,
      };

      const response = await faceRecognitionService.detectFacialFeatures(sessionId, request);

      if (response.data) {
        const detectionResult = response.data;
        
        setLivenessState(prev => {
          const updatedCompletedChallenges = [...prev.completedChallenges];
          
          if (detectionResult.isLive && prev.currentChallenge) {
            updatedCompletedChallenges.push({
              ...prev.currentChallenge,
              completed: true,
            });
          }

          const nextChallengeIndex = updatedCompletedChallenges.length;
          const nextChallenge = nextChallengeIndex < challenges.length 
            ? challenges[nextChallengeIndex] 
            : null;

          const isComplete = detectionResult.nextChallenge === 'complete' || 
                           updatedCompletedChallenges.length >= challenges.length;

          return {
            ...prev,
            currentChallenge: nextChallenge,
            completedChallenges: updatedCompletedChallenges,
            isComplete,
            confidenceScore: detectionResult.confidenceScore,
            guidance: detectionResult.guidance,
            isActive: !isComplete,
          };
        });

        if (challengeTimeoutRef.current) {
          clearTimeout(challengeTimeoutRef.current);
        }

        if (detectionResult.nextChallenge !== 'complete') {
          challengeTimeoutRef.current = setTimeout(() => {
            setLivenessState(prev => ({
              ...prev,
              guidance: [...prev.guidance, 'チャレンジがタイムアウトしました。もう一度お試しください。'],
            }));
          }, 10000);
        }

      }
    } catch (error) {
      console.error('生体検知エラー:', error);
      setError('生体検知中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId, livenessState.currentChallenge, isProcessing]);

  const performFaceComparison = useCallback(async (
    documentImage: string, 
    selfieImage: string
  ): Promise<FaceComparisonResponse | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      const request: FaceComparisonRequest = {
        documentImage: faceRecognitionService.encryptImageData(documentImage),
        selfieImage: faceRecognitionService.encryptImageData(selfieImage),
        similarityThreshold: 80,
      };

      const response = await faceRecognitionService.compareFaces(sessionId, request);

      if (response.data) {
        return response.data;
      } else {
        setError('顔照合に失敗しました');
        return null;
      }
    } catch (error) {
      console.error('顔照合エラー:', error);
      setError('顔照合中にエラーが発生しました');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId]);

  const resetLivenessDetection = useCallback(() => {
    if (challengeTimeoutRef.current) {
      clearTimeout(challengeTimeoutRef.current);
    }
    
    setLivenessState({
      isActive: false,
      currentChallenge: null,
      completedChallenges: [],
      isComplete: false,
      confidenceScore: 0,
      guidance: [],
    });
    setError(null);
  }, []);

  const cleanupFacialData = useCallback(async () => {
    try {
      await faceRecognitionService.cleanupFacialData(sessionId);
    } catch (error) {
      console.error('顔認識データクリーンアップエラー:', error);
    }
  }, [sessionId]);

  return {
    livenessState,
    isProcessing,
    error,
    startLivenessDetection,
    performLivenessCheck,
    performFaceComparison,
    resetLivenessDetection,
    cleanupFacialData,
  };
};
