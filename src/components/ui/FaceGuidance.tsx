import React from 'react';
import { cn } from '../../lib/utils';

export interface FaceGuidanceProps {
  isActive: boolean;
  currentChallenge?: 'blink' | 'head_turn' | 'smile' | null;
  guidance: string[];
  confidenceScore: number;
  isProcessing: boolean;
  className?: string;
}

const CHALLENGE_INSTRUCTIONS = {
  blink: {
    title: '瞬きチャレンジ',
    icon: '👁️',
    description: 'ゆっくりと瞬きをしてください',
    tips: ['自然な瞬きを心がけてください', 'カメラを正面から見てください']
  },
  head_turn: {
    title: '頭部回転チャレンジ',
    icon: '↔️',
    description: '頭をゆっくりと左右に動かしてください',
    tips: ['ゆっくりとした動作を心がけてください', '大きく動かしすぎないでください']
  },
  smile: {
    title: '笑顔チャレンジ',
    icon: '😊',
    description: '自然な笑顔を作ってください',
    tips: ['自然な表情を心がけてください', '口角を軽く上げてください']
  }
};

export const FaceGuidance: React.FC<FaceGuidanceProps> = ({
  isActive,
  currentChallenge,
  guidance,
  confidenceScore,
  isProcessing,
  className
}) => {
  const challengeInfo = currentChallenge ? CHALLENGE_INSTRUCTIONS[currentChallenge] : null;

  if (!isActive) {
    return null;
  }

  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      <div className="relative w-full h-full flex flex-col">
        {/* 顔位置ガイド */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            {/* 顔枠 */}
            <div 
              className={cn(
                'w-64 h-80 border-4 border-dashed rounded-full transition-all duration-300',
                isProcessing ? 'border-blue-400 animate-pulse' : 'border-white',
                confidenceScore > 80 ? 'border-green-400' : 
                confidenceScore > 60 ? 'border-yellow-400' : 'border-red-400'
              )}
            />
            
            {/* 信頼度スコア */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                信頼度: {confidenceScore.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* チャレンジ情報 */}
        {challengeInfo && (
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-black bg-opacity-70 text-white p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{challengeInfo.icon}</span>
                <h3 className="text-lg font-medium">{challengeInfo.title}</h3>
              </div>
              <p className="text-base mb-3">{challengeInfo.description}</p>
              <div className="space-y-1">
                {challengeInfo.tips.map((tip, index) => (
                  <p key={index} className="text-sm text-gray-300">• {tip}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ガイダンスメッセージ */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black bg-opacity-70 text-white p-4 rounded-lg max-h-32 overflow-y-auto">
            {guidance.length > 0 ? (
              <div className="space-y-2">
                {guidance.map((message, index) => (
                  <p key={index} className="text-sm">
                    {message}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-300">
                カメラに向かって正面を向いてください
              </p>
            )}
          </div>
        </div>

        {/* 処理中インジケーター */}
        {isProcessing && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">解析中...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
