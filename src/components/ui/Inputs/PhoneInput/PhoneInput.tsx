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
import { FieldErrorMessage } from 'src/features/forms/fields/FieldErrorMessage/FieldErrorMessage';
import { StyledPhoneInput } from './PhoneInput.styles';

interface PhoneInputProps
  extends CommonInputProps<
    Value,
    Component<
      Props<DefaultInputComponentProps>,
      State<Props<DefaultInputComponentProps>>
    >
  > {}

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
  showLabel = false,
  placeholder,
  inputRef,
}: PhoneInputProps) {
  if (hidden) {
    return null;
  }

  return (
    <StyledPhoneInput disabled={disabled}>
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
        placeholder={
          (showLabel ? placeholder : placeholder || title) || 'Écrivez'
        }
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        autoComplete="tel"
        ref={inputRef}
      />
      {error && <FieldErrorMessage error={error} />}
    </StyledPhoneInput>
  );
}
