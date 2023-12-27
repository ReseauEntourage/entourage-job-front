import React from 'react';
import {
  UIKIT_BUTTON_SIZES,
  UIKIT_BUTTON_STYLES_SPEC,
} from 'src/components/variables';
import { StyledButtonMock } from './Button.styles';

interface ButtonMockProps {
  style?: UIKIT_BUTTON_STYLES_SPEC | '';
  children: React.ReactNode;
  size?: UIKIT_BUTTON_SIZES;
  color?: string;
  className?: string;
  dataTestId?: string;
}

export const ButtonMock = ({
  children,
  style = 'custom-primary',
  size = 'large',
  color = 'primaryOrange',
  dataTestId = '',
  className = '',
}: ButtonMockProps) => {
  let classBuffer = '';
  if (style && style.includes('custom')) {
    classBuffer = style;
    if (size) classBuffer += ` ${size}`;
    if (className) classBuffer += ` ${className}`;
  }
  return (
    <StyledButtonMock
      color={color}
      className={classBuffer}
      data-testid={dataTestId}
    >
      {children}
    </StyledButtonMock>
  );
};
