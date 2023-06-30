import React from 'react';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { StyledCheckbox } from 'src/components/utils/Inputs/CheckBox/CheckBox.styles';

interface CBProps {
  id: string;
  name: string;
  handleClick: () => void;
  disabled?: boolean;
  removeMargin?: boolean;
  hidden?: boolean;
  value?: boolean;
  title?: string;
  valid?: {
    isInvalid: boolean;
    message: string;
  };
}

export function CheckBox({
  handleClick,
  disabled = false,
  hidden = false,
  value = false,
  title,
  name,
  id,
  removeMargin = false,
  valid,
}: CBProps) {
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
          onChange={handleClick}
          disabled={disabled}
          checked={value}
          name={name}
        />
        <span className="checkmark" />
        {title && <span className="label">{title}</span>}
      </label>
      <FormValidatorErrorMessage validObj={valid} newInput />
    </StyledCheckbox>
  );
}
