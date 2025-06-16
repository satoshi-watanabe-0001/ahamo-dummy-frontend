import { useState, useEffect } from 'react';
import { contractApi } from '../../utils/api';
import { Plan } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { PricingSimulator } from './PricingSimulator';

interface PlanChangeFormProps {
  contractId: string;
  currentPlan: Plan;
}

export const PlanChangeForm = ({ contractId, currentPlan }: PlanChangeFormProps) => {
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const [reason, setReason] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAvailablePlans = async () => {
      try {
        setLoading(true);
        const response = await contractApi.getAvailablePlans(contractId);
        const plans = ((response as any).data as Plan[]).filter((plan: Plan) => plan.id !== currentPlan.id);
        setAvailablePlans(plans);
      } catch (err) {
        console.error('Failed to fetch available plans', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailablePlans();
  }, [contractId, currentPlan.id]);

  useEffect(() => {
    if (selectedPlan) {
      const simulateChange = async () => {
        try {
          await contractApi.simulatePlanChange(contractId, {
            newPlanId: selectedPlan.id
          });

        } catch (err) {
          console.error('Failed to simulate plan change', err);
        }
      };

      simulateChange();
    }
  }, [selectedPlan, contractId]);

  const handleSubmit = async () => {
    if (!selectedPlan || !effectiveDate) return;

    try {
      setSubmitting(true);
      await contractApi.changePlan(contractId, {
        newPlanId: selectedPlan.id,
        reason,
        effectiveDate
      });
      alert('プラン変更の申し込みが完了しました。');
    } catch (err) {
      console.error('Failed to change plan', err);
      alert('プラン変更の申し込みに失敗しました。');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">利用可能なプランを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>現在のプラン</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 rounded-md">
            <h3 className="font-semibold">{currentPlan.name}</h3>
            <p className="text-sm text-gray-600">{currentPlan.description}</p>
            <p className="text-lg font-bold text-blue-600 mt-2">¥{currentPlan.monthlyFee.toLocaleString()}/月</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>変更可能なプラン</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availablePlans.map(plan => (
              <div
                key={plan.id}
                className={`p-4 border rounded-md cursor-pointer transition-all ${
                  selectedPlan?.id === plan.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{plan.name}</h3>
                  {plan.isPopular && <Badge variant="secondary">人気</Badge>}
                </div>
                <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                <p className="text-lg font-bold text-blue-600">¥{plan.monthlyFee.toLocaleString()}/月</p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>データ容量:</span>
                    <span>{plan.dataCapacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>音声通話:</span>
                    <span>{plan.voiceCalls}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedPlan && (
        <PricingSimulator
          contractId={contractId}
          newPlanId={selectedPlan.id}
        />
      )}

      {selectedPlan && (
        <Card>
          <CardHeader>
            <CardTitle>プラン変更申し込み</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  変更理由（任意）
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="プラン変更の理由をご記入ください"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  適用開始日 *
                </label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!effectiveDate || submitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'プラン変更申し込み中...' : 'プラン変更を申し込む'}
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
