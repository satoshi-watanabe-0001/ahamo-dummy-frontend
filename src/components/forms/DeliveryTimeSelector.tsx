import { useState, useEffect } from 'react';
import { DeliveryTimeSlot } from '../../types';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

interface DeliveryTimeSelectorProps {
  onTimeSlotSelect: (timeSlot: DeliveryTimeSlot) => void;
  selectedTimeSlot?: DeliveryTimeSlot | null;
}

export const DeliveryTimeSelector = ({ onTimeSlotSelect, selectedTimeSlot }: DeliveryTimeSelectorProps) => {
  const [timeSlots, setTimeSlots] = useState<DeliveryTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTimeSlots = async () => {
      try {
        const response = await fetch('/api/v1/shipping/delivery-time-slots');
        if (response.ok) {
          const data = await response.json();
          setTimeSlots(data);
        }
      } catch (error) {
        console.error('配送時間帯の取得に失敗しました:', error);
        setTimeSlots([
          { id: 1, slotName: '午前中', startTime: '08:00', endTime: '12:00', slotType: 'MORNING', isActive: true },
          { id: 2, slotName: '12時-14時', startTime: '12:00', endTime: '14:00', slotType: 'AFTERNOON', isActive: true },
          { id: 3, slotName: '14時-16時', startTime: '14:00', endTime: '16:00', slotType: 'AFTERNOON', isActive: true },
          { id: 4, slotName: '16時-18時', startTime: '16:00', endTime: '18:00', slotType: 'AFTERNOON', isActive: true },
          { id: 5, slotName: '18時-20時', startTime: '18:00', endTime: '20:00', slotType: 'EVENING', isActive: true },
          { id: 6, slotName: '19時-21時', startTime: '19:00', endTime: '21:00', slotType: 'EVENING', isActive: true }
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadTimeSlots();
  }, []);

  if (loading) {
    return <div className="text-center py-4">配送時間帯を読み込み中...</div>;
  }

  return (
    <div className="space-y-3">
      <RadioGroup 
        value={selectedTimeSlot?.id.toString() || ''} 
        onValueChange={(value: string) => {
          const slot = timeSlots.find(slot => slot.id.toString() === value);
          if (slot) {
            onTimeSlotSelect(slot);
          }
        }}
      >
        {timeSlots.map((slot) => (
          <div key={slot.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value={slot.id.toString()} id={`slot-${slot.id}`} />
            <Label htmlFor={`slot-${slot.id}`} className="flex-1 cursor-pointer">
              <div className="font-medium">{slot.slotName}</div>
              <div className="text-sm text-gray-600">
                {slot.startTime} - {slot.endTime}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {selectedTimeSlot && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="font-medium text-blue-900">選択された時間帯</div>
          <div className="text-sm text-blue-800">
            {selectedTimeSlot.slotName} ({selectedTimeSlot.startTime} - {selectedTimeSlot.endTime})
          </div>
        </div>
      )}
    </div>
  );
};
