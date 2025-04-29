import { COLORS, FONT_WEIGHTS } from 'src/constants/styles';

export type TextSize =
  | 'xsmall'
  | 'small'
  | 'normal'
  | 'large'
  | 'xlarge'
  | 'xxlarge'
  | number;

export type TextVariant = 'normal' | 'italic' | 'underline';
export type TextWeight = keyof typeof FONT_WEIGHTS;
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface TextProps {
  children: React.ReactNode;
  size?: TextSize;
  weight?: TextWeight;
  color?: keyof typeof COLORS;
  variant?: TextVariant;
  center?: boolean;
  textAlign?: TextAlign;
}
