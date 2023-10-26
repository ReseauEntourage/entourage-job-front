export const BREAKPOINTS = {
  desktop: 960,
};

export const HEIGHTS = {
  HEADER: 80,
  HEADER_MOBILE: 80,
  TABS_HEIGHT: 150,
  TABS_HEIGHT_MOBILE: 125,
  OFFER_CTA_HEIGHT: 30,
  SECTION_PADDING: 24,
  SECTION_PADDING_MOBILE: 12,
};

export const HEIGHTS_ADMIN = {
  ...HEIGHTS,
  TABS_HEIGHT: 170,
};

export const COLORS = {
  lightgray: '#F5F5F5',
  gray: '#D9D9D9',
  darkGray: '#A0A0A0',
  darkGrayFont: '#6D6C6C',
  black: '#363636',
  primaryOrange: '#F55F24',
  hoverOrange: 'rgba(245,95,36,0.13)',
  darkOrange: '#d53f00',
  yesGreen: '#79CC6B',
  noRed: '#FE2929',
  wheat: '#FFF8F6',
  white: '#FFF',
  yellow: '#F89D34',
  cvStatus: {
    none: {
      border: '#F5F5F5',
      background: 'white',
    },
    new: {
      border: '#8FC4E2',
      background: 'white',
    },
    draft: {
      border: '#A0A0A0',
      background: '#A0A0A0',
    },
    progress: {
      border: '#8FC4E2',
      background: '#8FC4E2',
    },
    pending: {
      border: '#F55F24',
      background: '#F55F24',
    },
    published: {
      border: '#A7DB9F',
      background: '#A7DB9F',
    },
  },
};
