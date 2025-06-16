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
  totalFee: number;
  breakdown: {
    baseFee: number;
    callFee: number;
    dataFee: number;
    optionFees: {
      id: string;
      name: string;
      fee: number;
    }[];
    discounts: {
      id: string;
      name: string;
      amount: number;
    }[];
  };
  taxIncluded: number;
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

export interface TrackingData {
  trackingNumber: string;
  status: string;
  events: TrackingEvent[];
  estimatedDelivery: string;
}

export interface TrackingEvent {
  id: number;
  status: string;
  location: string;
  latitude?: number;
  longitude?: number;
  estimatedArrivalTime?: string;
  timestamp: string;
  description: string;
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  currentLocation: string;
  estimatedArrivalTime: string;
  status: string;
  timestamp: string;
}
