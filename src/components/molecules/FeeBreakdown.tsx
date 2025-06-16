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
            <span className="font-medium">¥{(result.baseFee || 0).toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700">オプション料金</span>
            <span className="font-medium">¥{(result.optionsFee || 0).toLocaleString()}</span>
          </div>
          
          {(result.discounts || 0) > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span>割引</span>
              <span className="font-medium">-¥{(result.discounts || 0).toLocaleString()}</span>
            </div>
          )}
          
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between items-center font-medium">
              <span>小計（税抜）</span>
              <span>¥{(result.taxExcluded || 0).toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
              <span>消費税</span>
              <span>¥{(result.tax || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
