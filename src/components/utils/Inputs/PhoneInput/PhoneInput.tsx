import React from 'react';
import PhoneInputWithCountry from 'react-phone-number-input/mobile';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { StyledPhoneInput } from './PhoneInput.styles';

interface PhoneInputProps {
  id: string;
  name: string;
  onChange: () => void;
  title: string;
  valid: {
    isInvalid: boolean;
    message: string;
  };
  value: string;
  disabled: boolean;
  hidden: boolean;
  autocomplete: string;
  showLabel: boolean;
  placeholder: string;
}
export function PhoneInput({
  valid,
  onChange,
  id = '',
  value = '',
  disabled = false,
  hidden = false,
  autocomplete = 'tel',
  title = '',
  name = '',
  showLabel = false,
  placeholder = '',
}: PhoneInputProps) {
  if (hidden) {
    return null;
  }

  return (
    <>
      <StyledPhoneInput>
        {showLabel && title && (
          <label htmlFor={id} className="label-top">
            {title}
          </label>
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
      <FormValidatorErrorMessage validObj={valid} newInput />
    </>
  );
}
