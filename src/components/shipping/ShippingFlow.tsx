import { useState } from 'react';
import { ShippingAddressForm } from '../forms/ShippingAddressForm';
import { DeliveryOptionsForm } from '../forms/DeliveryOptionsForm';
import { ShippingFormData, Address } from '../../types';

interface ShippingFlowProps {
  onComplete: (data: ShippingFormData) => void;
  onBack?: () => void;
  contractAddress?: Address;
}

export const ShippingFlow = ({ onComplete, onBack, contractAddress }: ShippingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<'address' | 'options'>('address');
  const [shippingData, setShippingData] = useState<Partial<ShippingFormData>>({});

  const handleAddressSubmit = (data: ShippingFormData) => {
    setShippingData(prev => ({ ...prev, ...data }));
    setCurrentStep('options');
  };

  const handleOptionsSubmit = (data: ShippingFormData) => {
    const finalData = { ...shippingData, ...data } as ShippingFormData;
    onComplete(finalData);
  };

  const handleBackToAddress = () => {
    setCurrentStep('address');
  };

  if (currentStep === 'address') {
    return (
      <ShippingAddressForm
        onSubmit={handleAddressSubmit}
        onBack={onBack}
        contractAddress={contractAddress}
      />
    );
  }

  return (
    <DeliveryOptionsForm
      onSubmit={handleOptionsSubmit}
      onBack={handleBackToAddress}
    />
  );
};
