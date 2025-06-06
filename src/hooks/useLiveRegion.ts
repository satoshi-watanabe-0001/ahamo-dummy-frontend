import { useCallback, useEffect, useRef } from 'react';

export type LiveRegionPoliteness = 'off' | 'polite' | 'assertive';

export interface UseLiveRegionOptions {
  politeness?: LiveRegionPoliteness;
  atomic?: boolean;
  relevant?: string;
}

export const useLiveRegion = (options: UseLiveRegionOptions = {}) => {
  const {
    politeness = 'polite',
    atomic = false,
    relevant = 'additions text',
  } = options;

  const liveRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!liveRegionRef.current) return;

    const element = liveRegionRef.current;
    element.setAttribute('aria-live', politeness);
    element.setAttribute('aria-atomic', atomic.toString());
    element.setAttribute('aria-relevant', relevant);
    
    element.style.position = 'absolute';
    element.style.left = '-10000px';
    element.style.width = '1px';
    element.style.height = '1px';
    element.style.overflow = 'hidden';
  }, [politeness, atomic, relevant]);

  const announce = useCallback((message: string, urgency?: LiveRegionPoliteness) => {
    if (!liveRegionRef.current) return;

    const element = liveRegionRef.current;
    
    if (urgency && urgency !== politeness) {
      element.setAttribute('aria-live', urgency);
    }

    element.textContent = message;

    if (urgency && urgency !== politeness) {
      setTimeout(() => {
        element.setAttribute('aria-live', politeness);
      }, 100);
    }
  }, [politeness]);

  const clear = useCallback(() => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = '';
    }
  }, []);

  return {
    liveRegionRef,
    announce,
    clear,
  };
};
