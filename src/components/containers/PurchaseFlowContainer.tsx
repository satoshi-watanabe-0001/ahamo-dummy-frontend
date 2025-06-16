import { useState } from 'react';
import { ContractTypeSelection } from '../forms/ContractTypeSelection';
import { UsageProfilingForm } from '../forms/UsageProfilingForm';
import { PlanSelectionForm } from '../forms/PlanSelectionForm';
import { DeviceSelectionFlow } from '../flows/DeviceSelectionFlow';
import { PricingConfirmation } from '../flows/PricingConfirmation';
import { PersonalInfoForm } from '../forms/PersonalInfoForm';
import { VerificationForm } from '../forms/VerificationForm';
import { PaymentForm } from '../forms/PaymentForm';
import { ContractConfirmationPage } from '../pages/ContractConfirmationPage';
import { ContractCompletionPage } from '../pages/ContractCompletionPage';
interface PurchaseFlowStep {
  id: string;
  name: string;
  component: string;
  completed: boolean;
  data?: any;
  validation?: (data: any) => boolean;
}

const PURCHASE_FLOW_STEPS: PurchaseFlowStep[] = [
  { id: 'contract-type', name: '契約タイプ', component: 'ContractTypeSelection', completed: false },
  { id: 'usage-profile', name: '利用状況', component: 'UsageProfilingForm', completed: false },
  { id: 'plan-selection', name: 'プラン選択', component: 'PlanSelectionForm', completed: false },
  { id: 'device-selection', name: '端末選択', component: 'DeviceSelectionFlow', completed: false },
  { id: 'pricing-confirmation', name: '料金確認', component: 'PricingConfirmation', completed: false },
  { id: 'personal-info', name: '個人情報', component: 'PersonalInfoForm', completed: false },
  { id: 'verification', name: '本人確認', component: 'VerificationForm', completed: false },
  { id: 'payment', name: '決済情報', component: 'PaymentForm', completed: false },
  { id: 'contract-confirmation', name: '契約確認', component: 'ContractConfirmationPage', completed: false },
  { id: 'completion', name: '完了', component: 'ContractCompletionPage', completed: false }
];
import { Device } from '../../types';

interface PurchaseFlowContainerProps {
  onComplete?: () => void;
}

export const PurchaseFlowContainer = ({ onComplete }: PurchaseFlowContainerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [flowData, setFlowData] = useState<any>({});
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const handleStepSubmit = (stepData: any) => {
    const stepId = PURCHASE_FLOW_STEPS[currentStep].id;
    
    setFlowData((prev: any) => ({
      ...prev,
      [stepId]: stepData
    }));

    if (stepId === 'device-selection') {
      setSelectedDevice(stepData);
    }

    if (currentStep < PURCHASE_FLOW_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    const step = PURCHASE_FLOW_STEPS[currentStep];
    
    switch (step.id) {
      case 'contract-type':
        return (
          <ContractTypeSelection
            onSubmit={handleStepSubmit}
            onBack={currentStep > 0 ? handleStepBack : undefined}
          />
        );
      
      case 'usage-profile':
        return (
          <UsageProfilingForm
            onSubmit={handleStepSubmit}
            onBack={handleStepBack}
          />
        );
      
      case 'plan-selection':
        return (
          <PlanSelectionForm
            onSubmit={handleStepSubmit}
            onBack={handleStepBack}
          />
        );
      
      case 'device-selection':
        return (
          <DeviceSelectionFlow
            onSubmit={handleStepSubmit}
            onBack={handleStepBack}
            selectedDevice={selectedDevice}
          />
        );
      
      case 'pricing-confirmation':
        return (
          <PricingConfirmation
            onSubmit={handleStepSubmit}
            onBack={handleStepBack}
            selectedDevice={selectedDevice}
            planId={flowData['plan-selection']?.selectedPlanId}
          />
        );
      
      case 'personal-info':
        return (
          <PersonalInfoForm
            onSubmit={handleStepSubmit}
          />
        );
      
      case 'verification':
        return (
          <VerificationForm
            onSubmit={handleStepSubmit}
            onBack={handleStepBack}
          />
        );
      
      case 'payment':
        return (
          <PaymentForm
            onSubmit={handleStepSubmit}
            onBack={handleStepBack}
          />
        );
      
      case 'contract-confirmation':
        return (
          <ContractConfirmationPage
            onSubmit={handleStepSubmit}
            onBack={handleStepBack}
            selectedDevice={selectedDevice}
          />
        );
      
      case 'completion':
        return (
          <ContractCompletionPage
            onBackToHome={onComplete}
          />
        );
      
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentStep()}
    </div>
  );
};
