import React, { ChangeEvent } from 'react';
import { StyledInputLabel } from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { StyledTextInputContainer } from './TextInput.styles';

interface TextInputProps extends CommonInputProps<string, HTMLInputElement> {
  type?: string;
  style?: 'secondary';
}

export function TextInput({
  id,
  name,
  title,
  placeholder,
  value,
  onChange,
  onBlur,
  type = 'text',
  style,
  showLabel = false,
  hidden = false,
  inputRef,
  error,
}: TextInputProps) {
  if (hidden) {
    return null;
  }

  return (
    <StyledTextInputContainer>
      {showLabel && (
        <StyledInputLabel htmlFor={`form-input-${name}`}>
          {title}
        </StyledInputLabel>
      )}
      <input
        ref={inputRef}
        value={value}
        className={`${value ? '' : 'empty-value'} ${style || ''}`}
        onChange={onChange}
        onBlur={onBlur}
        type={type || 'text'}
        placeholder={placeholder || title}
        name={name}
        id={id}
        data-testid={id}
      />
      <FormValidatorErrorMessage error={error} />
    </StyledTextInputContainer>
  );
}
