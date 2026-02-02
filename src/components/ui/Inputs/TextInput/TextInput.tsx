import React, { ChangeEvent, useState } from 'react';
import { ButtonIcon } from '../../Button';
import { LucidIcon } from '../../Icons/LucidIcon';
import {
  StyledAnnotations,
  StyledAnnotationsErrorMessage,
  StyledInputLabel,
  StyledLimit,
  StyledLimitContainer,
} from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import { Text } from 'src/components/ui';
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
  const isPasswordContextType = contextType === 'password';
  const toggleContextType = () => {
    setContextType(isPasswordContextType ? 'text' : 'password');
  };

  if (hidden) {
    return null;
  }
  const remainingCharacters = (maxLength || 0) - (value || '').length;
  const shouldShowFooter = !!error || !!maxLength;

  return (
    <StyledTextInputGroupForm disabled={disabled}>
      {showLabel && <StyledInputLabel htmlFor={id}>{title}</StyledInputLabel>}
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
            {isPasswordContextType ? (
              <ButtonIcon
                icon={<LucidIcon name="EyeOff" size={15} />}
                onClick={toggleContextType}
              />
            ) : (
              <ButtonIcon
                icon={<LucidIcon name="Eye" size={15} />}
                onClick={toggleContextType}
              />
            )}
          </StyledEyeIconWrapper>
        )}
      </StyledTextInputWrapper>
      {shouldShowFooter && (
        <StyledAnnotations>
          {error && <StyledAnnotationsErrorMessage error={error} />}
          {maxLength && (
            <StyledLimitContainer>
              <StyledLimit>
                {remainingCharacters >= 0 ? (
                  <Text size="small" color="darkGray">
                    {remainingCharacters} caractère(s) restant(s)
                  </Text>
                ) : (
                  <Text size="small" color="lightRed">
                    Limite dépassée de {Math.abs(remainingCharacters)}
                    caractères(s)
                  </Text>
                )}
              </StyledLimit>
            </StyledLimitContainer>
          )}
        </StyledAnnotations>
      )}
    </StyledTextInputGroupForm>
  );
}
