export { colors, type ColorScale, type SemanticColors, type ColorPalette } from './colors';
export { typography, type Typography } from './typography';
export { spacing, borderRadius, type Spacing, type BorderRadius } from './spacing';
export { breakpoints, screens, type Breakpoints, type Screens } from './breakpoints';

import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius } from './spacing';
import { breakpoints, screens } from './breakpoints';

export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  breakpoints,
  screens
} as const;

export type DesignTokens = typeof designTokens;
