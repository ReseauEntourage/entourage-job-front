import { AnyToFix } from 'src/utils/Types';

// resolsves a circular dependency issue
export interface ButtonProps {
  id?: string;
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  disabled?: boolean;
  size?: 'small' | 'large';
  rounded?: boolean | 'circle';
  // link
  href?: string | { pathname: string; query: AnyToFix };
  isExternal?: boolean;
  newTab?: boolean;
  onClick?: (e: Event) => Promise<void> | void;
  shallow?: boolean;
  scroll?: boolean;
  className?: string;
  dataTestId?: string;
}
