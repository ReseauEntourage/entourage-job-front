import React, { ChangeEvent } from 'react';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { StyledDatePickerContainer } from './DatePicker.styles';

interface DatePickerProps {
  id: string;
  name: string;
  onChange: (e: ChangeEvent) => void;
  title: string;
  valid?: {
    isInvalid: boolean;
    message: string;
  };
  value?: string;
  disabled?: boolean;
  hidden?: boolean;
  min?: string;
  max?: string;
}

export function DatePicker({
  id,
  name,
  title,
  valid,
  hidden = false,
  onChange,
  disabled = false,
  value = '',
  min,
  max,
}: DatePickerProps) {
  if (hidden) {
    return null;
  }

  if (!min) min = '1900-01-01';

  return (
    <StyledDatePickerContainer
      className={`${hidden ? 'uk-hidden' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {title ? (
        <label className="" htmlFor={id}>
          {title}
        </label>
      ) : null}
      <input
        id={id}
        data-testid={id}
        className={`${!value ? 'empty-value' : ''}`}
        name={name}
        value={value}
        min={min}
        max={max}
        type="date"
        onChange={onChange}
        disabled={disabled}
        hidden={hidden}
      />
      <FormValidatorErrorMessage validObj={valid} />
    </StyledDatePickerContainer>
  );
}
