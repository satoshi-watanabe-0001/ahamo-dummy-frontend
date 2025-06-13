export interface QualityCheckResult {
  isBlurry: boolean;
  hasGlare: boolean;
  isComplete: boolean;
  hasAdequateResolution: boolean;
  score: number;
  feedback: string[];
}

export interface QualityCheckOptions {
  blurThreshold?: number;
  glareThreshold?: number;
  minResolution?: { width: number; height: number };
  edgeThreshold?: number;
}

const DEFAULT_OPTIONS: Required<QualityCheckOptions> = {
  blurThreshold: 100,
  glareThreshold: 240,
  minResolution: { width: 800, height: 600 },
  edgeThreshold: 50
};

export const analyzeImageQuality = async (
  imageData: string,
  options: QualityCheckOptions = {}
): Promise<QualityCheckResult> => {
  return new Promise((resolve) => {
    try {
      const opts = { ...DEFAULT_OPTIONS, ...options };
      const img = new Image();
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            resolve({
              isBlurry: true,
              hasGlare: true,
              isComplete: false,
              hasAdequateResolution: false,
              score: 0,
              feedback: ['画像の解析に失敗しました']
            });
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageDataObj.data;

          const blurScore = calculateBlurScore(pixels, canvas.width, canvas.height);
          const glareScore = calculateGlareScore(pixels);
          const edgeScore = calculateEdgeScore(pixels, canvas.width, canvas.height);
          const resolutionCheck = checkResolution(canvas.width, canvas.height, opts.minResolution);

          const isBlurry = blurScore < opts.blurThreshold;
          const hasGlare = glareScore > opts.glareThreshold;
          const isComplete = edgeScore > opts.edgeThreshold;
          const hasAdequateResolution = resolutionCheck;

          const feedback: string[] = [];
          if (isBlurry) feedback.push('画像がぼやけています。カメラを安定させてください');
          if (hasGlare) feedback.push('反射が検出されました。照明を調整してください');
          if (!isComplete) feedback.push('書類全体が写るようにしてください');
          if (!hasAdequateResolution) feedback.push('解像度が不足しています。カメラを近づけてください');

          const score = calculateOverallScore(blurScore, glareScore, edgeScore, resolutionCheck);

          resolve({
            isBlurry,
            hasGlare,
            isComplete,
            hasAdequateResolution,
            score,
            feedback
          });
        } catch (error) {
          resolve({
            isBlurry: true,
            hasGlare: true,
            isComplete: false,
            hasAdequateResolution: false,
            score: 0,
            feedback: ['画像処理中にエラーが発生しました']
          });
        }
      };

      img.onerror = () => {
        resolve({
          isBlurry: true,
          hasGlare: true,
          isComplete: false,
          hasAdequateResolution: false,
          score: 0,
          feedback: ['画像の読み込みに失敗しました']
        });
      };

      img.src = imageData;
    } catch (error) {
      resolve({
        isBlurry: true,
        hasGlare: true,
        isComplete: false,
        hasAdequateResolution: false,
        score: 0,
        feedback: ['画像解析の初期化に失敗しました']
      });
    }
  });
};

const calculateBlurScore = (pixels: Uint8ClampedArray, width: number, height: number): number => {
  try {
    let sum = 0;
    let count = 0;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        
        if (idx + 6 >= pixels.length || (y + 1) * width * 4 + x * 4 + 2 >= pixels.length) {
          continue;
        }
        
        const current = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
        const right = (pixels[idx + 4] + pixels[idx + 5] + pixels[idx + 6]) / 3;
        const bottom = (pixels[(y + 1) * width * 4 + x * 4] + 
                       pixels[(y + 1) * width * 4 + x * 4 + 1] + 
                       pixels[(y + 1) * width * 4 + x * 4 + 2]) / 3;

        const gradientX = Math.abs(current - right);
        const gradientY = Math.abs(current - bottom);
        const gradient = Math.sqrt(gradientX * gradientX + gradientY * gradientY);

        sum += gradient;
        count++;
      }
    }

    return count > 0 ? sum / count : 0;
  } catch (error) {
    return 0;
  }
};

const calculateGlareScore = (pixels: Uint8ClampedArray): number => {
  try {
    let brightPixels = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 0; i < pixels.length; i += 4) {
      const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      if (brightness > 240) {
        brightPixels++;
      }
    }

    return (brightPixels / totalPixels) * 255;
  } catch (error) {
    return 0;
  }
};

const calculateEdgeScore = (pixels: Uint8ClampedArray, width: number, height: number): number => {
  try {
    let edgePixels = 0;
    const totalPixels = (width - 2) * (height - 2);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        
        if (idx + 6 >= pixels.length || 
            (y - 1) * width * 4 + x * 4 + 2 >= pixels.length ||
            (y + 1) * width * 4 + x * 4 + 2 >= pixels.length) {
          continue;
        }
        
        const current = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
        const neighbors = [
          (pixels[idx - 4] + pixels[idx - 3] + pixels[idx - 2]) / 3,
          (pixels[idx + 4] + pixels[idx + 5] + pixels[idx + 6]) / 3,
          (pixels[(y - 1) * width * 4 + x * 4] + pixels[(y - 1) * width * 4 + x * 4 + 1] + pixels[(y - 1) * width * 4 + x * 4 + 2]) / 3,
          (pixels[(y + 1) * width * 4 + x * 4] + pixels[(y + 1) * width * 4 + x * 4 + 1] + pixels[(y + 1) * width * 4 + x * 4 + 2]) / 3
        ];

        const maxDiff = Math.max(...neighbors.map(n => Math.abs(current - n)));
        if (maxDiff > 30) {
          edgePixels++;
        }
      }
    }

    return totalPixels > 0 ? (edgePixels / totalPixels) * 100 : 0;
  } catch (error) {
    return 0;
  }
};

const checkResolution = (width: number, height: number, minRes: { width: number; height: number }): boolean => {
  return width >= minRes.width && height >= minRes.height;
};

const calculateOverallScore = (
  blurScore: number,
  glareScore: number,
  edgeScore: number,
  hasAdequateResolution: boolean
): number => {
  try {
    let score = 0;
    
    score += Math.min(blurScore / 100, 1) * 30;
    score += Math.max(0, 1 - glareScore / 255) * 25;
    score += Math.min(edgeScore / 100, 1) * 25;
    score += hasAdequateResolution ? 20 : 0;
    
    return Math.round(Math.max(0, Math.min(100, score)));
  } catch (error) {
    return 0;
  }
};

export const getQualityFeedback = (result: QualityCheckResult): string => {
  if (result.score >= 80) return '品質良好';
  if (result.score >= 60) return '品質普通';
  if (result.score >= 40) return '品質やや不良';
  return '品質不良';
};
