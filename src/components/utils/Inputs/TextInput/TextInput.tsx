import React, { ChangeEvent } from 'react';
import { StyledInputLabel } from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage/FieldErrorMessage';
import {
  StyledAnnotations,
  StyledLengthLimit,
  StyledTextInputContainer,
} from './TextInput.styles';

interface TextInputProps extends CommonInputProps<string, HTMLInputElement> {
  maxLength?: number;
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
  maxLength,
  showLabel = false,
  hidden = false,
  disabled = false,
  inputRef,
  error,
}: TextInputProps) {
  if (hidden) {
    return null;
  }

  const remainingCharacters = maxLength - value.length;

  return (
    <StyledTextInputContainer>
      {showLabel && (
        <StyledInputLabel htmlFor={`form-input-${name}`}>
          {title}
        </StyledInputLabel>
      )}
      <input
        ref={inputRef}
        value={value || ''}
        className={`${value ? '' : 'empty-value'} ${style || ''}`}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        onBlur={onBlur}
        disabled={disabled}
        type={type || 'text'}
        placeholder={placeholder || (title as string)}
        name={name}
        maxLength={maxLength}
        id={id}
        data-testid={id}
      />
      <StyledAnnotations>
        <div>
          <FieldErrorMessage error={error} />
        </div>
        {maxLength && (
          <StyledLengthLimit warning={remainingCharacters === 0}>
            {remainingCharacters} caractère(s) restant(s)
          </StyledLengthLimit>
        )}
      </StyledAnnotations>
    </StyledTextInputContainer>
  );
}
