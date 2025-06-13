import { ApiResponse } from '../utils/api';

export interface FacialDetectionRequest {
  imageData: string;
  detectionType: 'liveness' | 'face_detection' | 'biometric_analysis';
  challengeType?: 'blink' | 'head_turn' | 'smile';
  qualityThreshold?: number;
}

export interface FacialDetectionResponse {
  detectionId: string;
  isLive: boolean;
  confidenceScore: number;
  faceDetected: boolean;
  qualityScore: number;
  biometricFeatures: {
    eyeBlinkDetected: boolean;
    microMovementDetected: boolean;
    headRotationDetected: boolean;
  };
  guidance: string[];
  nextChallenge: 'blink' | 'head_turn' | 'smile' | 'complete';
}

export interface FaceComparisonRequest {
  documentImage: string;
  selfieImage: string;
  similarityThreshold?: number;
}

export interface FaceComparisonResponse {
  comparisonId: string;
  isMatch: boolean;
  similarityScore: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  analysisDetails: {
    faceLandmarksMatch: boolean;
    facialGeometryMatch: boolean;
    ageConsistency: boolean;
  };
  verificationStatus: 'verified' | 'rejected' | 'manual_review';
}

export interface QualityCheckRequest {
  imageData: string;
  checkType: 'document' | 'selfie' | 'general';
  documentType?: 'drivers_license' | 'passport' | 'residence_card';
}

export interface QualityCheckResponse {
  checkId: string;
  overallScore: number;
  isAcceptable: boolean;
  qualityMetrics: {
    sharpnessScore: number;
    brightnessScore: number;
    contrastScore: number;
    glareDetected: boolean;
    blurDetected: boolean;
    resolutionAdequate: boolean;
  };
  improvementSuggestions: string[];
  retryRecommended: boolean;
}

class FaceRecognitionService {
  private baseUrl = '/v1/ekyc/session';

  async detectFacialFeatures(
    sessionId: string,
    request: FacialDetectionRequest
  ): Promise<ApiResponse<FacialDetectionResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/${sessionId}/facial-detection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`顔認識・生体検知エラー: ${response.status}`);
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        message: '顔認識・生体検知が完了しました',
      };
    } catch (error) {
      console.error('顔認識・生体検知エラー:', error);
      throw error;
    }
  }

  async compareFaces(
    sessionId: string,
    request: FaceComparisonRequest
  ): Promise<ApiResponse<FaceComparisonResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/${sessionId}/face-comparison`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`顔照合エラー: ${response.status}`);
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        message: '顔照合が完了しました',
      };
    } catch (error) {
      console.error('顔照合エラー:', error);
      throw error;
    }
  }

  async checkImageQuality(
    sessionId: string,
    request: QualityCheckRequest
  ): Promise<ApiResponse<QualityCheckResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/${sessionId}/quality-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`画像品質チェックエラー: ${response.status}`);
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        message: '画像品質チェックが完了しました',
      };
    } catch (error) {
      console.error('画像品質チェックエラー:', error);
      throw error;
    }
  }

  async cleanupFacialData(sessionId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/${sessionId}/cleanup`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`顔認識データクリーンアップエラー: ${response.status}`);
      }

      return {
        data: undefined,
        status: response.status,
        message: '顔認識データのクリーンアップが完了しました',
      };
    } catch (error) {
      console.error('顔認識データクリーンアップエラー:', error);
      throw error;
    }
  }

  encryptImageData(imageData: string): string {
    return btoa(imageData);
  }

  decryptImageData(encryptedData: string): string {
    try {
      return atob(encryptedData);
    } catch (error) {
      console.error('画像データ復号化エラー:', error);
      throw new Error('画像データの復号化に失敗しました');
    }
  }
}

export const faceRecognitionService = new FaceRecognitionService();
