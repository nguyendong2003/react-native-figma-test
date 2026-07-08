/**
 * Figma Paint Styles mapped directly to hex values.
 */
export const FigmaColors = {
  primary1: '#3629b7',
  primary2: '#5655b9',
  primary3: '#a8a3d7',
  primary4: '#f2f1f9',
  neutral1: '#343434',
  neutral2: '#898989',
  neutral3: '#989898',
  neutral4: '#cacaca',
  neutral5: '#e0e0e0',
  neutral6: '#ffffff',
  semantic1: '#ff4267',
  semantic2: '#0890fe',
  semantic3: '#ffaf2a',
  semantic4: '#52d5ba',
  semantic5: '#fb6b18',
} as const;

/**
 * Semantic theme colors for Light and Dark modes.
 */
export const Colors = {
  light: {
    primary: FigmaColors.primary1,
    primaryLight: FigmaColors.primary4,
    background: FigmaColors.neutral6,
    surface: FigmaColors.neutral6,
    text: FigmaColors.neutral1,
    textMuted: FigmaColors.neutral2,
    border: FigmaColors.neutral5,
    placeholder: FigmaColors.neutral4,
    success: FigmaColors.semantic4,
    error: FigmaColors.semantic1,
    warning: FigmaColors.semantic3,
    info: FigmaColors.semantic2,
    accent: FigmaColors.semantic5,
    
    // Direct token access
    primary1: FigmaColors.primary1,
    primary2: FigmaColors.primary2,
    primary3: FigmaColors.primary3,
    primary4: FigmaColors.primary4,
    neutral1: FigmaColors.neutral1,
    neutral2: FigmaColors.neutral2,
    neutral3: FigmaColors.neutral3,
    neutral4: FigmaColors.neutral4,
    neutral5: FigmaColors.neutral5,
    neutral6: FigmaColors.neutral6,
    semantic1: FigmaColors.semantic1,
    semantic2: FigmaColors.semantic2,
    semantic3: FigmaColors.semantic3,
    semantic4: FigmaColors.semantic4,
    semantic5: FigmaColors.semantic5,
  },
  dark: {
    primary: FigmaColors.primary2,
    primaryLight: FigmaColors.neutral1,
    background: FigmaColors.neutral1,
    surface: '#1e1e1e',
    text: FigmaColors.neutral6,
    textMuted: FigmaColors.neutral3,
    border: FigmaColors.neutral2,
    placeholder: FigmaColors.neutral3,
    success: FigmaColors.semantic4,
    error: FigmaColors.semantic1,
    warning: FigmaColors.semantic3,
    info: FigmaColors.semantic2,
    accent: FigmaColors.semantic5,

    // Direct token access
    primary1: FigmaColors.primary1,
    primary2: FigmaColors.primary2,
    primary3: FigmaColors.primary3,
    primary4: FigmaColors.primary4,
    neutral1: FigmaColors.neutral1,
    neutral2: FigmaColors.neutral2,
    neutral3: FigmaColors.neutral3,
    neutral4: FigmaColors.neutral4,
    neutral5: FigmaColors.neutral5,
    neutral6: FigmaColors.neutral6,
    semantic1: FigmaColors.semantic1,
    semantic2: FigmaColors.semantic2,
    semantic3: FigmaColors.semantic3,
    semantic4: FigmaColors.semantic4,
    semantic5: FigmaColors.semantic5,
  },
} as const;

/**
 * Typography configurations mapping Figma Text Styles.
 * Note: fontFamily is weight-specific to support both iOS and Android perfectly.
 * We do not use fontWeight here since custom weight-specific fonts are loaded.
 */
export const Typography = {
  title1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    lineHeight: 28,
  },
  title2: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    lineHeight: 28,
  },
  title3: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
  caption1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    lineHeight: 16,
  },
  caption2: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  body1: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  body3: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 21,
  },
} as const;

/**
 * Shadow presets parsed from Figma Drop Shadow styles.
 */
export const Shadows = {
  tabBar: {
    shadowColor: 'rgba(54, 41, 183, 0.07)',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.07,
    shadowRadius: 30,
    elevation: 4,
  },
  card1: {
    shadowColor: 'rgba(54, 41, 183, 0.07)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 30,
    elevation: 4,
  },
  card2: {
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 4,
  },
} as const;
