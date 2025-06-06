import { useState, useEffect, useCallback } from 'react';

const HIGH_CONTRAST_KEY = 'high-contrast-mode';

export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    const stored = localStorage.getItem(HIGH_CONTRAST_KEY);
    if (stored !== null) {
      return JSON.parse(stored);
    }
    
    return window.matchMedia('(prefers-contrast: high)').matches;
  });

  const toggleHighContrast = useCallback(() => {
    setIsHighContrast((prev: boolean) => {
      const newValue = !prev;
      
      localStorage.setItem(HIGH_CONTRAST_KEY, JSON.stringify(newValue));
      
      if (newValue) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      
      return newValue;
    });
  }, []);

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(HIGH_CONTRAST_KEY);
      if (stored === null) {
        setIsHighContrast(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    isHighContrast,
    toggleHighContrast,
  };
};
