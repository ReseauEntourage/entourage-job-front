import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { Text } from '@/src/components/ui';
import { COLORS } from '@/src/constants/styles';
import { ButtonIcon } from '../Button';
import { LucidIcon } from '../Icons/LucidIcon';
import {
  ALERT_COLORS,
  StyledAlert,
  StyledAlertContainer,
  StyledIconContainer,
} from './Alert.styles';
import { AlertProps, AlertType } from './Alert.types';

interface AlertIconProps {
  type: AlertType;
}

const DefaultAlertIcon = ({ type }: AlertIconProps) => {
  if (type === AlertType.Info) {
    return <SvgIcon name="IlluBulleQuestion" width={35} height={30} />;
  }

  return null;
};

export const Alert = ({
  rounded = true,
  variant = 'filled',
  type = AlertType.Info,
  closable = false,
  visible = true,
  onClose = () => {},
  icon = <DefaultAlertIcon type={type} />,
  clickable = false,
  onClick,
  title,
  children,
  iconInContainer = false,
}: AlertProps) => {
  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const resizedIcon = React.isValidElement(icon)
    ? React.cloneElement(
        icon as React.ReactElement<{
          width?: number;
          height?: number;
          color?: string;
        }>,
        {
          width: 30,
          height: 30,
          color: COLORS.extraDarkGray,
        }
      )
    : icon;

  return (
    <StyledAlert
      $variant={variant}
      $type={type}
      $visible={visible}
      $rounded={rounded}
      $clickable={clickable && !!onClick}
      onClick={handleClick}
    >
      <StyledIconContainer $iconInContainer={iconInContainer}>
        {resizedIcon}
      </StyledIconContainer>

      <StyledAlertContainer>
        {title && (
          <Text
            weight="semibold"
            color={COLORS[ALERT_COLORS[type]?.title || 'black']}
          >
            {title}
          </Text>
        )}
        {children}
      </StyledAlertContainer>
      {closable && (
        <div
          onClick={(e) => {
            // Empêche le clic du bouton de déclencher aussi le onClick de l'Alert
            e.stopPropagation();
          }}
        >
          <ButtonIcon
            icon={
              <LucidIcon name="X" color={ALERT_COLORS[type]?.text || 'black'} />
            }
            onClick={onClose}
            variant="text"
          />
        </div>
      )}
    </StyledAlert>
  );
};
