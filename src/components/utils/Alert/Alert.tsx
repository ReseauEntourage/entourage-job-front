import React from 'react';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { StyledAlert } from './Alert.styles';
import { AlertProps, AlertVariant } from './Alert.types';

interface AlertIconProps {
  variant: AlertVariant;
}

const AlertIcon = ({ variant }: AlertIconProps) => {
  return <>{variant === 'info' && <IlluBulleQuestion class="icon" />}</>;
};

export function Alert({ children, variant }: AlertProps) {
  return (
    <StyledAlert variant={variant}>
      <AlertIcon variant={variant} />
      {children}
    </StyledAlert>
  );
}

Alert.defaultProps = {
  variant: 'info',
};
