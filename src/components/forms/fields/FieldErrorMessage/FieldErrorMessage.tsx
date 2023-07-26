import React from 'react';
import { FieldError } from 'react-hook-form';
import { StyledErrorMessage } from './FormErrorMessage.styles';

interface FieldErrorMessageProps {
  error?: FieldError;
}

export const FieldErrorMessage = ({ error }: FieldErrorMessageProps) => {
  if (error?.message) {
    return <StyledErrorMessage>{error.message}</StyledErrorMessage>;
  }
  return null;
};
