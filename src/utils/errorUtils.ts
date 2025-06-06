import { ApiError, ErrorSeverity } from './api';

export const getErrorSeverity = (error: ApiError): ErrorSeverity => {
  return error.severity || ErrorSeverity.WARNING;
};

export const getErrorMessage = (error: ApiError): string => {
  return error.message || 'エラーが発生しました';
};

export const getErrorResolution = (error: ApiError): string => {
  if (error.resolution) {
    return error.resolution;
  }
  
  switch (getErrorSeverity(error)) {
    case ErrorSeverity.CRITICAL:
      return 'しばらく時間をおいて再度お試しください';
    case ErrorSeverity.WARNING:
      return 'ページをリロードして再度お試しください';
    case ErrorSeverity.INFO:
      return '入力内容を確認してください';
    default:
      return 'ページをリロードして再度お試しください';
  }
};

export const isRetryableError = (error: ApiError): boolean => {
  if (error.status === 0) return true;
  if (error.status >= 500 && error.status < 600) return true;
  return false;
};

export const getErrorIcon = (severity: ErrorSeverity): string => {
  switch (severity) {
    case ErrorSeverity.CRITICAL:
      return '🚨';
    case ErrorSeverity.WARNING:
      return '⚠️';
    case ErrorSeverity.INFO:
      return 'ℹ️';
    default:
      return '⚠️';
  }
};
