import { forwardRef } from 'react';

interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface RadioGroupItemProps {
  value: string;
  id: string;
  className?: string;
  children?: React.ReactNode;
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className = '', value, onValueChange, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`space-y-2 ${className}`}
        role="radiogroup"
        {...props}
      >
        {children}
      </div>
    );
  }
);

const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value, id, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="radio"
        value={value}
        id={id}
        name="radio-group"
        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ${className}`}
        {...props}
      />
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
