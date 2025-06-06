import { FeeCalculationResult } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface FeeBreakdownProps {
  result: FeeCalculationResult;
}

export const FeeBreakdown = ({ result }: FeeBreakdownProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>料金シミュレーション結果</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-4 text-blue-600">
          ¥{result.taxIncluded.toLocaleString()}
          <span className="text-sm font-normal ml-1 text-gray-600">（税込）</span>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 border-b pb-2">料金内訳</h4>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700">基本料金</span>
            <span className="font-medium">¥{result.breakdown.baseFee.toLocaleString()}</span>
          </div>
          
          {result.breakdown.callFee > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">通話・SMS料金</span>
              <span className="font-medium">¥{result.breakdown.callFee.toLocaleString()}</span>
            </div>
          )}
          
          {result.breakdown.dataFee > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">データ追加料金</span>
              <span className="font-medium">¥{result.breakdown.dataFee.toLocaleString()}</span>
            </div>
          )}
          
          {result.breakdown.optionFees.map(option => (
            <div key={option.id} className="flex justify-between items-center">
              <span className="text-gray-700">{option.name}</span>
              <span className="font-medium">¥{option.fee.toLocaleString()}</span>
            </div>
          ))}
          
          {result.breakdown.discounts.map(discount => (
            <div key={discount.id} className="flex justify-between items-center text-green-600">
              <span>{discount.name}</span>
              <span className="font-medium">-¥{discount.amount.toLocaleString()}</span>
            </div>
          ))}
          
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between items-center font-medium">
              <span>小計（税抜）</span>
              <span>¥{result.totalFee.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
              <span>消費税</span>
              <span>¥{(result.taxIncluded - result.totalFee).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
