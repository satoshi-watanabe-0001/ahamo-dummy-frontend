import React from 'react';
import { PaymentStatusDisplay } from '../organisms/PaymentStatusDisplay';
import { PaymentErrorDetails } from '../molecules/PaymentErrorDetails';
import { PaymentRetryForm } from '../molecules/PaymentRetryForm';

export interface PaymentResult {
  status: 'success' | 'failure' | 'processing';
  transactionId?: string;
  amount?: number;
  paymentMethod?: string;
  timestamp?: Date;
  errorCode?: string;
  errorMessage?: string;
  errorType?: 'system' | 'user' | 'card_issuer';
}

interface PaymentResultPageProps {
  result: PaymentResult;
  onRetry?: (retryData: any) => void;
  onBackToHome?: () => void;
}

export const PaymentResultPage: React.FC<PaymentResultPageProps> = ({
  result,
  onRetry,
  onBackToHome
}) => {
  const renderContent = () => {
    switch (result.status) {
      case 'success':
        return (
          <div className="space-y-6">
            <PaymentStatusDisplay result={result} />
            <div className="flex justify-center">
              <button
                onClick={onBackToHome}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                ホームに戻る
              </button>
            </div>
          </div>
        );

      case 'failure':
        return (
          <div className="space-y-6">
            <PaymentStatusDisplay result={result} />
            <PaymentErrorDetails 
              errorCode={result.errorCode}
              errorMessage={result.errorMessage}
              errorType={result.errorType}
            />
            {onRetry && (
              <PaymentRetryForm 
                onRetry={onRetry}
                originalPaymentMethod={result.paymentMethod}
              />
            )}
          </div>
        );

      case 'processing':
        return (
          <div className="space-y-6">
            <PaymentStatusDisplay result={result} />
            <div className="text-center text-gray-600">
              <p>決済処理中です。しばらくお待ちください。</p>
              <p className="text-sm mt-2">この画面を閉じずにお待ちください。</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          {result.status === 'success' && '決済完了'}
          {result.status === 'failure' && '決済エラー'}
          {result.status === 'processing' && '決済処理中'}
        </h1>
      </div>
      
      {renderContent()}
    </div>
  );
};
