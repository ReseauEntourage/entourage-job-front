import React, { ChangeEvent } from 'react';
import { CommonInputProps } from '../Inputs.types';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage/FieldErrorMessage';
import { StyledCheckbox } from 'src/components/utils/Inputs/CheckBox/CheckBox.styles';

interface CheckBoxProps extends CommonInputProps<boolean, HTMLInputElement> {
  removeMargin?: boolean;
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
  removeMargin = false,
  error,
  inputRef,
}: Omit<CheckBoxProps, 'title'> & { title?: string | JSX.Element }) {
  if (hidden) {
    return null;
  }

  return (
    <StyledCheckbox
      removeMargin={removeMargin}
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
      <FieldErrorMessage error={error} />
    </StyledCheckbox>
  );
}
