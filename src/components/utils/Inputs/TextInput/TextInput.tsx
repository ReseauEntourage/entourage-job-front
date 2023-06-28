import React, { ChangeEvent } from 'react';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { StyledTextInputContainer } from './TextInput.styles';

interface TextInputProps {
  id: string;
  title?: string;
  value: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder: string;
  showLabel?: boolean;
  valid?: {
    isInvalid: boolean;
    message: string;
  };
  hidden?: boolean;
  style: string;
}

export function TextInput({
  onChange,
  valid,
  title = '',
  id = '',
  value = '',
  type = 'text',
  name = '',
  placeholder = '',
  showLabel = false,
  hidden = false,
  style = '',
}: TextInputProps) {
  if (hidden) {
    return null;
  }

  return (
    <StyledTextInputContainer>
      {showLabel && <label htmlFor={`form-input-${name}`}>{title}</label>}
      <input
        value={value}
        className={`${value ? '' : 'empty-value'} ${style}`}
        onChange={onChange}
        type={type || 'text'}
        placeholder={placeholder || title}
        name={name}
        id={id}
        data-testid={id}
      />
      <FormValidatorErrorMessage validObj={valid} newInput />
    </StyledTextInputContainer>
  );
}
