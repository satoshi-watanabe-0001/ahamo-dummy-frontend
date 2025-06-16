import { cn } from "../../lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  className?: string;
  showCompletionStatus?: boolean;
  completedSteps?: string[];
}

export const ProgressIndicator = ({ 
  currentStep, 
  totalSteps, 
  steps, 
  className,
  showCompletionStatus = false,
  completedSteps = []
}: ProgressIndicatorProps) => {
  const getStepStatus = (index: number) => {
    if (showCompletionStatus) {
      const stepId = getStepId(index);
      const isCompleted = completedSteps.includes(stepId);
      
      if (isCompleted) return 'completed';
      if (index === currentStep) return 'current';
      if (index < currentStep) return 'passed';
      return 'pending';
    }
    
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  const getStepId = (index: number): string => {
    const stepIds = [
      'contract-type', 'usage-profile', 'plan-selection', 'device-selection', 
      'pricing-confirmation', 'personal-info', 'verification', 'payment', 
      'contract-confirmation', 'completion'
    ];
    return stepIds[index] || `step-${index}`;
  };

  const getStepIcon = (index: number, status: string) => {
    if (status === 'completed') {
      return (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    return index + 1;
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return "bg-green-600 text-white";
      case 'current':
        return "bg-blue-100 text-blue-600 border-2 border-blue-600";
      case 'passed':
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-200 text-gray-500";
    }
  };

  const completedCount = showCompletionStatus ? completedSteps.length : Math.min(currentStep, totalSteps);
  const progressPercentage = (completedCount / totalSteps) * 100;

  return (
    <div className={cn("w-full mb-6", className)}>
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                getStepClasses(status)
              )}>
                {getStepIcon(index, status)}
              </div>
              <span className={cn(
                "text-xs mt-1 text-center transition-colors duration-300",
                status === 'completed' ? "text-green-600 font-medium" :
                status === 'current' ? "text-blue-600 font-medium" :
                "text-gray-500"
              )}>
                {step}
              </span>
              {showCompletionStatus && status === 'completed' && (
                <span className="text-xs text-green-600 mt-1">✓</span>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {showCompletionStatus && (
        <div className="flex justify-between text-xs text-gray-600">
          <span>進捗状況: {completedCount}/{totalSteps} 完了</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
      )}
    </div>
  );
};
