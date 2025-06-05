export interface BaseComponent {
  className?: string;
  children?: React.ReactNode;
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
  model: string;
  price: number;
  imageUrl?: string;
  specifications: Record<string, string>;
  inStock: boolean;
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

export type ComponentSize = 'sm' | 'md' | 'lg';
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
export type ComponentState = 'default' | 'hover' | 'active' | 'disabled' | 'loading';
