

interface PaymentMethod {
  value: string;
  label: string;
  description: string;
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

export const PaymentMethodSelector = ({ 
  methods, 
  selectedMethod, 
  onMethodChange 
}: PaymentMethodSelectorProps) => {
  return (
    <div className="space-y-3">
      {methods.map(method => (
        <label 
          key={method.value} 
          className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <input
            type="radio"
            value={method.value}
            checked={selectedMethod === method.value}
            onChange={(e) => onMethodChange(e.target.value)}
            className="mt-1 mr-3"
          />
          <div>
            <h4 className="font-medium">{method.label}</h4>
            <p className="text-sm text-gray-600">{method.description}</p>
          </div>
        </label>
      ))}
    </div>
  );
};
