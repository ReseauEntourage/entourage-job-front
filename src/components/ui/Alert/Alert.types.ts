import React from 'react';

export enum AlertVariant {
  Info = 'info',
  LightGray = 'lightGray',
  DarkBlue = 'darkBlue',
  LightBlue = 'lightBlue',
  White = 'white',
  Error = 'error',
}

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
