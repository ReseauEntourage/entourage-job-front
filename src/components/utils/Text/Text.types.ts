import { COLORS, FONT_WEIGHTS } from 'src/constants/styles';

export type TextSize =
  | 'small'
  | 'normal'
  | 'large'
  | 'xlarge'
  | 'xxlarge'
  | number;

export type TextVariant = 'normal' | 'italic' | 'underline';
export type TextWeight = keyof typeof FONT_WEIGHTS;

export interface TextProps {
  children: React.ReactNode;
  size?: TextSize;
  weight?: TextWeight;
  color?: keyof typeof COLORS;
  variant?: TextVariant;
  center?: boolean;
}
