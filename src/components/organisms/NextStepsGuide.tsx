;
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export const NextStepsGuide = () => {
  const steps = [
    {
      number: 1,
      title: 'SIMカード・端末の配送',
      description: 'ご契約内容に応じて、SIMカードや端末を配送いたします',
      timeframe: '通常2-3営業日',
      details: [
        '配送状況は追跡番号でご確認いただけます',
        '不在の場合は再配達をご依頼ください',
        '受け取り時に本人確認書類をご用意ください'
      ]
    },
    {
      number: 2,
      title: '開通手続き・初期設定',
      description: 'SIMカード到着後、開通手続きと初期設定を行ってください',
      timeframe: '受け取り後すぐ',
      details: [
        'ahamoアプリまたはWebサイトから開通手続き',
        'APN設定（Android端末の場合）',
        '電話帳やデータの移行'
      ]
    },
    {
      number: 3,
      title: 'サービス開始',
      description: '開通手続き完了後、ahamoサービスをご利用いただけます',
      timeframe: '開通手続き完了後',
      details: [
        '20GBの高速データ通信',
        '5分以内の国内通話無料',
        '海外82の国・地域でのデータ通信'
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-green-600">今後の流れ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.number} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-16 bg-green-200 mx-auto mt-2"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <span className="text-sm text-green-600 font-medium">{step.timeframe}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">サポート・お問い合わせ</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• ahamoサポート: 0120-800-000（9:00-20:00 年中無休）</p>
            <p>• チャットサポート: ahamoアプリまたはWebサイトから</p>
            <p>• よくある質問: ahamo.com/support</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
