import React from 'react';
import { CommonInputProps } from '../Inputs.types';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { StyledCheckbox } from 'src/components/utils/Inputs/CheckBox/CheckBox.styles';

interface CheckBoxProps extends CommonInputProps<boolean, HTMLInputElement> {
  removeMargin?: boolean;
}

export function CheckBox({
  id,
  name,
  title,
  onChange,
  disabled = false,
  hidden = false,
  value = false,
  removeMargin = false,
  error,
}: CheckBoxProps) {
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
          onChange={onChange}
          disabled={disabled}
          checked={value}
          name={name}
        />
        <span className="checkmark" />
        {title && <span className="label">{title}</span>}
      </label>
      <FormValidatorErrorMessage error={error} />
    </StyledCheckbox>
  );
}
