export interface TextProps {
  children: React.ReactNode;
  size?: 'small' | 'normal' | 'large';
  weight?: 'normal' | 'bold';
  color?: 'lighter' | 'light' | 'normal' | 'blue' | 'white' | 'lightRed';
  variant?: 'normal' | 'italic';
  center?: boolean;
}