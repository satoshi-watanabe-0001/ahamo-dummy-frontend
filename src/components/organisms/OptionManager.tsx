import { useState, useEffect, useCallback } from 'react';
import { OptionSelector } from '../molecules/OptionSelector';
import { FeeBreakdown } from '../molecules/FeeBreakdown';
import { Option, FeeCalculationRequestWithOptions, FeeCalculationResult } from '../../types';
import { feeApi, optionApi } from '../../utils/api';
import { useDebounce } from '../../hooks/useDebounce';

interface OptionManagerProps {
  selectedPlanId: string;
  baseUsage: {
    dataUsage: number;
    callMinutes: number;
    smsCount: number;
  };
}

export const OptionManager = ({ selectedPlanId, baseUsage }: OptionManagerProps) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [feeResult, setFeeResult] = useState<FeeCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSelection = useDebounce(selectedOptionIds, 500);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await optionApi.getOptions();
        setOptions(response.data.options || []);
      } catch (err) {
        console.error('Failed to load options:', err);
        setError('オプション情報の取得に失敗しました');
      }
    };

    loadOptions();
  }, []);

  const calculateTotalFee = useCallback(async (optionIds: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const request: FeeCalculationRequestWithOptions = {
        planId: selectedPlanId,
        dataUsage: baseUsage.dataUsage,
        callMinutes: baseUsage.callMinutes,
        smsCount: baseUsage.smsCount,
        selectedOptionIds: optionIds
      };

      const response = await feeApi.calculateTotal(request);
      setFeeResult(response.data as FeeCalculationResult);
    } catch (err) {
      console.error('Fee calculation failed:', err);
      setError('料金計算に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [selectedPlanId, baseUsage]);

  useEffect(() => {
    calculateTotalFee(debouncedSelection);
  }, [debouncedSelection, calculateTotalFee]);

  const handleSelectionChange = (newSelection: string[]) => {
    setSelectedOptionIds(newSelection);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">オプション選択</h3>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        <OptionSelector
          options={options}
          selectedOptionIds={selectedOptionIds}
          onSelectionChange={handleSelectionChange}
          disabled={loading}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">料金計算結果</h3>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">計算中...</p>
            </div>
          </div>
        )}
        {feeResult && !loading && <FeeBreakdown result={feeResult} />}
      </div>
    </div>
  );
};
