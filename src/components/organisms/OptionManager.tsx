import { useState, useEffect } from 'react';
import { contractApi } from '../../utils/api';
import { Option } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface OptionManagerProps {
  contractId: string;
  currentOptions: Option[];
}

export const OptionManager = ({ contractId, currentOptions }: OptionManagerProps) => {
  const [availableOptions, setAvailableOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableOptions = async () => {
      try {
        setLoading(true);
        const response = await contractApi.getAvailableOptions(contractId);
        setAvailableOptions((response as any).data);
      } catch (err) {
        console.error('Failed to fetch available options', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableOptions();
  }, [contractId]);

  const handleAddOption = async (optionId: string) => {
    try {
      setActionLoading(optionId);
      await contractApi.addOption(contractId, { optionId });
      alert('オプションを追加しました。');
    } catch (err) {
      console.error('Failed to add option', err);
      alert('オプションの追加に失敗しました。');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveOption = async (optionId: string) => {
    try {
      setActionLoading(optionId);
      await contractApi.removeOption(contractId, optionId);
      alert('オプションを削除しました。');
    } catch (err) {
      console.error('Failed to remove option', err);
      alert('オプションの削除に失敗しました。');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspendOption = async (optionId: string) => {
    try {
      setActionLoading(optionId);
      await contractApi.suspendOption(contractId, optionId);
      alert('オプションを一時停止しました。');
    } catch (err) {
      console.error('Failed to suspend option', err);
      alert('オプションの一時停止に失敗しました。');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">オプション情報を読み込み中...</p>
      </div>
    );
  }


  
  const currentOptionIds = currentOptions.map((opt: Option) => opt.id);
  const availableToAdd = availableOptions.filter((opt: Option) => !currentOptionIds.includes(opt.id));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>現在のオプション</CardTitle>
        </CardHeader>
        <CardContent>
          {currentOptions.length === 0 ? (
            <p className="text-gray-600">加入中のオプションはありません。</p>
          ) : (
            <div className="space-y-3">
              {currentOptions.map(option => (
                <div key={option.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">{option.name}</p>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    <p className="text-sm font-medium text-blue-600">¥{option.monthlyFee.toLocaleString()}/月</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSuspendOption(option.id)}
                      disabled={actionLoading === option.id}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 disabled:opacity-50"
                    >
                      {actionLoading === option.id ? '処理中...' : '一時停止'}
                    </button>
                    <button
                      onClick={() => handleRemoveOption(option.id)}
                      disabled={actionLoading === option.id}
                      className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
                    >
                      {actionLoading === option.id ? '処理中...' : '削除'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>追加可能なオプション</CardTitle>
        </CardHeader>
        <CardContent>
          {availableToAdd.length === 0 ? (
            <p className="text-gray-600">追加可能なオプションはありません。</p>
          ) : (
            <div className="space-y-3">
              {availableToAdd.map(option => (
                <div key={option.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{option.name}</p>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-sm font-medium text-blue-600">¥{option.monthlyFee.toLocaleString()}/月</p>
                      {option.oneTimeFee > 0 && (
                        <p className="text-sm text-gray-600">初回: ¥{option.oneTimeFee.toLocaleString()}</p>
                      )}
                      <Badge variant="secondary">{option.category}</Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddOption(option.id)}
                    disabled={actionLoading === option.id}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {actionLoading === option.id ? '追加中...' : '追加'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
