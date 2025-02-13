import { COLORS } from 'src/constants/styles';

export interface TextProps {
  children: React.ReactNode;
  size?: 'small' | 'normal' | 'large' | 'xlarge' | 'xxlarge' | number;
  weight?: 'normal' | 'bold';
  color?: keyof typeof COLORS;
  variant?: 'normal' | 'italic';
  center?: boolean;
}
