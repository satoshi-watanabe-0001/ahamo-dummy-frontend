import { useState } from 'react';
import { FeeSimulator } from './FeeSimulator';
import { PlanComparison } from './PlanComparison';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export const FeeSimulatorPage = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_basic_001');
  const [usageParams, setUsageParams] = useState({
    dataUsage: 15,
    callMinutes: 120,
    smsCount: 20
  });

  const handleUsageChange = (newUsage: typeof usageParams) => {
    setUsageParams(newUsage);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>料金シミュレーション</CardTitle>
        </CardHeader>
        <CardContent>
          <FeeSimulator selectedPlanId={selectedPlanId} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>プラン比較</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanComparison 
            selectedPlanId={selectedPlanId}
            onPlanSelect={setSelectedPlanId}
            usageParams={usageParams}
          />
        </CardContent>
      </Card>
    </div>
  );
};
