export type AlertVariant = 'info';

export interface AlertProps {
  children: React.ReactNode;
  variant: AlertVariant;
}