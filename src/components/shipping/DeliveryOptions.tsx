import React, { useState } from 'react';

interface DeliveryOptionsProps {
  trackingNumber: string;
}

export const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({ trackingNumber }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const timeSlots = [
    { value: '09:00-12:00', label: '午前中 (9:00-12:00)' },
    { value: '12:00-14:00', label: '12:00-14:00' },
    { value: '14:00-16:00', label: '14:00-16:00' },
    { value: '16:00-18:00', label: '16:00-18:00' },
    { value: '18:00-20:00', label: '18:00-20:00' },
    { value: '20:00-21:00', label: '20:00-21:00' }
  ];

  const handleChangeDeliveryTime = async () => {
    if (!selectedDate || !selectedTime) {
      setMessage('配達日時を選択してください');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/v1/shipping/delivery-time/${trackingNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryDate: selectedDate,
          timeWindow: selectedTime
        })
      });

      const result = await response.json();
      setMessage(result.message);
      
      if (result.success) {
        setSelectedDate('');
        setSelectedTime('');
      }
    } catch (error) {
      setMessage('配達日時の変更に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestRedelivery = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/v1/shipping/redelivery/${trackingNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryDate: selectedDate,
          timeWindow: selectedTime
        })
      });

      const result = await response.json();
      setMessage(result.message);
      
      if (result.success) {
        setSelectedDate('');
        setSelectedTime('');
      }
    } catch (error) {
      setMessage('再配達の依頼に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="delivery-options">
      <h3 className="text-lg font-semibold mb-4">配達オプション</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            配達希望日
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            配達希望時間
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">時間を選択してください</option>
            {timeSlots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleChangeDeliveryTime}
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '処理中...' : '配達日時変更'}
          </button>
          
          <button
            onClick={handleRequestRedelivery}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '処理中...' : '再配達依頼'}
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-md ${
            message.includes('失敗') || message.includes('エラー') 
              ? 'bg-red-100 text-red-700 border border-red-300' 
              : 'bg-green-100 text-green-700 border border-green-300'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};
