export interface BaseComponent {
  className?: string;
  children?: any;
}

export interface Contract {
  id: string;
  planId: string;
  deviceId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'draft' | 'active' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  options?: string[];
  customerInfo: {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyFee: number;
  dataCapacity: string;
  voiceCalls: string;
  sms: string;
  features: string[];
  isActive: boolean;
  isPopular?: boolean;
}

export interface FeeCalculationRequest {
  planId: string;
  dataUsage: number;
  callMinutes: number;
  smsCount: number;
}

export interface FeeCalculationResult {
  baseFee: number;
  optionsFee: number;
  discounts: number;
  taxExcluded: number;
  tax: number;
  taxIncluded: number;
}

export interface PlanChangeRequest {
  newPlanId: string;
  reason?: string;
  effectiveDate: string;
}

export interface PlanChangeSimulation {
  currentPlan: Plan;
  newPlan: Plan;
  feeComparison: {
    current: FeeCalculationResult;
    new: FeeCalculationResult;
    difference: number;
  };
  optionCompatibility: {
    compatible: Option[];
    incompatible: Option[];
  };
}

export interface OptionManagementRequest {
  optionId: string;
  reason?: string;
}

export interface UsagePattern {
  name: string;
  dataUsage: number;
  callMinutes: number;
  smsCount: number;
}

export interface Device {
  id: string;
  name: string;
  brand: string;
  category: 'iPhone' | 'Android';
  priceRange: 'entry' | 'mid' | 'premium';
  price: number;
  colors: string[];
  storageOptions: string[];
  inStock: boolean;
  imageUrl?: string;
  specifications?: string;
  galleryImages?: string[];
  releaseDate: string;
  popularity: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminDeviceRequest {
  name: string;
  brand: string;
  category: 'iPhone' | 'Android';
  priceRange: 'entry' | 'mid' | 'premium';
  price: number;
  colors?: string[];
  storageOptions?: string[];
  inStock?: boolean;
  imageUrl?: string;
  specifications?: string;
  galleryImages?: string[];
}

export interface DeviceImportResult {
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: Array<{
    rowNumber: number;
    deviceId: string;
    errorMessage: string;
  }>;
}

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
}

export interface ResponsiveProps {
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
}



export * from './accessibility';

export interface Option {
  id: string;
  name: string;
  category: 'insurance' | 'accessory' | 'service';
  description: string;
  monthlyFee: number;
  oneTimeFee: number;
  isActive: boolean;
  requiredOptions?: string[];
  excludedOptions?: string[];
}

export interface FeeCalculationRequestWithOptions extends FeeCalculationRequest {
  selectedOptionIds?: string[];
}

export interface PersonalInfo {
  nameKanji: string;
  nameKana: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  building?: string;
  phone: string;
  email: string;
}

export interface CapturedImage {
  data: string;
  timestamp: number;
  qualityScore: number;
  documentType: 'license' | 'passport' | 'mynumber';
  side?: 'front' | 'back';
}

export interface CameraState {
  isActive: boolean;
  isReady: boolean;
  hasPermission: boolean | null;
  error: string | null;
  stream: MediaStream | null;
  devices: MediaDeviceInfo[];
  currentDeviceId: string | null;
}

export interface QualityCheckResult {
  isBlurry: boolean;
  hasGlare: boolean;
  isComplete: boolean;
  hasAdequateResolution: boolean;
  score: number;
  feedback: string[];
}

export type ComponentSize = 'sm' | 'md' | 'lg';
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
export type ComponentState = 'default' | 'hover' | 'active' | 'disabled' | 'loading';

export interface ContractConfirmationData {
  checkedItems: string[];
  contractId?: string;
  confirmationTimestamp?: number;
}

export interface ContractConfirmationRequest {
  contractId: string;
  confirmationData: ContractConfirmationData;
  ipAddress?: string;
}

export * from './mnp';

export interface Address {
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  building?: string;
}

export interface ConvenienceStore {
  id: number;
  storeCode: string;
  storeName: string;
  chainName: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  operatingHours?: string;
  isActive: boolean;
}

export interface DeliveryTimeSlot {
  id: number;
  slotName: string;
  startTime: string;
  endTime: string;
  slotType: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'CUSTOM';
  isActive: boolean;
}

export interface ShippingOption {
  id: number;
  optionCode: string;
  optionName: string;
  description?: string;
  requiresRecipientInfo: boolean;
  isActive: boolean;
}

export interface ShippingFormData {
  addressType: 'contract' | 'alternate' | 'work' | 'convenience';
  alternateAddress?: Address;
  workAddress?: Address;
  convenienceStore?: ConvenienceStore | null;
  deliveryTimeSlot?: DeliveryTimeSlot | null;
  deliveryOption: string;
  recipientName?: string;
  recipientPhone?: string;
  delegationInfo?: string;
  deliveryNotes?: string;
  absenceHandling?: string;
}

export interface ContractDetails extends Contract {
  plan: Plan;
  device?: Device;
  optionDetails?: Option[];
  totalMonthlyFee?: number;
  contractPeriod?: {
    startDate: string;
    endDate?: string;
  };
}

export interface ContractChangeHistory {
  id: number;
  changeType: 'PLAN_CHANGE' | 'OPTION_ADD' | 'OPTION_REMOVE' | 'OPTION_SUSPEND';
  oldValue?: string;
  newValue?: string;
  reason?: string;
  effectiveDate?: string;
  createdAt: string;
  createdBy: string;
}

export interface PlanChangeRequest {
  newPlanId: string;
  reason?: string;
  effectiveDate: string;
}

export interface PlanChangeSimulation {
  currentPlan: Plan;
  newPlan: Plan;
  feeComparison: {
    current: FeeCalculationResult;
    new: FeeCalculationResult;
    difference: number;
  };
  optionCompatibility: {
    compatible: Option[];
    incompatible: Option[];
  };
}

export interface OptionManagementRequest {
  optionId: string;
  reason?: string;
}
