import { useState, useEffect } from 'react';
import { Button } from './button';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SaveStatusProps {
  status: SaveStatus;
  onManualSave?: () => void;
  lastSavedTime?: Date | null;
  className?: string;
}

export const SaveStatus = ({ status, onManualSave, lastSavedTime, className }: SaveStatusProps) => {
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  useEffect(() => {
    if (status === 'saved') {
      setShowSavedMessage(true);
      const timer = setTimeout(() => {
        setShowSavedMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const formatLastSavedTime = (time: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) {
      return 'たった今';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分前`;
    } else {
      return time.toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'saving':
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        );
      case 'saved':
        return (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        );
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'saving':
        return '保存中...';
      case 'saved':
        return showSavedMessage ? '保存しました' : '自動保存済み';
      case 'error':
        return '保存エラー';
      default:
        return '未保存';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'saving':
        return 'text-blue-600';
      case 'saved':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg border ${className}`}>
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          {lastSavedTime && status !== 'saving' && (
            <span className="text-xs text-gray-500">
              最終保存: {formatLastSavedTime(lastSavedTime)}
            </span>
          )}
        </div>
      </div>

      {onManualSave && (
        <Button
          variant="outline"
          size="sm"
          onClick={onManualSave}
          disabled={status === 'saving'}
          className="ml-4"
        >
          {status === 'saving' ? '保存中...' : '手動保存'}
        </Button>
      )}
    </div>
  );
};
