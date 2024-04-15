import React, { ChangeEvent, useCallback, useState } from 'react';
import { EyeHidden, EyeVisible } from 'assets/icons/icons';
import { ButtonIcon } from '../../ButtonIcon';
import {
  StyledAnnotations,
  StyledAnnotationsErrorMessage,
  StyledInputLabel,
  StyledLimit,
} from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage/FieldErrorMessage';
import {
  StyledTextInputGroupForm,
  StyledTextInputWrapper,
  StyledEyeIconWrapper,
} from './TextInput.styles';

interface TextInputProps extends CommonInputProps<string, HTMLInputElement> {
  maxLength?: number;
  type?: 'text' | 'password' | 'email';
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
  const [contextType, setContextType] = useState(type);
  const isPasswordContextType = useCallback(() => {
    return contextType === 'password';
  }, [contextType]);
  const toggleType = () => {
    setContextType(isPasswordContextType() ? 'text' : 'password');
  };

  if (hidden) {
    return null;
  }
  const iconProps = {
    height: 26,
    width: 26,
  };

  const remainingCharacters = (maxLength || 0) - (value || '').length;

  return (
    <StyledTextInputGroupForm disabled={disabled}>
      {showLabel && (
        <StyledInputLabel htmlFor={`form-input-${name}`}>
          {title}
        </StyledInputLabel>
      )}
      <StyledTextInputWrapper>
        <input
          ref={inputRef}
          value={value || ''}
          className={`${value ? '' : 'empty-value'} ${style || ''}`}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange(event.target.value)
          }
          onBlur={onBlur}
          disabled={disabled}
          type={contextType || 'text'}
          placeholder={
            (showLabel ? placeholder : placeholder || (title as string)) ||
            'Écrivez'
          }
          name={name}
          // maxLength={maxLength}
          id={id}
          data-testid={id}
        />
        {type === 'password' && (
          <StyledEyeIconWrapper>
            {isPasswordContextType() ? (
              <ButtonIcon
                icon={<EyeHidden {...iconProps} />}
                onClick={() => toggleType()}
              />
            ) : (
              <ButtonIcon
                icon={<EyeVisible {...iconProps} />}
                onClick={() => toggleType()}
              />
            )}
          </StyledEyeIconWrapper>
        )}
      </StyledTextInputWrapper>
      {maxLength ? (
        <StyledAnnotations>
          <div>
            <StyledAnnotationsErrorMessage error={error} />
          </div>
          <StyledLimit warning={remainingCharacters < 0}>
            {remainingCharacters >= 0 ? (
              <span>{remainingCharacters} caractère(s) restant(s)</span>
            ) : (
              <span>
                Limite dépassée de {Math.abs(remainingCharacters)} caractères(s)
              </span>
            )}
          </StyledLimit>
        </StyledAnnotations>
      ) : (
        <FieldErrorMessage error={error} />
      )}
    </StyledTextInputGroupForm>
  );
}
