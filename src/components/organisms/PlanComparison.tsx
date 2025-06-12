import { useState, useEffect } from 'react';
import { planApi, feeApi } from '../../utils/api';
import { Plan } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface PlanComparisonProps {
  selectedPlanId?: string;
  onPlanSelect?: (planId: string) => void;
  usageParams?: {
    dataUsage: number;
    callMinutes: number;
    smsCount: number;
  };
}

export const PlanComparison = ({ 
  selectedPlanId, 
  onPlanSelect,
  usageParams = { dataUsage: 15, callMinutes: 120, smsCount: 20 }
}: PlanComparisonProps) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [feeResults, setFeeResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await planApi.getPlans();
        const data = response.data as any;
        setPlans(data.plans || []);
        
      } catch (err) {
        setError('プラン情報の取得に失敗しました。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const compareFees = async () => {
      if (plans.length === 0) return;
      
      try {
        const planIds = plans.map(p => p.id);
        const response = await feeApi.compareFeePlans(usageParams, planIds);
        
        const resultMap: Record<string, any> = {};
        const responseData = response.data as any;
        responseData.results.forEach((result: any, index: number) => {
          resultMap[planIds[index]] = result;
        });
        
        setFeeResults(resultMap);
      } catch (err) {
        console.error('Failed to compare plans', err);
      }
    };
    
    compareFees();
  }, [plans, usageParams]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">プラン情報を読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">プラン比較</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map(plan => (
          <Card 
            key={plan.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedPlanId === plan.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onPlanSelect?.(plan.id)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                {plan.isPopular && <Badge variant="secondary">人気</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-blue-600">
                  ¥{plan.monthlyFee.toLocaleString()}
                  <span className="text-sm font-normal text-gray-600">/月</span>
                </div>
                
                {feeResults[plan.id] && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <div className="text-lg font-bold text-blue-600">
                      ¥{feeResults[plan.id].taxIncluded.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-600">月額料金（税込）</p>
                  </div>
                )}
                
                <p className="text-sm text-gray-600">{plan.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">データ容量</span>
                    <span className="font-medium">{plan.dataCapacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">音声通話</span>
                    <span className="font-medium">{plan.voiceCalls}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">SMS</span>
                    <span className="font-medium">{plan.sms}</span>
                  </div>
                </div>
                
                {plan.features && plan.features.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-1">特徴</p>
                    <div className="flex flex-wrap gap-1">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {plan.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{plan.features.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
