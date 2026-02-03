import { COLORS } from '@/src/constants/styles';

export const BUTTON_SIZES = {
  small: {
    fontSize: 13,
    padding: '6px 10px',
    iconSize: 14,
  },
  medium: {
    fontSize: 14,
    padding: '11px 19px',
    iconSize: 20,
  },
  large: {
    fontSize: 16,
    padding: '16px 32px',
    iconSize: 24,
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
  },
  borderSize: {
    default: '1px',
    primary: '1px',
    secondary: '1px',
    text: '0px',
  },
  backgroundColor: {
    default: COLORS.white,
    primary: COLORS.primaryBlue,
    secondary: COLORS.white,
    text: 'transparent',
  },
  color: {
    default: COLORS.black,
    primary: COLORS.white,
    secondary: COLORS.primaryBlue,
    text: COLORS.black,
  },
  hoverBackgroundColor: {
    default: COLORS.hoverWhite,
    primary: COLORS.darkBlue,
    secondary: COLORS.hoverBlue,
    text: 'transparent',
  },
  hoverColor: {
    default: COLORS.primaryBlue,
    primary: COLORS.white,
    secondary: COLORS.primaryBlue,
    text: COLORS.black,
  },
  hoverBorder: {
    default: COLORS.primaryBlue,
    primary: COLORS.darkBlue,
    secondary: COLORS.primaryBlue,
    text: 'none',
  },
};
