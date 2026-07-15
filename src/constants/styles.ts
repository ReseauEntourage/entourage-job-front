export const BREAKPOINTS = {
  desktop: 960,
};

export const HEIGHTS = {
  HEADER: 80,
  HEADER_MOBILE: 80,
  TABS_HEIGHT_WITHOUT_NUMBERS: 55,
  TABS_HEIGHT: 79.5,
  DEFAULT_SECTION_PADDING: 50,
  SECTION_PADDING: 24,
  SECTION_PADDING_MOBILE: 12,
  MESSAGING_DESKTOP_BORDER_SIZE: 3,
};

export const COLORS = {
  // B&W colors
  transparent: 'transparent',
  white: '#FFFFFF',
  hoverWhite: '#f2f2f2',
  extraLightGray: '#F2F2F2',
  lightGray: '#F5F5F5',
  gray: '#D9D9D9',
  mediumGray: '#A0A0A0',
  darkGray: '#6D6C6C',
  extraDarkGray: '#222222',
  black: '#363636',

  // Brown
  lightBrownGray: '#918080',
  extraLightBrown: '#FFB096',
  lightBrown: '#BB826B',
  mediumBrown: '#A65E48',
  brown: '#653825',
  darkBrown: '#20090A',

  // Orange
  extraExtraLightOrange: '#FFF8F6',
  extraLightOrange: '#FEEAE3',
  lightOrange: '#FDDCD0',
  mediumOrange: '#FF9C5D',
  orangeLocal: '#FF9739',
  orangeSocial: '#F55F24',
  darkOrange: '#D53F00',
  warning: '#D53F00',

  // Yellow
  lightYellow: '#FFF2D7',
  yellowSport: '#FFC449',
  darkYellow: '#FFB00D',
  extraLightAmber: '#fff3e0',
  amber: '#92400e',

  // Red
  lightRed: '#F1545D',
  extraLightRed: '#FEEAEA',
  red: '#FE2929',

  // Blue
  blueShade1: '#A1CED8',
  blueShade2: '#61BECF',
  primaryBlue: '#47A8B9',
  blueShade3: '#427F8D',
  hoverBlue: '#EEF8FA',
  lightBlueGreen: '#C1E9DF',
  blue: '#8FC4E2',
  darkBlue: '#2D7FA6',
  extraDarkBlue: '#1A5670',
  shadowDarkBlue1: '#277690',
  shadowDarkBlue2: '#1A5670',
  extraLightTeal: '#e8f6f8',
  teal: '#1a7a94',
  photoGradientBlue1: '#2A7286',
  photoGradientBlue2: '#1C5468',
  photoGradientBlue3: '#164A5E',
  photoOverlayBlue1: 'rgba(20, 62, 76, 0.32)',
  photoOverlayBlue2: 'rgba(24, 72, 90, 0.62)',
  photoOverlayBlue3: '#184C60',

  // Green
  lightGreen: '#A7DB9F',
  extraLightGreen: '#D4FFCE',
  green: '#79CC6B',
  mediumGreen: '#1E7F51',
  darkGreen: '#1F4946',

  // Purple
  extraLightPurple: '#ede9fe',
  purple: '#4c2ea0',

  // Skeleton
  skeletonDark: '#36363636',
  skeletonDarkShimmer: '#4D4D4D36',
  skeletonLight: '#EDEDED36',
  skeletonLightShimmer: '#F7F7F736',

  cardShadow: '#0000000D',
  overlayWhite: '#FFFFFFCC',

  // Brand
  linkedInBlue: '#0077B7',
  whatsAppGreen: '#25D366',
};

export type Color = keyof typeof COLORS;

export const STATUS_COLORS = {
  success: COLORS.green,
  error: COLORS.lightRed,
};

export const FONT_WEIGHTS = {
  lighter: 'lighter',
  normal: 'normal',
  medium: '500',
  semibold: '600',
  bold: 'bold',
};
