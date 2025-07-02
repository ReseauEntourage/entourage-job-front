export const BREAKPOINTS = {
  desktop: 960,
};

export const HEIGHTS = {
  HEADER: 80,
  HEADER_MOBILE: 80,
  TABS_HEIGHT_WITHOUT_NUMBERS: 55,
  TABS_HEIGHT: 79.5,
  SEARCH_BAR_HEIGHT: 52,
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
  lightGray: '#F5F5F5',
  gray: '#D9D9D9',
  mediumGray: '#A0A0A0',
  darkGray: '#6D6C6C',
  black: '#363636',
  navBlack: '#222222',

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

  // Yellow
  lightYellow: '#FFF2D7',
  yellowSport: '#FFC449',
  darkYellow: '#FFB00D',

  // Red
  lightRed: '#F1545D',
  red: '#FE2929',

  // Blue
  blueShade1: '#A1CED8',
  blueShade2: '#61BECF',
  primaryBlue: '#47A8B9',
  blueShade3: '#427F8D',
  hoverBlue: '#ECF8FB',
  lightBlueGreen: '#C1E9DF',
  blue: '#8FC4E2',
  darkBlue: '#267D8C',
  extraDarkBlue: '#2A4C72',

  // Green
  lightGreen: '#A7DB9F',
  green: '#79CC6B',
  mediumGreen: '#1E7F51',
  darkGreen: '#1F4946',
};

export type Color = keyof typeof COLORS;

export const STATUS_COLORS = {
  success: COLORS.green,
  error: COLORS.lightRed,
};

export const ALERT_COLORS = {
  info: {
    background: COLORS.hoverBlue,
    text: COLORS.black,
  },
  lightGray: {
    background: COLORS.lightGray,
    text: COLORS.black,
  },
  darkBlue: {
    background: COLORS.darkBlue,
    text: COLORS.white,
  },
};

export const FONT_WEIGHTS = {
  lighter: 'lighter',
  normal: 'normal',
  medium: '500',
  semibold: '600',
  bold: 'bold',
};
