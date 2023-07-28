import React, { Component } from 'react';
import {
  DefaultInputComponentProps,
  Props,
  State,
  Value,
} from 'react-phone-number-input';
import PhoneInputWithCountry from 'react-phone-number-input/mobile';
import { StyledInputLabel } from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage/FieldErrorMessage';
import { StyledPhoneInput } from './PhoneInput.styles';

interface PhoneInputProps
  extends CommonInputProps<
    Value,
    Component<
      Props<DefaultInputComponentProps>,
      State<Props<DefaultInputComponentProps>>
    >
  > {
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
  onBlur,
  disabled = false,
  hidden = false,
  autocomplete = 'tel',
  showLabel = false,
  placeholder,
  inputRef,
}: PhoneInputProps) {
  if (hidden) {
    return null;
  }

  return (
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
        value={value}
        placeholder={placeholder || title}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        autoComplete={autocomplete}
        ref={inputRef}
      />
      <FieldErrorMessage error={error} />
    </StyledPhoneInput>
  );
}
