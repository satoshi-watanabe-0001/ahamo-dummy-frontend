import { } from 'react';
import { ContractDetails } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface ContractDetailsProps {
  contract: ContractDetails;
}

export const ContractDetailsComponent = ({ contract }: ContractDetailsProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>契約情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">契約番号</p>
              <p className="font-medium">{contract.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">契約状況</p>
              <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                {contract.status === 'active' ? 'アクティブ' : contract.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">お客様名</p>
              <p className="font-medium">{contract.customerName || 'テストユーザー'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">メールアドレス</p>
              <p className="font-medium">{contract.customerEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">電話番号</p>
              <p className="font-medium">{contract.customerPhone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">契約開始日</p>
              <p className="font-medium">{new Date(contract.createdAt).toLocaleDateString('ja-JP')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>現在のプラン</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{contract.plan.name}</h3>
              <p className="text-gray-600">{contract.plan.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">月額料金</p>
                <p className="text-xl font-bold text-blue-600">¥{contract.plan.monthlyFee.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">データ容量</p>
                <p className="font-medium">{contract.plan.dataCapacity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">音声通話</p>
                <p className="font-medium">{contract.plan.voiceCalls}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {contract.optionDetails && contract.optionDetails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>加入中のオプション</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contract.optionDetails.map(option => (
                <div key={option.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">{option.name}</p>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">¥{option.monthlyFee.toLocaleString()}/月</p>
                    {option.oneTimeFee && option.oneTimeFee > 0 && (
                      <p className="text-sm text-gray-600">初回: ¥{option.oneTimeFee.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>月額料金合計</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>基本料金</span>
              <span>¥{contract.plan.monthlyFee.toLocaleString()}</span>
            </div>
            {contract.optionDetails && contract.optionDetails.map(option => (
              <div key={option.id} className="flex justify-between text-sm">
                <span>{option.name}</span>
                <span>¥{option.monthlyFee.toLocaleString()}</span>
              </div>
            ))}
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>合計</span>
              <span className="text-blue-600">
                ¥{contract.totalMonthlyFee ? contract.totalMonthlyFee.toLocaleString() : (contract.plan.monthlyFee + (contract.optionDetails?.reduce((sum, opt) => sum + opt.monthlyFee, 0) || 0)).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
