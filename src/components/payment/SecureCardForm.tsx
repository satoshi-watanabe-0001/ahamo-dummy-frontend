import React, { useState } from 'react';
import { encryptionUtils } from '../../utils/encryptionUtils';
import { usePaymentSecurity } from '../../hooks/usePaymentSecurity';

export interface SecureCardFormProps {
  onTokenReceived: (token: string, maskedCard: string) => void;
  onError: (error: string) => void;
}

interface CardData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolderName: string;
}

export const SecureCardForm = ({ onTokenReceived, onError }: {
  onTokenReceived: (token: string, maskedCard: string) => void;
  onError: (error: string) => void;
}) => {
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardHolderName: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { validateCardData } = usePaymentSecurity();

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts: string[] = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ').trim();
  };

  const validateForm = (): boolean => {
    return validateCardData(cardData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const encryptedData = encryptionUtils.encrypt(cardData);
      
      const response = await fetch('/api/v1/payments/tokenize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedCardData: encryptedData })
      });
      
      const result = await response.json();
      
      if (result.success) {
        onTokenReceived(result.token, result.maskedCardNumber);
        setCardData({
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          cardHolderName: ''
        });
        setErrors({});
      } else {
        onError(result.errorMessage || 'カード情報の処理に失敗しました');
      }
    } catch (error) {
      onError('ネットワークエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CardData, value: string) => {
    if (field === 'cardNumber') {
      value = formatCardNumber(value);
    }
    
    setCardData((prev) => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: `${i + 1}月`
  }));

  return (
    <form onSubmit={handleSubmit} className="secure-card-form space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          カード番号 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={cardData.cardNumber}
          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
          className={`w-full p-3 border rounded-md ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          disabled={isLoading}
        />
        {errors.cardNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            有効期限（月） <span className="text-red-500">*</span>
          </label>
          <select
            value={cardData.expiryMonth}
            onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
            className={`w-full p-3 border rounded-md ${errors.expiryMonth ? 'border-red-500' : 'border-gray-300'}`}
            disabled={isLoading}
          >
            <option value="">月を選択</option>
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          {errors.expiryMonth && (
            <p className="text-red-500 text-sm mt-1">{errors.expiryMonth}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            有効期限（年） <span className="text-red-500">*</span>
          </label>
          <select
            value={cardData.expiryYear}
            onChange={(e) => handleInputChange('expiryYear', e.target.value)}
            className={`w-full p-3 border rounded-md ${errors.expiryYear ? 'border-red-500' : 'border-gray-300'}`}
            disabled={isLoading}
          >
            <option value="">年を選択</option>
            {years.map(year => (
              <option key={year} value={year.toString()}>
                {year}年
              </option>
            ))}
          </select>
          {errors.expiryYear && (
            <p className="text-red-500 text-sm mt-1">{errors.expiryYear}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          セキュリティコード <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={cardData.cvv}
          onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
          className={`w-full p-3 border rounded-md ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="123"
          maxLength={4}
          disabled={isLoading}
        />
        {errors.cvv && (
          <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          カード裏面の3桁または4桁の数字
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          カード名義人名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={cardData.cardHolderName}
          onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
          className={`w-full p-3 border rounded-md ${errors.cardHolderName ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="TARO YAMADA"
          disabled={isLoading}
        />
        {errors.cardHolderName && (
          <p className="text-red-500 text-sm mt-1">{errors.cardHolderName}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          カードに記載されている通りに入力してください（英字）
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-md font-medium ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isLoading ? 'トークン化中...' : 'カード情報を安全に保存'}
      </button>
    </form>
  );
};
