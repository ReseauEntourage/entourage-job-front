import React from 'react';
import CloseIcon from 'assets/icons/close.svg';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { ButtonIcon } from '../ButtonIcon';
import { StyledAlert, StyledAlertContainer } from './Alert.styles';
import { AlertProps, AlertVariant } from './Alert.types';

interface AlertIconProps {
  variant: AlertVariant;
}

const AlertIcon = ({ variant }: AlertIconProps) => {
  if (variant === 'info') {
    return <IlluBulleQuestion />;
  }
  return null;
};

export const Alert = ({
  children,
  rounded = true,
  variant = 'info',
  closable = false,
  visible = true,
  onClose = () => {},
  icon = <AlertIcon variant={variant} />,
}: AlertProps) => {
  return (
    <StyledAlert variant={variant} visible={visible} rounded={rounded}>
      {icon}
      <StyledAlertContainer>{children}</StyledAlertContainer>
      {closable && <ButtonIcon icon={<CloseIcon />} onClick={onClose} />}
    </StyledAlert>
  );
};
