import { cn } from "../../lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  className?: string;
}

export const ProgressIndicator = ({ currentStep, totalSteps, steps, className }: ProgressIndicatorProps) => {
  return (
    <div className={cn("w-full mb-6", className)}>
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              index < currentStep ? "bg-blue-600 text-white" : 
              index === currentStep ? "bg-blue-100 text-blue-600 border-2 border-blue-600" :
              "bg-gray-200 text-gray-500"
            )}>
              {index + 1}
            </div>
            <span className="text-xs mt-1 text-center">{step}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};
