import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ProgressIndicator } from '../ui/progress-indicator';
import { SaveStatus } from '../ui/save-status';
import { ContractSummary } from '../organisms/ContractSummary';
import { ImportantTermsHighlight } from '../organisms/ImportantTermsHighlight';
import { ConfirmationChecklist } from '../molecules/ConfirmationChecklist';
import { FeeBreakdown } from '../molecules/FeeBreakdown';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { contractApi, planApi, deviceApi, feeApi } from '../../utils/api';
import { Contract, Plan, Device, FeeCalculationResult } from '../../types';
import { toast } from '../../hooks/use-toast';

interface ContractConfirmationData {
  checkedItems: string[];
  contractId?: string;
}

interface ContractConfirmationPageProps {
  onSubmit: (data: ContractConfirmationData & { contractData?: { contract: Contract; plan?: Plan; device?: Device } }) => void;
  onBack?: () => void;
  onChangePlan?: () => void;
  onChangeDevice?: () => void;
  onChangePersonalInfo?: () => void;
}

export const ContractConfirmationPage = ({ 
  onSubmit, 
  onBack, 
  onChangePlan, 
  onChangeDevice, 
  onChangePersonalInfo 
}: ContractConfirmationPageProps) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [contract, setContract] = useState<Contract | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [feeResult, setFeeResult] = useState<FeeCalculationResult | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    saveStatus,
    lastSavedTime,
    updateFormData,
    manualSave,
    clearData
  } = useFormPersistence({
    formId: 'contract-confirmation',
    onRestore: (data) => {
      setCheckedItems(data.checkedItems || []);
    }
  });

  useEffect(() => {
    const loadContractData = async () => {
      try {
        const contractsResponse = await contractApi.getContracts();
        const contracts = (contractsResponse.data as any).contracts || [];
        
        if (contracts.length > 0) {
          const currentContract = contracts[0];
          setContract(currentContract);

          if (currentContract.planId) {
            const planResponse = await planApi.getPlan(currentContract.planId);
            setPlan(planResponse.data as Plan);
          }

          if (currentContract.deviceId) {
            const deviceResponse = await deviceApi.getDevice(currentContract.deviceId);
            setDevice(deviceResponse.data as Device);
          }

          const feeResponse = await feeApi.calculateFee({
            planId: currentContract.planId,
            dataUsage: 15,
            callMinutes: 120,
            smsCount: 20
          });
          setFeeResult(feeResponse.data as FeeCalculationResult);
        }
      } catch (error) {
        toast({
          title: '契約情報の読み込みエラー',
          description: '契約情報を読み込めませんでした',
          severity: 'WARNING'
        });
      } finally {
        setLoading(false);
      }
    };

    loadContractData();
  }, []);

  useEffect(() => {
    updateFormData({ checkedItems });
  }, [checkedItems, updateFormData]);

  const handleItemChange = (itemId: string, checked: boolean) => {
    setCheckedItems(prev => 
      checked 
        ? [...prev, itemId]
        : prev.filter(id => id !== itemId)
    );
  };

  const handleSubmit = () => {
    const requiredItems = ['contract-content', 'important-terms', 'terms-of-service', 'privacy-policy'];
    const missingItems = requiredItems.filter(item => !checkedItems.includes(item));

    if (missingItems.length > 0) {
      toast({
        title: '確認事項が未完了です',
        description: 'すべての確認事項にチェックを入れてください',
        severity: 'WARNING'
      });
      return;
    }

    clearData();
    onSubmit({ 
      checkedItems, 
      contractId: contract?.id,
      contractData: contract ? { contract, plan: plan || undefined, device: device || undefined } : undefined
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">契約情報を読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  const allItemsChecked = ['contract-content', 'important-terms', 'terms-of-service', 'privacy-policy']
    .every(item => checkedItems.includes(item));

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <ProgressIndicator 
        currentStep={5}
        totalSteps={6}
        steps={['個人情報', 'プラン選択', '本人確認', '決済', '契約確認', '完了']}
        showCompletionStatus={true}
        completedSteps={['personal-info', 'plan-selection', 'verification', 'payment']}
      />
      
      <SaveStatus
        status={saveStatus}
        onManualSave={manualSave}
        lastSavedTime={lastSavedTime || undefined}
        className="mb-6"
      />

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">契約内容の確認</h2>
          <p className="text-gray-600">以下の内容で契約を締結します。内容をご確認ください。</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {contract && (
              <ContractSummary
                contract={contract}
                plan={plan || undefined}
                device={device || undefined}
                onChangePlan={onChangePlan}
                onChangeDevice={onChangeDevice}
                onChangePersonalInfo={onChangePersonalInfo}
              />
            )}
          </div>
          
          <div className="space-y-6">
            {feeResult && <FeeBreakdown result={feeResult} />}
            <ImportantTermsHighlight />
          </div>
        </div>

        <ConfirmationChecklist
          checkedItems={checkedItems}
          onItemChange={handleItemChange}
        />

        <div className="flex justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={onBack}>
            戻る
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!allItemsChecked}
            className="bg-green-600 hover:bg-green-700"
          >
            契約を確定する
          </Button>
        </div>
      </div>
    </div>
  );
};
