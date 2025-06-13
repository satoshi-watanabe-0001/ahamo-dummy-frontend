import { useState, useEffect } from 'react';
import { contractApi } from '../../utils/api';
import { ContractChangeHistory } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface ContractHistoryProps {
  contractId: string;
}

export const ContractHistory = ({ contractId }: ContractHistoryProps) => {
  const [history, setHistory] = useState<ContractChangeHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await contractApi.getContractHistory(contractId);
        setHistory((response as any).data);
      } catch (err) {
        console.error('Failed to fetch contract history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [contractId]);

  const getChangeTypeLabel = (changeType: string) => {
    switch (changeType) {
      case 'PLAN_CHANGE':
        return 'プラン変更';
      case 'OPTION_ADD':
        return 'オプション追加';
      case 'OPTION_REMOVE':
        return 'オプション削除';
      case 'OPTION_SUSPEND':
        return 'オプション一時停止';
      default:
        return changeType;
    }
  };

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'PLAN_CHANGE':
        return 'bg-blue-100 text-blue-800';
      case 'OPTION_ADD':
        return 'bg-green-100 text-green-800';
      case 'OPTION_REMOVE':
        return 'bg-red-100 text-red-800';
      case 'OPTION_SUSPEND':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">変更履歴を読み込み中...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>契約変更履歴</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-gray-600">変更履歴はありません。</p>
        ) : (
          <div className="space-y-4">
            {history.map(item => (
              <div key={item.id} className="border-l-4 border-blue-200 pl-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getChangeTypeColor(item.changeType)}>
                      {getChangeTypeLabel(item.changeType)}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">実行者: {item.createdBy}</span>
                </div>
                
                <div className="space-y-1">
                  {item.oldValue && (
                    <div className="text-sm">
                      <span className="text-gray-600">変更前: </span>
                      <span className="font-medium">{item.oldValue}</span>
                    </div>
                  )}
                  {item.newValue && (
                    <div className="text-sm">
                      <span className="text-gray-600">変更後: </span>
                      <span className="font-medium">{item.newValue}</span>
                    </div>
                  )}
                  {item.reason && (
                    <div className="text-sm">
                      <span className="text-gray-600">理由: </span>
                      <span>{item.reason}</span>
                    </div>
                  )}
                  {item.effectiveDate && (
                    <div className="text-sm">
                      <span className="text-gray-600">適用日: </span>
                      <span>{new Date(item.effectiveDate).toLocaleDateString('ja-JP')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
