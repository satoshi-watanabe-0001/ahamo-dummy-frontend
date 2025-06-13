import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface PaymentRetryFormProps {
  onRetry: (retryData: any) => void;
  originalPaymentMethod?: string;
}

export const PaymentRetryForm: React.FC<PaymentRetryFormProps> = ({
  onRetry,
  originalPaymentMethod
}) => {
  const [selectedMethod, setSelectedMethod] = useState(originalPaymentMethod || 'credit');
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const paymentMethods = [
    { value: 'credit', label: 'クレジットカード', icon: '💳' },
    { value: 'bank', label: '銀行振込', icon: '🏦' },
    { value: 'convenience', label: 'コンビニ決済', icon: '🏪' }
  ];

  const handleRetry = async () => {
    setIsLoading(true);
    
    const retryData = {
      paymentMethod: selectedMethod,
      ...(selectedMethod === 'credit' && {
        cardNumber,
        expiryDate,
        cvv
      })
    };

    try {
      await onRetry(retryData);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (selectedMethod === 'credit') {
      return cardNumber.length >= 16 && expiryDate.length >= 5 && cvv.length >= 3;
    }
    return true;
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-blue-800 mb-4">決済を再試行</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-2">
            お支払い方法を選択
          </label>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <label
                key={method.value}
                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  checked={selectedMethod === method.value}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mr-3"
                />
                <span className="mr-2">{method.icon}</span>
                <span className="text-blue-800">{method.label}</span>
                {method.value === originalPaymentMethod && (
                  <span className="ml-auto text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded">
                    元の方法
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {selectedMethod === 'credit' && (
          <div className="space-y-4 p-4 bg-white rounded border border-blue-200">
            <h4 className="font-medium text-blue-800">カード情報</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カード番号
              </label>
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                maxLength={16}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  有効期限
                </label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  セキュリティコード
                </label>
                <Input
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'bank' && (
          <div className="p-4 bg-white rounded border border-blue-200">
            <p className="text-sm text-gray-600">
              銀行振込を選択されました。振込先情報は次の画面で表示されます。
            </p>
          </div>
        )}

        {selectedMethod === 'convenience' && (
          <div className="p-4 bg-white rounded border border-blue-200">
            <p className="text-sm text-gray-600">
              コンビニ決済を選択されました。お支払い番号は次の画面で表示されます。
            </p>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button
            onClick={handleRetry}
            disabled={!isFormValid() || isLoading}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                処理中...
              </>
            ) : (
              '決済を再試行'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
