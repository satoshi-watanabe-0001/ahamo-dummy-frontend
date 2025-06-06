import * as React from "react";
import { Button } from "./button";
import { useHighContrast } from "../../hooks/useHighContrast";
import { useLiveRegion } from "../../hooks/useLiveRegion";

export interface HighContrastToggleProps {
  className?: string;
  showLabel?: boolean;
}

const HighContrastToggle = React.forwardRef<HTMLButtonElement, HighContrastToggleProps>(
  ({ className, showLabel = true, ...props }, ref) => {
    const { isHighContrast, toggleHighContrast } = useHighContrast();
    const { liveRegionRef, announce } = useLiveRegion({ politeness: 'polite' });

    const handleToggle = () => {
      toggleHighContrast();
      announce(
        isHighContrast 
          ? 'ハイコントラストモードを無効にしました' 
          : 'ハイコントラストモードを有効にしました'
      );
    };

    return (
      <>
        <Button
          ref={ref}
          variant="outline"
          size="sm"
          onClick={handleToggle}
          aria-pressed={isHighContrast}
          aria-label={`ハイコントラストモード${isHighContrast ? 'を無効にする' : 'を有効にする'}`}
          className={className}
          {...props}
        >
          <span className="mr-2" aria-hidden="true">
            {isHighContrast ? '🔆' : '🌓'}
          </span>
          {showLabel && (
            <span>
              {isHighContrast ? 'ハイコントラスト無効' : 'ハイコントラスト有効'}
            </span>
          )}
        </Button>
        <div ref={liveRegionRef} />
      </>
    );
  }
);
HighContrastToggle.displayName = "HighContrastToggle";

export { HighContrastToggle };
