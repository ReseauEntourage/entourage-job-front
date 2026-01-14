import React from 'react';

export type AlertVariant =
  | 'info'
  | 'lightGray'
  | 'darkBlue'
  | 'lightBlue'
  | 'error';

export interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  closable?: boolean;
  visible?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  rounded?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}
