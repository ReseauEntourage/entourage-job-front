import React from 'react';
import { StyledErrorMessage } from 'src/components/forms/Forms.styles';

interface FormValidatorErrorMessageProps {
  validObj?: { message: string };
}

export const FormValidatorErrorMessage = ({
  validObj,
}: FormValidatorErrorMessageProps) => {
  if (validObj !== undefined && validObj.message) {
    return <StyledErrorMessage>{validObj.message}</StyledErrorMessage>;
  }
  return null;
};
