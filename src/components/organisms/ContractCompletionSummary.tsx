;
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Plan, Device, Contract } from '../../types';

interface ContractCompletionSummaryProps {
  contract: Contract;
  plan?: Plan;
  device?: Device;
}

export const ContractCompletionSummary = ({ 
  contract, 
  plan, 
  device
}: ContractCompletionSummaryProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-green-600">契約内容</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">お名前</span>
              <span className="font-medium">{contract.customerInfo?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">電話番号</span>
              <span className="font-medium">{contract.customerInfo?.phoneNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">メールアドレス</span>
              <span className="font-medium">{contract.customerInfo?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ご住所</span>
              <span className="font-medium">{contract.customerInfo?.address || 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {plan && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-600">ご契約プラン</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-lg">{plan.name}</span>
                <span className="text-xl font-bold text-blue-600">¥{plan.monthlyFee.toLocaleString()}/月</span>
              </div>
              <div className="text-sm text-gray-600">{plan.description}</div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">データ容量</span>
                  <span className="font-medium">{plan.dataCapacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">通話</span>
                  <span className="font-medium">{plan.voiceCalls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SMS</span>
                  <span className="font-medium">{plan.sms}</span>
                </div>
              </div>
              {plan.features && plan.features.length > 0 && (
                <div className="mt-3">
                  <span className="text-sm text-gray-600 block mb-2">特典・サービス</span>
                  <ul className="text-sm space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {device && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-600">ご購入端末</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-lg">{device.name}</span>
                <span className="text-xl font-bold text-blue-600">¥{device.price.toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-600">{device.brand}</div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">カテゴリ</span>
                  <span className="font-medium">{device.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">カラー</span>
                  <span className="font-medium">{device.colors?.[0] || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ストレージ</span>
                  <span className="font-medium">{device.storageOptions?.[0] || 'N/A'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
