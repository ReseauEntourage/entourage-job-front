import React from 'react';
import { FieldError } from 'react-hook-form';
import { StyledErrorMessage } from 'src/components/forms/Forms.styles';

interface FormValidatorErrorMessageProps {
  error?: FieldError;
}

export const FormValidatorErrorMessage = ({
  error,
}: FormValidatorErrorMessageProps) => {
  if (error?.message) {
    return <StyledErrorMessage>{error.message}</StyledErrorMessage>;
  }
  return null;
};
