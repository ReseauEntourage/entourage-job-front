import React from 'react';

import { ButtonProps, getButtonClassBuffer } from './Button';
import { StyledButtonMock } from './Button.styles';

export const ButtonMock = ({
  visible,
  children,
  className,
  disabled = false,
  style = 'custom-primary',
  size = 'large',
  widths = [],
  dataTestId = '',
  color = 'primaryOrange',
}: ButtonProps) => {
  const classBuffer = getButtonClassBuffer({
    visible,
    className,
    disabled,
    style,
    size,
    widths,
  });

  return (
    <StyledButtonMock
      className={classBuffer}
      type="button"
      data-testid={dataTestId}
      color={color}
    >
      {children}
    </StyledButtonMock>
  );
};
