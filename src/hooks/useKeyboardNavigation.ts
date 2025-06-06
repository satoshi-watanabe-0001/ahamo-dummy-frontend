import { useCallback } from 'react';
import { keyboardHelpers } from '../utils/accessibility/keyboardHelpers';

export interface UseKeyboardNavigationOptions {
  onEnter?: () => void;
  onSpace?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  disabled?: boolean;
}

export const useKeyboardNavigation = (options: UseKeyboardNavigationOptions = {}) => {
  const {
    onEnter,
    onSpace,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    disabled = false,
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return;

    if (keyboardHelpers.isEnterKey(event) && onEnter) {
      event.preventDefault();
      onEnter();
    } else if (keyboardHelpers.isSpaceKey(event) && onSpace) {
      event.preventDefault();
      onSpace();
    } else if (keyboardHelpers.isEscapeKey(event) && onEscape) {
      event.preventDefault();
      onEscape();
    } else if (keyboardHelpers.isArrowUpKey(event) && onArrowUp) {
      event.preventDefault();
      onArrowUp();
    } else if (keyboardHelpers.isArrowDownKey(event) && onArrowDown) {
      event.preventDefault();
      onArrowDown();
    } else if (keyboardHelpers.isArrowLeftKey(event) && onArrowLeft) {
      event.preventDefault();
      onArrowLeft();
    } else if (keyboardHelpers.isArrowRightKey(event) && onArrowRight) {
      event.preventDefault();
      onArrowRight();
    }
  }, [disabled, onEnter, onSpace, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]);

  return {
    keyboardProps: {
      onKeyDown: handleKeyDown,
      tabIndex: disabled ? -1 : 0,
    },
  };
};
