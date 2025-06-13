import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';

export const RelatedServicesPanel = () => {
  const services = [
    {
      title: 'ahamoアプリ',
      description: 'データ使用量確認、料金照会、各種手続きが可能',
      action: 'ダウンロード',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      priority: true
    },
    {
      title: 'My docomo',
      description: 'オンラインでの各種手続き・確認サービス',
      action: '登録する',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      priority: true
    },
    {
      title: 'dポイントクラブ',
      description: 'dポイントの確認・利用、特典の受け取り',
      action: '詳細を見る',
      icon: (
        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      priority: false
    }
  ];

  const supportResources = [
    {
      title: 'よくある質問',
      description: 'ahamoに関するよくある質問と回答',
      url: 'https://ahamo.com/support/faq'
    },
    {
      title: '操作・設定ガイド',
      description: '端末の初期設定や各種操作方法',
      url: 'https://ahamo.com/support/guide'
    },
    {
      title: 'チャットサポート',
      description: 'オンラインでのお問い合わせ',
      url: 'https://ahamo.com/support/chat'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-green-600">関連サービス・サポート</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">おすすめアプリ・サービス</h4>
            <div className="space-y-3">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    service.priority 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">{service.title}</h5>
                          <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`mt-2 sm:mt-0 text-xs ${
                            service.priority 
                              ? 'border-blue-300 text-blue-700 hover:bg-blue-100' 
                              : ''
                          }`}
                        >
                          {service.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">サポート・ヘルプ</h4>
            <div className="space-y-2">
              {supportResources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div>
                    <h5 className="font-medium text-gray-900 text-sm">{resource.title}</h5>
                    <p className="text-xs text-gray-600">{resource.description}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800">お得な情報</p>
                <p className="text-xs text-green-700">ahamoアプリをダウンロードすると、データ使用量の確認や各種手続きがより便利になります。</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
