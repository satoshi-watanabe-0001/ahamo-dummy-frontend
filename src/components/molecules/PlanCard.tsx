import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Plan } from '../../types';

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card className={`transition-all duration-200 ${isSelected ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
          {plan.isPopular && <Badge variant="default">おすすめ</Badge>}
        </div>
        <CardDescription className="text-sm text-gray-600">{plan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">データ容量</span>
            <span className="font-semibold">{plan.dataCapacity}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">通話</span>
            <span className="font-semibold">{plan.voiceCalls}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">SMS</span>
            <span className="font-semibold">{plan.sms}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">月額料金</span>
              <span className="text-2xl font-bold text-blue-600">¥{plan.monthlyFee.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              name="plan-selection" 
              checked={isSelected}
              onChange={() => onSelect(plan.id)}
              className="mr-2"
            />
            <span className="text-sm">このプランを選択</span>
          </label>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? '詳細を閉じる' : '詳細を見る'}
        </Button>
      </CardContent>
      
      {isExpanded && (
        <CardFooter className="flex-col items-start border-t pt-4">
          <h4 className="font-semibold mb-2">プラン詳細</h4>
          <ul className="list-disc pl-5 space-y-1">
            {plan.features.map((feature, index) => (
              <li key={index} className="text-sm text-gray-600">{feature}</li>
            ))}
          </ul>
        </CardFooter>
      )}
    </Card>
  );
}
