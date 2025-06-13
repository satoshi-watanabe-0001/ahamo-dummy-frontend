import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export const ImportantDatesDisplay = () => {
  const today = new Date();
  const activationDate = new Date(today);
  activationDate.setDate(today.getDate() + 3);
  
  const firstBillingDate = new Date(today);
  firstBillingDate.setMonth(today.getMonth() + 1);
  firstBillingDate.setDate(1);
  
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 2);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const importantDates = [
    {
      label: '配送予定日',
      date: formatDate(deliveryDate),
      description: 'SIMカード・端末のお届け予定',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      priority: 'high'
    },
    {
      label: 'サービス開始予定日',
      date: formatDate(activationDate),
      description: '開通手続き完了後にサービス開始',
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      priority: 'high'
    },
    {
      label: '初回請求日',
      date: formatDate(firstBillingDate),
      description: '月額料金の初回請求予定日',
      icon: (
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      priority: 'medium'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-green-600">重要な日程</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {importantDates.map((item, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg border-l-4 ${
                item.priority === 'high' 
                  ? 'bg-blue-50 border-blue-500' 
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-semibold text-gray-900 text-sm">{item.label}</h4>
                    <span className={`text-sm font-bold ${
                      item.priority === 'high' ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {item.date}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800">ご注意</p>
              <p className="text-xs text-yellow-700">配送状況や開通手続きの進捗により、日程が前後する場合があります。</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
