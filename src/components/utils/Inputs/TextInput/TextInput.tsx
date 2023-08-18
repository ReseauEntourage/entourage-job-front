import React, { ChangeEvent } from 'react';
import { StyledErrorMessage } from '../../../forms/fields/FieldErrorMessage/FieldErrorMessage.styles';
import {
  StyledAnnotations,
  StyledAnnotationsErrorMessage,
  StyledInputLabel,
  StyledLimit,
} from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage/FieldErrorMessage';
import { StyledTextInputContainer } from './TextInput.styles';

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

  const remainingCharacters = (maxLength || 0) - (value || '').length;

  return (
    <StyledTextInputContainer disabled={disabled}>
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
      {maxLength ? (
        <StyledAnnotations>
          <div>
            <StyledAnnotationsErrorMessage error={error} />
          </div>
          <StyledLimit warning={remainingCharacters === 0}>
            {remainingCharacters} caractère(s) restant(s)
          </StyledLimit>
        </StyledAnnotations>
      ) : (
        <FieldErrorMessage error={error} />
      )}
    </StyledTextInputContainer>
  );
}
