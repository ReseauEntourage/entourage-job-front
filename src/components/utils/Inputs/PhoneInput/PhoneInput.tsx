import React from 'react';
import { Value } from 'react-phone-number-input';
import PhoneInputWithCountry from 'react-phone-number-input/mobile';
import { StyledInputLabel } from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { StyledPhoneInput } from './PhoneInput.styles';

interface PhoneInputProps
  extends CommonInputProps<string, HTMLInputElement, Value> {
  title: string;
  autocomplete: string;
}
export function PhoneInput({
  id,
  name,
  title,
  value,
  error,
  onChange,
  disabled = false,
  hidden = false,
  autocomplete = 'tel',
  showLabel = false,
  placeholder,
}: PhoneInputProps) {
  if (hidden) {
    return null;
  }

  return (
    <>
      <StyledPhoneInput>
        {showLabel && (
          <StyledInputLabel htmlFor={`form-input-${name}`}>
            {title}
          </StyledInputLabel>
        )}
        <PhoneInputWithCountry
          defaultCountry="FR"
          title={title}
          name={name}
          id={id}
          data-testid={id}
          value={value || ''}
          placeholder={placeholder || title}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autocomplete}
        />
      </StyledPhoneInput>
      <FormValidatorErrorMessage error={error} />
    </>
  );
}
