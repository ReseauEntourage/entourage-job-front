import React from 'react';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { ButtonIcon } from '../Button';
import { LucidIcon } from '../Icons/LucidIcon';
import { StyledAlert, StyledAlertContainer } from './Alert.styles';
import { AlertProps, AlertVariant } from './Alert.types';

interface AlertIconProps {
  variant: AlertVariant;
}

const AlertIcon = ({ variant }: AlertIconProps) => {
  if (variant === 'info') {
    return <IlluBulleQuestion width={35} height={30} />;
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
      {closable && (
        <ButtonIcon
          icon={
            <LucidIcon
              name="X"
              {...(variant === 'feedback'
                ? { color: 'white', stroke: 'bold' }
                : {})}
            />
          }
          onClick={onClose}
        />
      )}
    </StyledAlert>
  );
};
