import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ProgressIndicator } from '../ui/progress-indicator';
import { EnhancedFeeBreakdown } from '../molecules/EnhancedFeeBreakdown';
import { feeApi } from '../../utils/api';
import { Device, FeeCalculationResult } from '../../types';
export interface PricingConfirmationData {
  planFee: number;
  deviceFee: number;
  optionsFees: number;
  discounts: number;
  totalMonthly: number;
  totalUpfront: number;
}

interface PricingConfirmationProps {
  onSubmit: (data: PricingConfirmationData) => void;
  onBack?: () => void;
  selectedDevice?: Device | null;
  planId?: string;
}

export const PricingConfirmation = ({ onSubmit, onBack, selectedDevice, planId }: PricingConfirmationProps) => {
  const [feeResult, setFeeResult] = useState<FeeCalculationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateFees = async () => {
      try {
        const feeResponse = await feeApi.calculateFee({
          planId: planId || 'ahamo-basic',
          dataUsage: 15,
          callMinutes: 120,
          smsCount: 20
        });
        setFeeResult(feeResponse.data as FeeCalculationResult);
      } catch (error) {
        console.error('Failed to calculate fees:', error);
      } finally {
        setLoading(false);
      }
    };

    calculateFees();
  }, [planId]);

  const handleConfirm = () => {
    if (feeResult && selectedDevice) {
      const pricingData: PricingConfirmationData = {
        planFee: feeResult.baseFee || 0,
        deviceFee: selectedDevice.price || 0,
        optionsFees: feeResult.optionsFee || 0,
        discounts: feeResult.discounts || 0,
        totalMonthly: (feeResult.baseFee || 0) + (feeResult.optionsFee || 0) + Math.floor((selectedDevice.price || 0) / 24),
        totalUpfront: 0
      };
      onSubmit(pricingData);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">料金を計算中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <ProgressIndicator 
        currentStep={5}
        totalSteps={10}
        steps={['契約タイプ', '利用状況', 'プラン選択', '端末選択', '料金確認', '個人情報', '本人確認', '決済', '契約確認', '完了']}
        showCompletionStatus={true}
        completedSteps={['contract-type', 'usage-profile', 'plan-selection', 'device-selection']}
      />

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">料金確認</h2>
          <p className="text-gray-600">選択されたプランと端末の料金をご確認ください。</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {selectedDevice && (
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">選択された端末</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    📱
                  </div>
                  <div>
                    <p className="font-medium">{selectedDevice.name}</p>
                    <p className="text-gray-600">¥{selectedDevice.price?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {feeResult && <EnhancedFeeBreakdown result={feeResult} device={selectedDevice} />}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">料金について</h4>
          <p className="text-sm text-blue-800">
            表示されている料金は税込価格です。端末代金は24回分割払いの月額料金を含んでいます。
          </p>
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={onBack}>
            戻る
          </Button>
          <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
            この内容で進む
          </Button>
        </div>
      </div>
    </div>
  );
};
