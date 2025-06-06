export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export const contrastHelpers = {
  hexToRgb: (hex: string): ColorRGB | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  getLuminance: (rgb: ColorRGB): number => {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  getContrastRatio: (color1: string, color2: string): number => {
    const rgb1 = contrastHelpers.hexToRgb(color1);
    const rgb2 = contrastHelpers.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;

    const lum1 = contrastHelpers.getLuminance(rgb1);
    const lum2 = contrastHelpers.getLuminance(rgb2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  },

  isWcagAACompliant: (color1: string, color2: string): boolean => {
    return contrastHelpers.getContrastRatio(color1, color2) >= 4.5;
  },

  isWcagAAACompliant: (color1: string, color2: string): boolean => {
    return contrastHelpers.getContrastRatio(color1, color2) >= 7;
  },

  isWcagAALargeTextCompliant: (color1: string, color2: string): boolean => {
    return contrastHelpers.getContrastRatio(color1, color2) >= 3;
  },

  evaluateContrast: (color1: string, color2: string) => {
    const ratio = contrastHelpers.getContrastRatio(color1, color2);
    return {
      ratio: Math.round(ratio * 100) / 100,
      wcagAA: ratio >= 4.5,
      wcagAAA: ratio >= 7,
      wcagAALarge: ratio >= 3,
      level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail'
    };
  }
};
