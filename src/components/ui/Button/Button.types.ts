import React from 'react';
import { Color } from '@/src/constants/styles';
import { AnyToFix } from 'src/utils/Types';

export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'text';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  id?: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  size?: ButtonSize;
  rounded?: boolean | 'circle';
  href?: string | { pathname: string; query?: AnyToFix };
  isExternal?: boolean;
  newTab?: boolean;
  onClick?: (e: Event) => Promise<void> | void;
  shallow?: boolean;
  scroll?: boolean;
  className?: string;
  dataTestId?: string;
  color?: Color;
  style?: React.CSSProperties;
  prependIcon?: React.ReactNode;
  appendIcon?: React.ReactNode;
}
