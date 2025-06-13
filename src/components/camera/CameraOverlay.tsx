import * as React from 'react';
import { cn } from '../../lib/utils';

export interface CameraOverlayProps {
  documentType: 'license' | 'passport' | 'mynumber';
  isCapturing?: boolean;
  qualityFeedback?: string[];
  className?: string;
}

const DOCUMENT_SHAPES = {
  license: {
    width: '85%',
    height: '60%',
    borderRadius: '8px',
    aspectRatio: '1.6'
  },
  passport: {
    width: '70%',
    height: '85%',
    borderRadius: '4px',
    aspectRatio: '0.7'
  },
  mynumber: {
    width: '85%',
    height: '60%',
    borderRadius: '8px',
    aspectRatio: '1.6'
  }
};

const DOCUMENT_LABELS = {
  license: '運転免許証',
  passport: 'パスポート',
  mynumber: 'マイナンバーカード'
};

const GUIDANCE_MESSAGES = {
  license: [
    '免許証を枠内に合わせてください',
    '文字がはっきり見えるようにしてください',
    '反射しないよう角度を調整してください'
  ],
  passport: [
    'パスポートを縦向きで枠内に合わせてください',
    '顔写真と文字が鮮明に見えるようにしてください',
    '影や反射がないことを確認してください'
  ],
  mynumber: [
    'マイナンバーカードを枠内に合わせてください',
    '番号と文字がはっきり読めるようにしてください',
    '光の反射を避けてください'
  ]
};

export const CameraOverlay: React.FC<CameraOverlayProps> = ({
  documentType,
  isCapturing = false,
  qualityFeedback = [],
  className
}) => {
  const shape = DOCUMENT_SHAPES[documentType];
  const label = DOCUMENT_LABELS[documentType];
  const guidance = GUIDANCE_MESSAGES[documentType];

  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className={cn(
            'relative border-2 border-dashed transition-all duration-300',
            isCapturing 
              ? 'border-green-400 shadow-lg shadow-green-400/50' 
              : qualityFeedback.length > 0
                ? 'border-red-400 shadow-lg shadow-red-400/50'
                : 'border-white shadow-lg shadow-black/50'
          )}
          style={{
            width: shape.width,
            height: shape.height,
            borderRadius: shape.borderRadius,
            aspectRatio: shape.aspectRatio
          }}
        >
          <div className="absolute -top-8 left-0 right-0 text-center">
            <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {label}
            </span>
          </div>

          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white"></div>

          {isCapturing && (
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded" 
                 style={{ borderRadius: shape.borderRadius }}>
            </div>
          )}
        </div>

        <div className="absolute bottom-20 left-4 right-4">
          <div className="bg-black/70 rounded-lg p-4 text-white">
            {qualityFeedback.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">改善が必要です</span>
                </div>
                <ul className="text-xs space-y-1">
                  {qualityFeedback.map((feedback, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      <span>{feedback}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium">撮影準備完了</span>
                </div>
                <ul className="text-xs space-y-1">
                  {guidance.map((message, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>{message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <div className="bg-black/70 rounded-lg px-3 py-2 text-white text-xs">
            <div className="flex items-center space-x-2">
              <div className={cn(
                'w-2 h-2 rounded-full',
                qualityFeedback.length === 0 ? 'bg-green-400' : 'bg-red-400'
              )}></div>
              <span>
                {qualityFeedback.length === 0 ? '品質良好' : '品質要改善'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
