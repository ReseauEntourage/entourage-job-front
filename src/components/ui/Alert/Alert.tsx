import React from 'react';
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
    return <LucidIcon name="Info" />;
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
    ? (() => {
        const iconElement = icon as React.ReactElement<{
          width?: number;
          height?: number;
          size?: number;
          color?: string;
        }>;

        const nextProps =
          iconElement.type === LucidIcon
            ? {
                size: iconElement.props.size ?? 30,
                color: iconElement.props.color ?? COLORS.extraDarkGray,
              }
            : {
                width: iconElement.props.width ?? 30,
                height: iconElement.props.height ?? 30,
                color: iconElement.props.color ?? COLORS.extraDarkGray,
              };

        return React.cloneElement(iconElement, nextProps);
      })()
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
            color={COLORS[ALERT_COLORS[type]?.title] || 'black'}
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
              <LucidIcon
                name="X"
                color={COLORS[ALERT_COLORS[type]?.text] || 'black'}
              />
            }
            onClick={onClose}
            variant="text"
          />
        </div>
      )}
    </StyledAlert>
  );
};
