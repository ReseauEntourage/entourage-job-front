import React from 'react';

export enum AlertType {
  Info = 'info',
  Info2 = 'info2',
  Neutral = 'neutral',
  NeutralWhite = 'neutralWhite',
  Error = 'error',
  Success = 'success',
  Warning = 'warning',
}

export type AlertVariant = 'outlined' | 'filled' | 'dashed';

export interface AlertProps {
  children: React.ReactNode;
  title?: string;
  variant?: AlertVariant;
  type?: AlertType;
  closable?: boolean;
  visible?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  rounded?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  iconInContainer?: boolean;
  center?: boolean;
}
