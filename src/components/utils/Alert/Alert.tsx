import React from 'react';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { ButtonIcon } from '../ButtonIcon';
import { LucidIcon } from '../Icons/LucidIcon';
import { StyledAlert, StyledAlertContainer } from './Alert.styles';
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
  icon = <AlertIcon variant={variant} />,
}: AlertProps) => {
  return (
    <StyledAlert variant={variant} visible={visible}>
      {icon}
      <StyledAlertContainer>{children}</StyledAlertContainer>
      {closable && (
        <ButtonIcon icon={<LucidIcon name="X" />} onClick={onClose} />
      )}
    </StyledAlert>
  );
};
