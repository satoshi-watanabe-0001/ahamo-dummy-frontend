import React from 'react';
import { Badge } from '../ui/badge';
import { PaymentResult } from '../pages/PaymentResultPage';

interface PaymentStatusDisplayProps {
  result: PaymentResult;
}

export const PaymentStatusDisplay: React.FC<PaymentStatusDisplayProps> = ({ result }) => {
  const getStatusIcon = () => {
    switch (result.status) {
      case 'success':
        return (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'failure':
        return (
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'processing':
        return (
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (result.status) {
      case 'success':
        return <Badge variant="default" className="bg-green-600 text-white">決済完了</Badge>;
      case 'failure':
        return <Badge variant="destructive">決済失敗</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-600">処理中</Badge>;
      default:
        return null;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(timestamp);
  };

  const getPaymentMethodDisplay = (method?: string) => {
    switch (method) {
      case 'credit':
        return 'クレジットカード';
      case 'bank':
        return '銀行振込';
      case 'convenience':
        return 'コンビニ決済';
      default:
        return method || '不明';
    }
  };

  return (
    <div className="text-center">
      {getStatusIcon()}
      
      <div className="mb-6">
        {getStatusBadge()}
      </div>

      {result.status !== 'processing' && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium mb-4">決済詳細</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {result.transactionId && (
              <div>
                <span className="text-sm text-gray-600">取引ID</span>
                <p className="font-mono text-sm">{result.transactionId}</p>
              </div>
            )}
            
            {result.amount && (
              <div>
                <span className="text-sm text-gray-600">決済金額</span>
                <p className="font-semibold">{formatAmount(result.amount)}</p>
              </div>
            )}
            
            {result.paymentMethod && (
              <div>
                <span className="text-sm text-gray-600">決済方法</span>
                <p>{getPaymentMethodDisplay(result.paymentMethod)}</p>
              </div>
            )}
            
            {result.timestamp && (
              <div>
                <span className="text-sm text-gray-600">処理日時</span>
                <p className="text-sm">{formatTimestamp(result.timestamp)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
