import { useState, useEffect } from 'react';
import { contractApi } from '../../utils/api';
import { ContractDetails } from '../../types';
import { ContractDetailsComponent } from '../organisms/ContractDetails';
import { PlanChangeForm } from '../organisms/PlanChangeForm';
import { OptionManager } from '../organisms/OptionManager';
import { ContractHistory } from '../organisms/ContractHistory';

interface MyPageProps {
  contractId: string;
}

export const MyPage = ({ contractId }: MyPageProps) => {
  const [contractDetails, setContractDetails] = useState<ContractDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'plan-change' | 'options' | 'history'>('details');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        setLoading(true);
        const response = await contractApi.getContractDetails(contractId);
        setContractDetails((response as any).data);
      } catch (err) {
        setError('契約情報の取得に失敗しました。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContractDetails();
  }, [contractId]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">契約情報を読み込み中...</p>
      </div>
    );
  }

  if (error || !contractDetails) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error || '契約情報が見つかりません。'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">マイページ</h1>
      
      <div className="mb-6">
        <nav className="flex space-x-4">
          {[
            { key: 'details', label: '契約詳細' },
            { key: 'plan-change', label: 'プラン変更' },
            { key: 'options', label: 'オプション管理' },
            { key: 'history', label: '変更履歴' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-6">
        {activeTab === 'details' && <ContractDetailsComponent contract={contractDetails} />}
        {activeTab === 'plan-change' && <PlanChangeForm contractId={contractId} currentPlan={contractDetails.plan} />}
        {activeTab === 'options' && <OptionManager contractId={contractId} currentOptions={contractDetails.optionDetails || []} />}
        {activeTab === 'history' && <ContractHistory contractId={contractId} />}
      </div>
    </div>
  );
};
