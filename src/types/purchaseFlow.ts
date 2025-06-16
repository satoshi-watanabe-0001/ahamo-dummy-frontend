export interface ContractTypeData {
  contractType: 'new' | 'mnp' | 'upgrade';
}

export interface UsageProfileData {
  monthlyDataUsage: number;
  callFrequency: 'low' | 'medium' | 'high';
  smsUsage: 'low' | 'medium' | 'high';
  budget: {
    min: number;
    max: number;
  };
  currentCarrier?: string;
  primaryUse: 'personal' | 'business' | 'both';
}

export interface PlanSelectionData {
  selectedPlanId: string;
  selectedOptions: string[];
  recommendedPlans?: string[];
}

export interface DeviceSelectionData {
  selectedDeviceId: string;
  selectedColor?: string;
  selectedStorage?: string;
  devicePrice: number;
  paymentMethod: 'full' | 'installment';
  installmentMonths?: number;
}

export interface PricingConfirmationData {
  planFee: number;
  deviceFee: number;
  optionsFees: number;
  discounts: number;
  totalMonthly: number;
  totalUpfront: number;
}

export interface PurchaseFlowData {
  contractType: ContractTypeData;
  usageProfile: UsageProfileData;
  planSelection: PlanSelectionData;
  deviceSelection: DeviceSelectionData;
  pricingConfirmation: PricingConfirmationData;
  personalInfo: any;
  verification: any;
  payment: any;
  contractConfirmation: any;
  completion: any;
}

export interface PurchaseFlowStep {
  id: string;
  name: string;
  component: string;
  completed: boolean;
  data?: any;
  validation?: (data: any) => boolean;
}

export const PURCHASE_FLOW_STEPS: PurchaseFlowStep[] = [
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
