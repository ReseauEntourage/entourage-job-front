import React from 'react';
import CloseIcon from 'assets/icons/close.svg';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { ButtonIcon } from '../ButtonIcon';
import { StyledAlert } from './Alert.styles';
import { AlertProps, AlertVariant } from './Alert.types';

interface AlertIconProps {
  variant: AlertVariant;
}

const AlertIcon = ({ variant }: AlertIconProps) => {
  return <>{variant === 'info' && <IlluBulleQuestion class="icon" />}</>;
};

export const Alert = ({
  children,
  variant = 'info',
  closable = false,
  visible = true,
  onClose = () => {},
}: AlertProps) => {
  return (
    <StyledAlert variant={variant} visible={visible}>
      <AlertIcon variant={variant} />
      {children}
      {closable && <ButtonIcon icon={<CloseIcon />} onClick={onClose} />}
    </StyledAlert>
  );
};
