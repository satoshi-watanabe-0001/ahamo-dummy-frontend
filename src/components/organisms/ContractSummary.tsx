import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Plan, Device, Contract } from '../../types';

interface ContractSummaryProps {
  contract: Contract;
  plan?: Plan;
  device?: Device;
  onChangePlan?: () => void;
  onChangeDevice?: () => void;
  onChangePersonalInfo?: () => void;
}

export const ContractSummary = ({ 
  contract, 
  plan, 
  device, 
  onChangePlan, 
  onChangeDevice, 
  onChangePersonalInfo 
}: ContractSummaryProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">お客様情報</CardTitle>
            <Button variant="outline" size="sm" onClick={onChangePersonalInfo}>
              変更
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">お名前</span>
              <span>{contract.customerInfo?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">電話番号</span>
              <span>{contract.customerInfo?.phoneNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">メールアドレス</span>
              <span>{contract.customerInfo?.email || 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {plan && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">選択プラン</CardTitle>
              <Button variant="outline" size="sm" onClick={onChangePlan}>
                変更
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{plan.name}</span>
                <span className="text-xl font-bold text-blue-600">¥{plan.monthlyFee.toLocaleString()}/月</span>
              </div>
              <div className="text-sm text-gray-600">{plan.description}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">データ容量: </span>
                  <span className="font-medium">{plan.dataCapacity}</span>
                </div>
                <div>
                  <span className="text-gray-600">通話: </span>
                  <span className="font-medium">{plan.voiceCalls}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {device && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">選択デバイス</CardTitle>
              <Button variant="outline" size="sm" onClick={onChangeDevice}>
                変更
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{device.name}</span>
                <span className="text-xl font-bold text-blue-600">¥{device.price.toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-600">{device.brand}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">カテゴリ: </span>
                  <span className="font-medium">{device.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">カラー: </span>
                  <span className="font-medium">{device.colors?.[0] || 'N/A'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
