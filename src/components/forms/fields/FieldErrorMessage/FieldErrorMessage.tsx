import React from 'react';
import { FieldError } from 'react-hook-form';
import { StyledErrorMessage } from './FieldErrorMessage.styles';

interface FieldErrorMessageProps {
  error?: FieldError;
  className?: string;
}

export const FieldErrorMessage = ({
  error,
  className,
}: FieldErrorMessageProps) => {
  if (error?.message) {
    return (
      <StyledErrorMessage className={className}>
        {error.message}
      </StyledErrorMessage>
    );
  }
  return null;
};
