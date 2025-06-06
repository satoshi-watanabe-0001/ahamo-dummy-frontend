import { useCallback, useEffect, useRef } from 'react';
import { createFocusTrap, FocusTrap, FocusTrapOptions } from '../utils/accessibility/focusTrap';

export interface UseFocusManagementOptions extends FocusTrapOptions {
  autoFocus?: boolean;
  restoreFocus?: boolean;
}

export const useFocusManagement = (options: UseFocusManagementOptions = {}) => {
  const containerRef = useRef<HTMLElement>(null);
  const focusTrapRef = useRef<FocusTrap | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const {
    autoFocus = false,
    restoreFocus = true,
    ...focusTrapOptions
  } = options;

  const createTrap = useCallback(() => {
    if (!containerRef.current) return null;
    
    if (focusTrapRef.current) {
      focusTrapRef.current.deactivate();
    }

    focusTrapRef.current = createFocusTrap(containerRef.current, focusTrapOptions);
    return focusTrapRef.current;
  }, [focusTrapOptions]);

  const activateTrap = useCallback(() => {
    if (restoreFocus) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement;
    }

    const trap = focusTrapRef.current || createTrap();
    trap?.activate();
  }, [createTrap, restoreFocus]);

  const deactivateTrap = useCallback(() => {
    focusTrapRef.current?.deactivate();
    
    if (restoreFocus && previouslyFocusedElementRef.current) {
      previouslyFocusedElementRef.current.focus();
      previouslyFocusedElementRef.current = null;
    }
  }, [restoreFocus]);

  const focusFirst = useCallback(() => {
    if (!containerRef.current) return;
    
    const focusableElements = containerRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    firstElement?.focus();
  }, []);

  useEffect(() => {
    if (autoFocus) {
      focusFirst();
    }
  }, [autoFocus, focusFirst]);

  useEffect(() => {
    return () => {
      focusTrapRef.current?.deactivate();
    };
  }, []);

  return {
    containerRef,
    activateTrap,
    deactivateTrap,
    focusFirst,
    isTrapped: !!focusTrapRef.current,
  };
};
