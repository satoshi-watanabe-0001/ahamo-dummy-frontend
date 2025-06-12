import { useState } from 'react';
import { Button } from './button';
import { secureStorage } from '../../utils/secureStorage';

interface RestoreDialogProps {
  isOpen: boolean;
  onRestore: () => void;
  onStartFresh: () => void;
  onClose: () => void;
}

export const RestoreDialog = ({ isOpen, onRestore, onStartFresh, onClose }: RestoreDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  if (!isOpen) return null;

  const expirationTime = secureStorage.getExpirationTime();
  const remainingTime = secureStorage.getRemainingTime();
  
  const formatRemainingTime = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}時間${minutes}分`;
    }
    return `${minutes}分`;
  };

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      await onRestore();
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartFresh = async () => {
    setIsLoading(true);
    try {
      await onStartFresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              保存されたデータが見つかりました
            </h3>
            <p className="text-sm text-gray-600">
              前回の入力内容を復元しますか？
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">データ有効期限:</span>
            <span className="font-medium text-gray-900">
              {expirationTime?.toLocaleString('ja-JP')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600">残り時間:</span>
            <span className="font-medium text-blue-600">
              {formatRemainingTime(remainingTime)}
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleStartFresh}
            disabled={isLoading}
            className="flex-1"
          >
            最初から始める
          </Button>
          <Button
            onClick={handleRestore}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                復元中...
              </div>
            ) : (
              '続きから始める'
            )}
          </Button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={isLoading}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
