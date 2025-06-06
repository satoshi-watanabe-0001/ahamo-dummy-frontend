import { useState, useEffect, useCallback } from 'react';
import { FeeSimulationForm } from '../molecules/FeeSimulationForm';
import { FeeBreakdown } from '../molecules/FeeBreakdown';
import { feeApi } from '../../utils/api';
import { FeeCalculationRequest, FeeCalculationResult } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

interface FeeSimulatorProps {
  selectedPlanId: string;
}

export const FeeSimulator = ({ selectedPlanId }: FeeSimulatorProps) => {
  const [request, setRequest] = useState<FeeCalculationRequest>({
    planId: selectedPlanId,
    dataUsage: 15,
    callMinutes: 120,
    smsCount: 20
  });
  const [result, setResult] = useState<FeeCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedRequest = useDebounce(request, 500);
  
  const calculateFee = useCallback(async (req: FeeCalculationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await feeApi.calculateFee(req);
      setResult(response.data);
    } catch (err) {
      setError('計算中にエラーが発生しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    calculateFee(debouncedRequest);
  }, [debouncedRequest, calculateFee]);
  
  useEffect(() => {
    setRequest(prev => ({ ...prev, planId: selectedPlanId }));
  }, [selectedPlanId]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <FeeSimulationForm 
          selectedPlanId={selectedPlanId}
          onCalculate={setRequest}
        />
      </div>
      <div>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">計算中...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        {result && !loading && <FeeBreakdown result={result} />}
      </div>
    </div>
  );
};
