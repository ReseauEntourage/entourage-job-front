import { Color } from 'src/constants/styles';

export interface TextProps {
  children: React.ReactNode;
  size?: 'small' | 'normal' | 'large' | 'xlarge' | 'xxlarge';
  weight?: 'normal' | 'bold';
  color?: Color;
  variant?: 'normal' | 'italic';
  center?: boolean;
}
