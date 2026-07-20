import React, { ReactNode } from 'react';
import { FieldError } from 'react-hook-form';
import { StyledErrorMessage } from './FieldErrorMessage.styles';

interface FieldErrorMessageProps {
  error?: FieldError;
  className?: string;
  children?: ReactNode;
}

export const FieldErrorMessage = ({
  error,
  className,
  children,
}: FieldErrorMessageProps) => {
  return (
    <StyledErrorMessage className={className}>
      <span>
        {error?.message ? error.message : ''}
        {children}
      </span>
    </StyledErrorMessage>
  );
};
