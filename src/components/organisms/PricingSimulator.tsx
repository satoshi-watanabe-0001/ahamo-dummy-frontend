import { useState, useEffect } from 'react';
import { contractApi } from '../../utils/api';
import { FeeCalculationResult } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface PricingSimulatorProps {
  contractId: string;
  newPlanId: string;
}

export const PricingSimulator = ({ contractId, newPlanId }: PricingSimulatorProps) => {
  const [simulation, setSimulation] = useState<FeeCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (newPlanId) {
      simulateChange();
    }
  }, [contractId, newPlanId]);

  const simulateChange = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contractApi.simulatePlanChange(contractId, { newPlanId });
      setSimulation((response as any).data);
    } catch (err) {
      setError('料金シミュレーションに失敗しました。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>料金シミュレーション</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">計算中...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>料金シミュレーション</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!simulation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>料金シミュレーション</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">プランを選択してください。</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>料金シミュレーション</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>基本料金</span>
            <span>¥{simulation.baseFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>オプション料金</span>
            <span>¥{simulation.optionsFee.toLocaleString()}</span>
          </div>
          {simulation.discounts > 0 && (
            <div className="flex justify-between text-green-600">
              <span>割引</span>
              <span>-¥{simulation.discounts.toLocaleString()}</span>
            </div>
          )}
          <hr />
          <div className="flex justify-between">
            <span>小計（税抜）</span>
            <span>¥{simulation.taxExcluded.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>消費税</span>
            <span>¥{simulation.tax.toLocaleString()}</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg">
            <span>合計（税込）</span>
            <span className="text-blue-600">¥{simulation.taxIncluded.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
