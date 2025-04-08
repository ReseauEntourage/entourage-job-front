import React from 'react';

import { StyledButton } from './Button.styles';
import { ButtonProps } from './ButtonProps';

export const ButtonMock = ({
  children,
  dataTestId = '',
  rounded = false,
}: ButtonProps) => {
  return (
    <StyledButton type="button" data-testid={dataTestId} rounded={rounded}>
      {children}
    </StyledButton>
  );
};
