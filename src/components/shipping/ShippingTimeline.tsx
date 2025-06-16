import React from 'react';
import { TrackingEvent } from '../../types';

interface ShippingTimelineProps {
  events: TrackingEvent[];
  currentStatus: string;
}

const statusSteps = [
  { key: 'PENDING', label: '配送準備中', icon: '📦' },
  { key: 'SHIPPED', label: '発送済み', icon: '🚚' },
  { key: 'IN_TRANSIT', label: '配送中', icon: '🛣️' },
  { key: 'OUT_FOR_DELIVERY', label: '配達中', icon: '🏃‍♂️' },
  { key: 'DELIVERED', label: '配達完了', icon: '✅' }
];

export const ShippingTimeline: React.FC<ShippingTimelineProps> = ({ events, currentStatus }) => {
  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === currentStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="shipping-timeline">
      <h3 className="text-lg font-semibold mb-4">配送状況</h3>
      
      <div className="relative">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <div key={step.key} className="flex items-center mb-4">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${isCompleted 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'bg-gray-200 border-gray-300 text-gray-500'
                }
                ${isCurrent ? 'ring-4 ring-blue-200' : ''}
              `}>
                <span className="text-lg">{step.icon}</span>
              </div>
              
              <div className="ml-4 flex-1">
                <div className={`font-medium ${isCompleted ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.label}
                </div>
                
                {events
                  .filter(event => event.status === step.key)
                  .map((event, eventIndex) => (
                    <div key={eventIndex} className="text-sm text-gray-600 mt-1">
                      <div>{event.description}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(event.timestamp).toLocaleString('ja-JP')}
                      </div>
                      {event.location && (
                        <div className="text-xs text-gray-500">📍 {event.location}</div>
                      )}
                    </div>
                  ))
                }
              </div>
              
              {index < statusSteps.length - 1 && (
                <div className={`
                  absolute left-5 w-0.5 h-8 mt-10
                  ${isCompleted ? 'bg-blue-500' : 'bg-gray-300'}
                `} style={{ top: `${index * 80 + 40}px` }} />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">最新の配送イベント</h4>
        {events.length > 0 ? (
          <div className="space-y-2">
            {events.slice(-3).reverse().map((event, index) => (
              <div key={index} className="text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{event.description}</span>
                  <span className="text-gray-500">
                    {new Date(event.timestamp).toLocaleString('ja-JP')}
                  </span>
                </div>
                {event.location && (
                  <div className="text-gray-600">📍 {event.location}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">配送イベントがありません</div>
        )}
      </div>
    </div>
  );
};
