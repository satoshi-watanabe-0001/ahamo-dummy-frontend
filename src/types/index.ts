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
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  dataLimit: string;
  features: string[];
  isPopular?: boolean;
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

export type ComponentSize = 'sm' | 'md' | 'lg';
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
export type ComponentState = 'default' | 'hover' | 'active' | 'disabled' | 'loading';
