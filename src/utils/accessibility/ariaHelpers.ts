export const ariaHelpers = {
  generateId: (prefix = 'aria'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  addDescribedBy: (element: HTMLElement, id: string): void => {
    const current = element.getAttribute('aria-describedby');
    const ids = current ? current.split(' ') : [];
    if (!ids.includes(id)) {
      ids.push(id);
      element.setAttribute('aria-describedby', ids.join(' '));
    }
  },

  removeDescribedBy: (element: HTMLElement, id: string): void => {
    const current = element.getAttribute('aria-describedby');
    if (!current) return;
    
    const ids = current.split(' ').filter(existingId => existingId !== id);
    if (ids.length > 0) {
      element.setAttribute('aria-describedby', ids.join(' '));
    } else {
      element.removeAttribute('aria-describedby');
    }
  },

  addLabelledBy: (element: HTMLElement, id: string): void => {
    const current = element.getAttribute('aria-labelledby');
    const ids = current ? current.split(' ') : [];
    if (!ids.includes(id)) {
      ids.push(id);
      element.setAttribute('aria-labelledby', ids.join(' '));
    }
  },

  removeLabelledBy: (element: HTMLElement, id: string): void => {
    const current = element.getAttribute('aria-labelledby');
    if (!current) return;
    
    const ids = current.split(' ').filter(existingId => existingId !== id);
    if (ids.length > 0) {
      element.setAttribute('aria-labelledby', ids.join(' '));
    } else {
      element.removeAttribute('aria-labelledby');
    }
  },

  setExpanded: (element: HTMLElement, expanded: boolean): void => {
    element.setAttribute('aria-expanded', expanded.toString());
  },

  setSelected: (element: HTMLElement, selected: boolean): void => {
    element.setAttribute('aria-selected', selected.toString());
  },

  setPressed: (element: HTMLElement, pressed: boolean): void => {
    element.setAttribute('aria-pressed', pressed.toString());
  },

  setChecked: (element: HTMLElement, checked: boolean | 'mixed'): void => {
    element.setAttribute('aria-checked', checked.toString());
  },

  setDisabled: (element: HTMLElement, disabled: boolean): void => {
    element.setAttribute('aria-disabled', disabled.toString());
    if (disabled) {
      element.setAttribute('tabindex', '-1');
    } else {
      element.removeAttribute('tabindex');
    }
  },

  setInvalid: (element: HTMLElement, invalid: boolean): void => {
    element.setAttribute('aria-invalid', invalid.toString());
  },

  setRequired: (element: HTMLElement, required: boolean): void => {
    element.setAttribute('aria-required', required.toString());
  },

  setLive: (element: HTMLElement, politeness: 'off' | 'polite' | 'assertive'): void => {
    element.setAttribute('aria-live', politeness);
  },

  setAtomic: (element: HTMLElement, atomic: boolean): void => {
    element.setAttribute('aria-atomic', atomic.toString());
  },

  hide: (element: HTMLElement): void => {
    element.setAttribute('aria-hidden', 'true');
  },

  show: (element: HTMLElement): void => {
    element.removeAttribute('aria-hidden');
  },
};
