export interface MnpReservationValidationRequest {
  reservationNumber: string;
  phoneNumber: string;
}

export interface MnpReservationValidationResponse {
  valid: boolean;
  reservationNumber: string;
  detectedCarrier: string | null;
  expirationDate: string;
  expired: boolean;
  duplicate: boolean;
  validationErrors: string[];
  message: string;
}

export interface MnpCarrier {
  code: string;
  name: string;
  logo: string;
  color: string;
}

export interface MnpInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidation?: (result: MnpReservationValidationResponse) => void;
  phoneNumber?: string;
  disabled?: boolean;
  className?: string;
}

export interface MnpValidationState {
  isValidating: boolean;
  validationResult: MnpReservationValidationResponse | null;
  error: string | null;
}
