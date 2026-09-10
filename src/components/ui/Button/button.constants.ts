import { COLORS } from '@/src/constants/styles';

export const BUTTON_SIZES = {
  small: {
    fontSize: 11,
    padding: '9px 18px',
    paddingCircle: '0px',
    iconSize: 14,
  },
  medium: {
    fontSize: 12,
    padding: '10px 20px',
    paddingCircle: '6px',
    iconSize: 20,
  },
  large: {
    fontSize: 16,
    padding: '16px 32px',
    paddingCircle: '9px',
    iconSize: 24,
  },
  xlarge: {
    fontSize: 18,
    padding: '20px 40px',
    paddingCircle: '12px',
    iconSize: 28,
  },
  xxlarge: {
    fontSize: 20,
    padding: '24px 48px',
    paddingCircle: '15px',
    iconSize: 32,
  },
} as const;

export const BUTTON_ROUNDED_RADIUS = '20px';
export const BUTTON_CIRCLE_RADIUS = '50%';
export const BUTTON_DEFAULT_RADIUS = '5px';

export const BUTTON_STYLES = {
  border: {
    default: COLORS.gray,
    primary: COLORS.primaryBlue,
    secondary: COLORS.primaryBlue,
    text: 'transparent',
    heroPrimary: COLORS.darkTeal,
  },
  borderSize: {
    default: '1px',
    primary: '1px',
    secondary: '1px',
    text: '0px',
    heroPrimary: '1px',
  },
  backgroundColor: {
    default: COLORS.white,
    primary: COLORS.primaryBlue,
    secondary: COLORS.white,
    text: 'transparent',
    hoverBlue: COLORS.hoverBlue,
    heroPrimary: COLORS.darkTeal,
  },
  color: {
    default: COLORS.black,
    primary: COLORS.white,
    secondary: COLORS.primaryBlue,
    text: COLORS.black,
    hoverBlue: COLORS.darkBlue,
    heroPrimary: COLORS.white,
  },
  hoverBackgroundColor: {
    default: COLORS.hoverWhite,
    primary: COLORS.darkBlue,
    secondary: COLORS.hoverBlue,
    hoverBlue: COLORS.darkBlue,
    text: 'transparent',
    heroPrimary: COLORS.extraDarkBlue,
  },
  hoverColor: {
    default: COLORS.primaryBlue,
    primary: COLORS.white,
    secondary: COLORS.primaryBlue,
    text: COLORS.black,
    hoverBlue: COLORS.white,
    heroPrimary: COLORS.white,
  },
  hoverBorder: {
    default: COLORS.primaryBlue,
    primary: COLORS.darkBlue,
    secondary: COLORS.primaryBlue,
    text: 'none',
    heroPrimary: COLORS.extraDarkBlue,
  },
};
