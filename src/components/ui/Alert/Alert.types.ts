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
  /**
   * Aligns the icon and the close cross to the top rather than the middle.
   * Useful as soon as the content spans several lines: centred, the icon
   * sits in the middle of a block of text instead of introducing its first
   * line.
   */
  alignTop?: boolean;
  dataTestId?: string;
}
