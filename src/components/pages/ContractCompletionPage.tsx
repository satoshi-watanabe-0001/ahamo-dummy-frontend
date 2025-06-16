import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ProgressIndicator } from '../ui/progress-indicator';
import { ContractCompletionSummary } from '../organisms/ContractCompletionSummary';
import { NextStepsGuide } from '../organisms/NextStepsGuide';
import { ImportantDatesDisplay } from '../molecules/ImportantDatesDisplay';
import { RelatedServicesPanel } from '../molecules/RelatedServicesPanel';
import { contractApi } from '../../utils/api';
import { Contract, Plan, Device } from '../../types';
import { toast } from '../../hooks/use-toast';

interface ContractCompletionPageProps {
  contractData?: {
    contract: Contract;
    plan?: Plan;
    device?: Device;
  };
  onBackToHome?: () => void;
}

export const ContractCompletionPage = ({ 
  contractData, 
  onBackToHome 
}: ContractCompletionPageProps) => {
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<Contract | null>(contractData?.contract || null);
  const [plan, ] = useState<Plan | null>(contractData?.plan || null);
  const [device, ] = useState<Device | null>(contractData?.device || null);

  useEffect(() => {
    if (!contractData && !contract) {
      const loadContractData = async () => {
        try {
          const contractsResponse = await contractApi.getContracts();
          const contracts = (contractsResponse.data as any).contracts || [];
          
          if (contracts.length > 0) {
            const currentContract = contracts[0];
            setContract(currentContract);
          }
        } catch (error) {
          toast({
            title: '契約情報の読み込みエラー',
            description: '契約情報を読み込めませんでした',
            severity: 'WARNING'
          });
        }
      };

      loadContractData();
    }
  }, [contractData, contract]);

  const handleDownloadPDF = async () => {
    if (!contract?.id) return;
    
    setLoading(true);
    try {
      const response = await contractApi.generateContractDocument(contract.id);
      
      const blob = new Blob([response.data as BlobPart], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `契約書_${contract.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: '契約書のダウンロードが完了しました',
        description: 'PDFファイルをご確認ください',
        severity: 'INFO'
      });
    } catch (error) {
      toast({
        title: 'ダウンロードエラー',
        description: '契約書のダウンロードに失敗しました。しばらく時間をおいてから再度お試しください',
        severity: 'WARNING'
      });
    } finally {
      setLoading(false);
    }
  };

  const contractNumber = contract?.id || 'N/A';
  const contractDate = contract?.createdAt ? new Date(contract.createdAt).toLocaleDateString('ja-JP') : 'N/A';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <ProgressIndicator 
        currentStep={6}
        totalSteps={6}
        steps={['個人情報', 'プラン選択', '本人確認', '決済', '契約確認', '完了']}
        showCompletionStatus={true}
        completedSteps={['personal-info', 'plan-selection', 'verification', 'payment', 'contract-confirmation', 'completion']}
      />

      <div className="text-center mb-8">
        <div className="mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">契約完了</h1>
          <p className="text-lg text-gray-600">ahamoへのお申し込みが完了いたしました</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">契約番号: </span>
              <span className="font-bold text-green-700">{contractNumber}</span>
            </div>
            <div>
              <span className="text-gray-600">契約日時: </span>
              <span className="font-bold text-green-700">{contractDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {contract && (
              <ContractCompletionSummary
                contract={contract}
                plan={plan || undefined}
                device={device || undefined}
              />
            )}
            
            <div className="flex justify-center">
              <Button 
                onClick={handleDownloadPDF}
                disabled={loading || !contract}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ダウンロード中...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    契約書をダウンロード
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <ImportantDatesDisplay />
            <RelatedServicesPanel />
          </div>
        </div>

        <NextStepsGuide />

        <div className="flex justify-center pt-6 border-t">
          <Button 
            onClick={onBackToHome}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            ホームに戻る
          </Button>
        </div>
      </div>
    </div>
  );
};
