export interface KeyboardEventHandler {
  (event: KeyboardEvent): void;
}

export const keyboardHelpers = {
  isEnterKey: (event: KeyboardEvent): boolean => event.key === 'Enter',
  isSpaceKey: (event: KeyboardEvent): boolean => event.key === ' ',
  isEscapeKey: (event: KeyboardEvent): boolean => event.key === 'Escape',
  isTabKey: (event: KeyboardEvent): boolean => event.key === 'Tab',
  isArrowKey: (event: KeyboardEvent): boolean => 
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key),
  isArrowUpKey: (event: KeyboardEvent): boolean => event.key === 'ArrowUp',
  isArrowDownKey: (event: KeyboardEvent): boolean => event.key === 'ArrowDown',
  isArrowLeftKey: (event: KeyboardEvent): boolean => event.key === 'ArrowLeft',
  isArrowRightKey: (event: KeyboardEvent): boolean => event.key === 'ArrowRight',

  isActionKey: (event: KeyboardEvent): boolean => 
    keyboardHelpers.isEnterKey(event) || keyboardHelpers.isSpaceKey(event),

  createActionHandler: (callback: () => void): KeyboardEventHandler => {
    return (event: KeyboardEvent) => {
      if (keyboardHelpers.isActionKey(event)) {
        event.preventDefault();
        callback();
      }
    };
  },

  createEscapeHandler: (callback: () => void): KeyboardEventHandler => {
    return (event: KeyboardEvent) => {
      if (keyboardHelpers.isEscapeKey(event)) {
        event.preventDefault();
        callback();
      }
    };
  },

  createArrowNavigationHandler: (options: {
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    preventDefault?: boolean;
  }): KeyboardEventHandler => {
    return (event: KeyboardEvent) => {
      const { onArrowUp, onArrowDown, onArrowLeft, onArrowRight, preventDefault = true } = options;

      if (keyboardHelpers.isArrowUpKey(event) && onArrowUp) {
        if (preventDefault) event.preventDefault();
        onArrowUp();
      } else if (keyboardHelpers.isArrowDownKey(event) && onArrowDown) {
        if (preventDefault) event.preventDefault();
        onArrowDown();
      } else if (keyboardHelpers.isArrowLeftKey(event) && onArrowLeft) {
        if (preventDefault) event.preventDefault();
        onArrowLeft();
      } else if (keyboardHelpers.isArrowRightKey(event) && onArrowRight) {
        if (preventDefault) event.preventDefault();
        onArrowRight();
      }
    };
  },

  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
  },

  focusNext: (container: HTMLElement, currentElement: HTMLElement): void => {
    const focusableElements = keyboardHelpers.getFocusableElements(container);
    const currentIndex = focusableElements.indexOf(currentElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    focusableElements[nextIndex]?.focus();
  },

  focusPrevious: (container: HTMLElement, currentElement: HTMLElement): void => {
    const focusableElements = keyboardHelpers.getFocusableElements(container);
    const currentIndex = focusableElements.indexOf(currentElement);
    const previousIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
    focusableElements[previousIndex]?.focus();
  },
};
