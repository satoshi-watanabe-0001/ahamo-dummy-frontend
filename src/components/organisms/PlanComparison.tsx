import { useState, useEffect } from 'react';
import { PlanCard } from '../molecules/PlanCard';
import { PlanComparisonTable } from '../molecules/PlanComparisonTable';
import { usePlans } from '../../hooks/usePlans';

export function PlanComparison() {
  const { plans, loading, error } = usePlans();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  useEffect(() => {
    if (plans.length > 0 && !selectedPlanId) {
      const recommendedPlan = plans.find(p => p.isPopular);
      if (recommendedPlan) {
        setSelectedPlanId(recommendedPlan.id);
      } else {
        setSelectedPlanId(plans[0].id);
      }
    }
  }, [plans, selectedPlanId]);
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold text-center mobile:text-xl">プラン比較</h2>
      
      <div className="hidden tablet:grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
        {plans.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={plan.id === selectedPlanId}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>
      
      <div className="tablet:hidden">
        <div className="flex overflow-x-auto scroll-snap-type-x-mandatory gap-4 pb-4">
          {plans.map(plan => (
            <div key={plan.id} className="min-w-[90vw] scroll-snap-align-start flex-shrink-0">
              <PlanCard
                plan={plan}
                isSelected={plan.id === selectedPlanId}
                onSelect={handleSelectPlan}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 mobile:text-lg">料金比較表</h3>
        <PlanComparisonTable plans={plans} />
      </div>
      
      {selectedPlanId && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            選択中のプラン: <strong>{plans.find(p => p.id === selectedPlanId)?.name}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
