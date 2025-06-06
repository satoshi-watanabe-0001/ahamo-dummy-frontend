export interface FocusTrapOptions {
  initialFocus?: HTMLElement | string;
  fallbackFocus?: HTMLElement | string;
  escapeDeactivates?: boolean;
  clickOutsideDeactivates?: boolean;
}

export class FocusTrap {
  private container: HTMLElement;
  private options: FocusTrapOptions;
  private previouslyFocusedElement: HTMLElement | null = null;
  private isActive = false;

  constructor(container: HTMLElement, options: FocusTrapOptions = {}) {
    this.container = container;
    this.options = {
      escapeDeactivates: true,
      clickOutsideDeactivates: true,
      ...options,
    };
  }

  activate(): void {
    if (this.isActive) return;

    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    this.isActive = true;

    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) return;

    const initialFocus = this.getInitialFocus(focusableElements);
    initialFocus?.focus();

    document.addEventListener('keydown', this.handleKeyDown);
    if (this.options.clickOutsideDeactivates) {
      document.addEventListener('click', this.handleClickOutside);
    }
  }

  deactivate(): void {
    if (!this.isActive) return;

    this.isActive = false;
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('click', this.handleClickOutside);

    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(this.container.querySelectorAll(selector)) as HTMLElement[];
  }

  private getInitialFocus(focusableElements: HTMLElement[]): HTMLElement | null {
    if (this.options.initialFocus) {
      if (typeof this.options.initialFocus === 'string') {
        return this.container.querySelector(this.options.initialFocus) as HTMLElement;
      }
      return this.options.initialFocus;
    }
    return focusableElements[0] || null;
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.isActive) return;

    if (event.key === 'Escape' && this.options.escapeDeactivates) {
      event.preventDefault();
      this.deactivate();
      return;
    }

    if (event.key === 'Tab') {
      this.handleTabKey(event);
    }
  };

  private handleTabKey(event: KeyboardEvent): void {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  private handleClickOutside = (event: Event): void => {
    if (!this.container.contains(event.target as Node)) {
      this.deactivate();
    }
  };
}

export function createFocusTrap(element: HTMLElement, options?: FocusTrapOptions): FocusTrap {
  return new FocusTrap(element, options);
}
