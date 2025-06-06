import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { UsagePattern, FeeCalculationRequest } from '../../types';

const DEFAULT_PATTERNS: UsagePattern[] = [
  { name: '軽量', dataUsage: 5, callMinutes: 30, smsCount: 5 },
  { name: '標準', dataUsage: 15, callMinutes: 120, smsCount: 20 },
  { name: '重量', dataUsage: 30, callMinutes: 300, smsCount: 50 },
];

interface FeeSimulationFormProps {
  selectedPlanId: string;
  onCalculate: (request: FeeCalculationRequest) => void;
}

export const FeeSimulationForm = ({ 
  selectedPlanId, 
  onCalculate 
}: FeeSimulationFormProps) => {
  const [dataUsage, setDataUsage] = useState(15);
  const [callMinutes, setCallMinutes] = useState(120);
  const [smsCount, setSmsCount] = useState(20);
  
  const applyPattern = (pattern: UsagePattern) => {
    setDataUsage(pattern.dataUsage);
    setCallMinutes(pattern.callMinutes);
    setSmsCount(pattern.smsCount);
  };
  
  useEffect(() => {
    onCalculate({
      planId: selectedPlanId,
      dataUsage,
      callMinutes,
      smsCount
    });
  }, [selectedPlanId, dataUsage, callMinutes, smsCount, onCalculate]);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">利用パターン</h3>
        <div className="flex gap-4">
          {DEFAULT_PATTERNS.map(pattern => (
            <Button 
              key={pattern.name}
              variant="outline"
              onClick={() => applyPattern(pattern)}
              className="flex-1"
            >
              {pattern.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">使用量設定</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              データ使用量: {dataUsage} GB
            </label>
            <Slider 
              min={0} 
              max={50} 
              step={1} 
              value={dataUsage}
              onValueChange={setDataUsage}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              通話時間: {callMinutes} 分
            </label>
            <Slider 
              min={0} 
              max={500} 
              step={10} 
              value={callMinutes}
              onValueChange={setCallMinutes}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              SMS回数: {smsCount} 回
            </label>
            <Slider 
              min={0} 
              max={100} 
              step={5} 
              value={smsCount}
              onValueChange={setSmsCount}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
