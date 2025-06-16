
import { FeeCalculationResult, Device } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface EnhancedFeeBreakdownProps {
  result: FeeCalculationResult;
  device?: Device | null;
}

export const EnhancedFeeBreakdown = ({ result, device }: EnhancedFeeBreakdownProps) => {
  if (!result) {
    return <div>料金情報を読み込み中...</div>;
  }
  
  const deviceMonthlyPayment = device ? Math.round(device.price / 24) : 0;
  const totalMonthlyFee = result.taxIncluded + deviceMonthlyPayment;

  return (
    <Card>
      <CardHeader>
        <CardTitle>料金内訳</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="border-b pb-3">
            <h4 className="font-medium mb-2">プラン料金</h4>
            <div className="flex justify-between text-sm">
              <span>基本料金</span>
              <span>¥{(result.baseFee || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>オプション料金</span>
              <span>¥{(result.optionsFee || 0).toLocaleString()}</span>
            </div>
            {(result.discounts || 0) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>割引</span>
                <span>-¥{(result.discounts || 0).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>消費税</span>
              <span>¥{(result.tax || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-2">
              <span>プラン小計</span>
              <span>¥{(result.taxIncluded || 0).toLocaleString()}</span>
            </div>
          </div>

          {device && (
            <div className="border-b pb-3">
              <h4 className="font-medium mb-2">端末料金</h4>
              <div className="flex justify-between text-sm">
                <span>{device.name}</span>
                <span>¥{(device.price || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>分割払い (24回)</span>
                <span>¥{deviceMonthlyPayment.toLocaleString()}/月</span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between font-bold text-lg">
              <span>月額合計</span>
              <span className="text-blue-600">¥{(totalMonthlyFee || 0).toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              プラン料金 + 端末分割払い
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
