import React, { ChangeEvent } from 'react';
import { StyledInputLabel } from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage/FieldErrorMessage';
import { StyledDatePickerContainer } from './DatePicker.styles';

interface DatePickerProps extends CommonInputProps<string, HTMLInputElement> {
  min?: string;
  max?: string;
}

export function DatePicker({
  id,
  name,
  value,
  title,
  error,
  onChange,
  onBlur,
  disabled = false,
  hidden = false,
  min,
  max,
  inputRef,
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
      <StyledInputLabel htmlFor={id}>{title}</StyledInputLabel>
      <input
        id={id}
        data-testid={id}
        className={`${!value ? 'empty-value' : ''}`}
        name={name}
        value={value}
        min={min}
        max={max}
        type="date"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        onBlur={onBlur}
        disabled={disabled}
        ref={inputRef}
      />
      <FieldErrorMessage error={error} />
    </StyledDatePickerContainer>
  );
}
