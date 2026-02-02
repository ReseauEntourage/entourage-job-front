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
  return (
    <StyledErrorMessage className={className}>
      <span>{error?.message ? error.message : ''}</span>
    </StyledErrorMessage>
  );
};
