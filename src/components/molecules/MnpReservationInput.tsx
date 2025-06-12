import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';
import { MnpInputProps, MnpValidationState, MnpCarrier } from '../../types/mnp';
import { useDebounce } from '../../hooks/useDebounce';

const CARRIERS: Record<string, MnpCarrier> = {
  DOCOMO: {
    code: 'DOCOMO',
    name: 'NTTドコモ',
    logo: '🟢',
    color: 'text-green-600'
  },
  AU: {
    code: 'AU',
    name: 'au',
    logo: '🟠',
    color: 'text-orange-600'
  },
  SOFTBANK: {
    code: 'SOFTBANK',
    name: 'SoftBank',
    logo: '⚪',
    color: 'text-gray-600'
  },
  RAKUTEN: {
    code: 'RAKUTEN',
    name: '楽天モバイル',
    logo: '🔴',
    color: 'text-red-600'
  }
};

export const MnpReservationInput: React.FC<MnpInputProps> = ({
  value,
  onChange,
  onValidation,
  phoneNumber = '',
  disabled = false,
  className
}) => {
  const [validationState, setValidationState] = useState<MnpValidationState>({
    isValidating: false,
    validationResult: null,
    error: null
  });

  const debouncedValue = useDebounce(value, 500);

  const validateReservationNumber = useCallback(async (reservationNumber: string) => {
    if (!reservationNumber || reservationNumber.length !== 10) {
      setValidationState({
        isValidating: false,
        validationResult: null,
        error: null
      });
      return;
    }

    setValidationState(prev => ({ ...prev, isValidating: true, error: null }));

    try {
      const response = await fetch('/api/v1/mnp/validate-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationNumber,
          phoneNumber
        }),
      });

      if (!response.ok) {
        throw new Error('バリデーションリクエストに失敗しました');
      }

      const result = await response.json();
      
      setValidationState({
        isValidating: false,
        validationResult: result,
        error: null
      });

      if (onValidation) {
        onValidation(result);
      }
    } catch (error) {
      setValidationState({
        isValidating: false,
        validationResult: null,
        error: error instanceof Error ? error.message : '予期しないエラーが発生しました'
      });
    }
  }, [phoneNumber, onValidation]);

  useEffect(() => {
    if (debouncedValue && debouncedValue.length === 10) {
      validateReservationNumber(debouncedValue);
    }
  }, [debouncedValue, validateReservationNumber]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange(inputValue);
  };

  const getInputClassName = () => {
    const baseClass = "font-mono text-lg tracking-wider";
    
    if (validationState.error) {
      return cn(baseClass, "border-red-500 focus:ring-red-500 focus:border-red-500");
    }
    
    if (validationState.validationResult) {
      if (validationState.validationResult.valid) {
        return cn(baseClass, "border-green-500 focus:ring-green-500 focus:border-green-500");
      } else {
        return cn(baseClass, "border-red-500 focus:ring-red-500 focus:border-red-500");
      }
    }
    
    return baseClass;
  };

  const detectedCarrier = validationState.validationResult?.detectedCarrier 
    ? CARRIERS[validationState.validationResult.detectedCarrier] 
    : null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="1234567890"
          maxLength={10}
          disabled={disabled}
          className={getInputClassName()}
          aria-label="MNP予約番号"
          aria-describedby="mnp-reservation-help mnp-validation-message"
          aria-invalid={validationState.validationResult ? !validationState.validationResult.valid : undefined}
          inputMode="numeric"
        />
        
        {validationState.isValidating && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {detectedCarrier && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            <span className="text-lg">{detectedCarrier.logo}</span>
            <span className={cn("text-sm font-medium", detectedCarrier.color)}>
              {detectedCarrier.name}
            </span>
          </div>
        )}
      </div>

      <div id="mnp-reservation-help" className="text-sm text-gray-600">
        10桁のMNP予約番号を入力してください
      </div>

      {validationState.error && (
        <div id="mnp-validation-message" className="text-sm text-red-600" role="alert">
          {validationState.error}
        </div>
      )}

      {validationState.validationResult && !validationState.validationResult.valid && (
        <div id="mnp-validation-message" className="space-y-1" role="alert">
          {validationState.validationResult.validationErrors.map((error, index) => (
            <div key={index} className="text-sm text-red-600">
              • {error}
            </div>
          ))}
        </div>
      )}

      {validationState.validationResult && validationState.validationResult.valid && (
        <div id="mnp-validation-message" className="text-sm text-green-600" role="status">
          ✓ {validationState.validationResult.message}
          {validationState.validationResult.expirationDate && (
            <div className="text-xs text-gray-500 mt-1">
              有効期限: {new Date(validationState.validationResult.expirationDate).toLocaleDateString('ja-JP')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
