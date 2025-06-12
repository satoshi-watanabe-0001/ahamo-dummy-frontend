import { useState, useEffect } from 'react';
import { Option } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';

interface OptionSelectorProps {
  options: Option[];
  selectedOptionIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  disabled?: boolean;
}

export const OptionSelector = ({ 
  options, 
  selectedOptionIds, 
  onSelectionChange, 
  disabled = false 
}: OptionSelectorProps) => {
  const [localSelection, setLocalSelection] = useState<string[]>(selectedOptionIds);

  useEffect(() => {
    setLocalSelection(selectedOptionIds);
  }, [selectedOptionIds]);

  const handleOptionToggle = (optionId: string, checked: boolean) => {
    if (disabled) return;

    let newSelection: string[];
    if (checked) {
      newSelection = [...localSelection, optionId];
    } else {
      newSelection = localSelection.filter(id => id !== optionId);
    }

    const finalSelection = validateSelection(newSelection, options);
    setLocalSelection(finalSelection);
    onSelectionChange(finalSelection);
  };

  const validateSelection = (selection: string[], allOptions: Option[]): string[] => {
    let validSelection = [...selection];

    for (const optionId of selection) {
      const option = allOptions.find(o => o.id === optionId);
      if (option?.excludedOptions) {
        validSelection = validSelection.filter(id => !option.excludedOptions!.includes(id));
      }
    }

    return validSelection;
  };

  const isOptionDisabled = (option: Option): boolean => {
    if (disabled) return true;
    
    return localSelection.some(selectedId => {
      const selectedOption = options.find(o => o.id === selectedId);
      return selectedOption?.excludedOptions?.includes(option.id);
    });
  };

  const groupedOptions = options.reduce((groups, option) => {
    const category = option.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(option);
    return groups;
  }, {} as Record<string, Option[]>);

  const categoryNames = {
    insurance: '保険・補償',
    accessory: 'アクセサリー',
    service: 'サービス'
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedOptions).map(([category, categoryOptions]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{categoryNames[category as keyof typeof categoryNames]}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryOptions.map(option => (
                <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={option.id}
                    checked={localSelection.includes(option.id)}
                    onCheckedChange={(checked) => handleOptionToggle(option.id, checked as boolean)}
                    disabled={isOptionDisabled(option)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor={option.id} className="font-medium cursor-pointer">
                        {option.name}
                      </label>
                      <div className="text-right">
                        {option.monthlyFee > 0 && (
                          <div className="font-semibold">¥{option.monthlyFee.toLocaleString()}/月</div>
                        )}
                        {option.oneTimeFee > 0 && (
                          <div className="text-sm text-gray-600">初回: ¥{option.oneTimeFee.toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
