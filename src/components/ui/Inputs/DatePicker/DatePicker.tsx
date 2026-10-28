import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FieldErrorMessage } from '@/src/features/forms/fields/FieldErrorMessage/FieldErrorMessage';
import {
  DATE_INPUT_PLACEHOLDER,
  displayDateToIso,
  getDateInputRemainder,
  isoToDisplayDate,
  isValidIsoDate,
  maskDateInput,
} from '@/src/utils/DateInput';
import { ButtonIcon } from '../../Button';
import { LucidIcon } from '../../Icons/LucidIcon';
import { StyledInputLabel } from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import {
  StyledDatePickerCalendar,
  StyledDatePickerContainer,
  StyledDatePickerGhost,
  StyledDatePickerRow,
  StyledDatePickerTextWrapper,
  StyledNativeDateInput,
} from './DatePicker.styles';

interface DatePickerProps extends CommonInputProps<string, HTMLInputElement> {
  // Bounds of the native calendar, as `YYYY-MM-DD`
  min?: string;
  max?: string;
}

/**
 * Text shown in the field for a form value: the `dd/mm/yyyy` form of a valid
 * date, or the typed text itself when it is an unfinished or impossible date.
 */
const getDisplayedText = (value: string) =>
  isValidIsoDate(value) ? isoToDisplayDate(value) : value || '';

/**
 * Single `dd/mm/yyyy` text field with an optional native calendar.
 *
 * The form value is `YYYY-MM-DD` for a complete real date and empty when the
 * field is empty. While the typed date is unfinished or impossible, the value
 * is the typed text itself: it is not a valid date, so the form validation
 * refuses it with an error message.
 */
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
  placeholder = DATE_INPUT_PLACEHOLDER,
  showLabel = true,
}: DatePickerProps) {
  const [text, setText] = useState(() => getDisplayedText(value));
  const nativeInputRef = useRef<HTMLInputElement>(null);
  // Last value sent to the form, to tell a reset from the outside apart
  const lastSentValue = useRef(value);

  useEffect(() => {
    if (value !== lastSentValue.current) {
      lastSentValue.current = value;
      setText(getDisplayedText(value));
    }
  }, [value]);

  if (hidden) {
    return null;
  }

  const sendValue = (newValue: string) => {
    lastSentValue.current = newValue;
    onChange(newValue);
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const maskedText = maskDateInput(event.target.value);
    setText(maskedText);
    sendValue(displayDateToIso(maskedText) ?? maskedText);
  };

  const handleCalendarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const pickedDate = event.target.value;
    setText(isoToDisplayDate(pickedDate));
    sendValue(pickedDate);
  };

  const openCalendar = () => {
    const nativeInput = nativeInputRef.current;
    if (!nativeInput) {
      return;
    }
    try {
      nativeInput.showPicker();
    } catch {
      // Browsers without showPicker() open the calendar on a click
      nativeInput.click();
    }
  };

  return (
    <StyledDatePickerContainer
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {showLabel && <StyledInputLabel htmlFor={id}>{title}</StyledInputLabel>}
      <StyledDatePickerRow>
        <StyledDatePickerTextWrapper>
          {getDateInputRemainder(text) && (
            <StyledDatePickerGhost
              aria-hidden="true"
              data-testid={`${id}-ghost`}
            >
              <span>{text}</span>
              {getDateInputRemainder(text)}
            </StyledDatePickerGhost>
          )}
          <input
            id={id}
            data-testid={id}
            name={name}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={10}
            placeholder={placeholder}
            aria-label={showLabel ? undefined : (title as string)}
            aria-invalid={!!error}
            value={text}
            onChange={handleTextChange}
            onBlur={onBlur}
            disabled={disabled}
            ref={inputRef}
          />
        </StyledDatePickerTextWrapper>
        <StyledDatePickerCalendar>
          <ButtonIcon
            icon={<LucidIcon name="Calendar" />}
            ariaLabel="Ouvrir le calendrier"
            dataTestId={`${id}-calendar-button`}
            onClick={openCalendar}
            disabled={disabled}
            variant="default"
            size="large"
            shape="square"
          />
          <StyledNativeDateInput
            ref={nativeInputRef}
            data-testid={`${id}-calendar`}
            type="date"
            tabIndex={-1}
            aria-hidden="true"
            value={isValidIsoDate(value) ? value : ''}
            min={min || '1900-01-01'}
            max={max}
            onChange={handleCalendarChange}
            disabled={disabled}
          />
        </StyledDatePickerCalendar>
      </StyledDatePickerRow>
      {error && <FieldErrorMessage error={error} />}
    </StyledDatePickerContainer>
  );
}
