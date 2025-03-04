import { COLORS } from 'src/constants/styles';

export type TextSize =
  | 'xsmall'
  | 'small'
  | 'normal'
  | 'large'
  | 'xlarge'
  | 'xxlarge'
  | number;

export type TextVariant = 'normal' | 'italic' | 'underline';

export interface TextProps {
  children: React.ReactNode;
  size?: TextSize;
  weight?: 'normal' | 'bold';
  color?: keyof typeof COLORS;
  variant?: TextVariant;
  center?: boolean;
}
