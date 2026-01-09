import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { ButtonIcon } from '../Button';
import { LucidIcon } from '../Icons/LucidIcon';
import { StyledAlert, StyledAlertContainer } from './Alert.styles';
import { AlertProps, AlertVariant } from './Alert.types';

interface AlertIconProps {
  variant: AlertVariant;
}

const DefaultAlertIcon = ({ variant }: AlertIconProps) => {
  if (variant === 'info') {
    return <SvgIcon name="IlluBulleQuestion" width={35} height={30} />;
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
  icon = <DefaultAlertIcon variant={variant} />,
  clickable = false,
  onClick,
}: AlertProps) => {
  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  return (
    <StyledAlert
      variant={variant}
      visible={visible}
      rounded={rounded}
      clickable={clickable && !!onClick}
      onClick={handleClick}
    >
      {icon}
      <StyledAlertContainer>{children}</StyledAlertContainer>
      {closable && (
        <div
          onClick={(e) => {
            // Empêche le clic du bouton de déclencher aussi le onClick de l'Alert
            e.stopPropagation();
          }}
        >
          <ButtonIcon
            icon={
              <LucidIcon
                name="X"
                {...(variant === 'darkBlue'
                  ? { color: 'white', stroke: 'bold' }
                  : {})}
              />
            }
            onClick={onClose}
          />
        </div>
      )}
    </StyledAlert>
  );
};
