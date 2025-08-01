export type AlertVariant = 'info' | 'lightGray' | 'darkBlue' | 'lightBlue';

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
