export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-pressed'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  'aria-disabled'?: boolean;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-relevant'?: string;
  'aria-controls'?: string;
  'aria-owns'?: string;
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-busy'?: boolean;
  role?: string;
  tabIndex?: number;
}

export interface KeyboardNavigationProps {
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onKeyUp?: (event: React.KeyboardEvent) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
}

export interface FocusManagementProps {
  autoFocus?: boolean;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
}

export interface AccessibilityState {
  isHighContrast: boolean;
  reducedMotion: boolean;
  screenReaderActive: boolean;
}

export type AccessibilityLevel = 'A' | 'AA' | 'AAA';
export type ContrastRatio = number;
