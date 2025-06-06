import { useToast } from "../../hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastTitle } from "./toast";
import { getErrorIcon } from "../../utils/errorUtils";
import { ErrorSeverity } from "../../utils/api";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 w-full max-w-sm p-4 space-y-4">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const severity = (props as any).severity || ErrorSeverity.WARNING;
        const icon = getErrorIcon(severity);
        
        return (
          <Toast
            key={id}
            variant={severity === ErrorSeverity.CRITICAL ? 'destructive' : 'default'}
            {...props}
          >
            <div className="flex items-start space-x-3">
              <span className="text-lg">{icon}</span>
              <div className="flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
                {(props as any).resolution && (
                  <ToastDescription className="mt-2 text-xs opacity-75">
                    💡 {(props as any).resolution}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
    </div>
  );
}
