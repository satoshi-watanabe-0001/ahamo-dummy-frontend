export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

export const screens = {
  mobile: { max: '767px' },
  tablet: { min: '768px', max: '1023px' },
  desktop: { min: '1024px' }
} as const;

export type Breakpoints = typeof breakpoints;
export type Screens = typeof screens;
