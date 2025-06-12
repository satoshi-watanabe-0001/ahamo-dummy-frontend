import React, { useState } from 'react';
import { MnpReservationInput } from '../molecules/MnpReservationInput';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../molecules/card';
import { MnpReservationValidationResponse } from '../../types/mnp';

interface MnpTransferFormProps {
  onSubmit?: (data: MnpTransferFormData) => void;
  className?: string;
}

export interface MnpTransferFormData {
  phoneNumber: string;
  reservationNumber: string;
  fromCarrier: string;
  contractId: string;
  desiredTransferDate?: string;
}

export const MnpTransferForm: React.FC<MnpTransferFormProps> = ({
  onSubmit,
  className
}) => {
  const [formData, setFormData] = useState<MnpTransferFormData>({
    phoneNumber: '',
    reservationNumber: '',
    fromCarrier: '',
    contractId: ''
  });

  const [validationResult, setValidationResult] = useState<MnpReservationValidationResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReservationValidation = (result: MnpReservationValidationResponse) => {
    setValidationResult(result);
    if (result.valid && result.detectedCarrier) {
      setFormData(prev => ({
        ...prev,
        fromCarrier: result.detectedCarrier
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validationResult?.valid) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('MNP転入申請エラー:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = validationResult?.valid && 
                     formData.phoneNumber && 
                     formData.contractId;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>📱</span>
          <span>MNP転入申請</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-2">
                電話番号 <span className="text-red-500">*</span>
              </label>
              <Input
                id="phone-number"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="09012345678"
                maxLength={11}
                inputMode="tel"
                aria-required="true"
                className="font-mono"
              />
            </div>

            <div>
              <label htmlFor="reservation-number" className="block text-sm font-medium text-gray-700 mb-2">
                MNP予約番号 <span className="text-red-500">*</span>
              </label>
              <MnpReservationInput
                value={formData.reservationNumber}
                onChange={(value) => setFormData(prev => ({ ...prev, reservationNumber: value }))}
                onValidation={handleReservationValidation}
                phoneNumber={formData.phoneNumber}
              />
            </div>

            <div>
              <label htmlFor="contract-id" className="block text-sm font-medium text-gray-700 mb-2">
                契約ID <span className="text-red-500">*</span>
              </label>
              <Input
                id="contract-id"
                type="text"
                value={formData.contractId}
                onChange={(e) => setFormData(prev => ({ ...prev, contractId: e.target.value }))}
                placeholder="契約IDを入力してください"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="desired-date" className="block text-sm font-medium text-gray-700 mb-2">
                希望転入日
              </label>
              <Input
                id="desired-date"
                type="date"
                value={formData.desiredTransferDate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, desiredTransferDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {validationResult && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">検証結果</h3>
              <div className="space-y-1 text-sm">
                <div>予約番号: {validationResult.reservationNumber}</div>
                {validationResult.detectedCarrier && (
                  <div>検出キャリア: {validationResult.detectedCarrier}</div>
                )}
                <div>有効期限: {new Date(validationResult.expirationDate).toLocaleDateString('ja-JP')}</div>
                <div className={validationResult.valid ? 'text-green-600' : 'text-red-600'}>
                  ステータス: {validationResult.valid ? '有効' : '無効'}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  phoneNumber: '',
                  reservationNumber: '',
                  fromCarrier: '',
                  contractId: ''
                });
                setValidationResult(null);
              }}
            >
              リセット
            </Button>
            
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>処理中...</span>
                </div>
              ) : (
                'MNP転入申請'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
