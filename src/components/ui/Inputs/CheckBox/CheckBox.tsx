import React, { ChangeEvent, type JSX } from 'react';
import { StyledCheckbox } from '@/src/components/ui/Inputs/CheckBox/CheckBox.styles';
import { FieldErrorMessage } from '@/src/features/forms/fields/FieldErrorMessage/FieldErrorMessage';
import { CommonInputProps } from '../Inputs.types';

interface CheckBoxProps extends CommonInputProps<boolean, HTMLInputElement> {
  useOutsideOfForm?: boolean;
}

export function CheckBox({
  id,
  name,
  title,
  onChange,
  onBlur,
  disabled = false,
  hidden = false,
  value = false,
  useOutsideOfForm = false,
  error,
  inputRef,
}: Omit<CheckBoxProps, 'title'> & { title?: string | JSX.Element }) {
  if (hidden) {
    return null;
  }

  return (
    <StyledCheckbox
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <label
        className={`checkbox-label ${disabled ? 'disabled' : ''}`}
        htmlFor={id}
      >
        <input
          type="checkbox"
          id={id}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange(event.target.checked)
          }
          onBlur={onBlur}
          disabled={disabled}
          checked={value}
          name={name}
          ref={inputRef}
        />
        <span className="checkmark" />
        {title && <span className="label">{title}</span>}
      </label>
      {!useOutsideOfForm && error && <FieldErrorMessage error={error} />}
    </StyledCheckbox>
  );
}
