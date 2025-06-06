import * as React from "react";
import { cn } from "../../lib/utils";
import { useFocusManagement } from "../../hooks/useFocusManagement";
import { useKeyboardNavigation } from "../../hooks/useKeyboardNavigation";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue>({
  open: false,
  onOpenChange: () => {},
});

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = open !== undefined ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, asChild = false, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext);

  const handleClick = () => {
    onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      onClick: handleClick,
    });
  }

  return (
    <button
      ref={ref}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
DialogTrigger.displayName = "DialogTrigger";

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(DialogContext);
  const { containerRef, activateTrap, deactivateTrap } = useFocusManagement({
    autoFocus: true,
    restoreFocus: true,
  });

  const { keyboardProps } = useKeyboardNavigation({
    onEscape: () => onOpenChange(false),
  });

  React.useEffect(() => {
    if (open) {
      activateTrap();
    } else {
      deactivateTrap();
    }
  }, [open, activateTrap, deactivateTrap]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={(node) => {
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref && 'current' in ref) {
            (ref as any).current = node;
          }
          if (containerRef && 'current' in containerRef) {
            (containerRef as any).current = node;
          }
        }}
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
          className
        )}
        onKeyDown={keyboardProps.onKeyDown as any}
        tabIndex={keyboardProps.tabIndex}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
};
