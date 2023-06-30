import React from 'react';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { StyledTextAreaContainer } from './TextArea.styles';

interface TextAreaProps {
  title: string;
  name: string;
  id?: string;
  onChange: (event) => void;
  value: string;
  hidden?: boolean;
  valid?: {
    isInvalid: boolean;
    message: string;
  };
}

export function TextArea({
  title,
  name,
  id,
  onChange,
  value,
  hidden,
  valid,
}: TextAreaProps) {
  if (hidden) {
    return null;
  }

  return (
    <StyledTextAreaContainer>
      <textarea
        name={name}
        id={id}
        rows={5}
        placeholder={title}
        onChange={onChange}
        value={value}
      />
      <FormValidatorErrorMessage validObj={valid} newInput />
    </StyledTextAreaContainer>
  );
}
