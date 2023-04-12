import PropTypes from 'prop-types';
import React from 'react';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';
import { StyledDatePickerContainer } from './DatePicker.styles';

export function DatePicker({
  id,
  name,
  title,
  valid,
  hidden,
  onChange,
  disabled,
  value,
  min,
  max,
}) {
  if (hidden) {
    return null;
  }

  return (
    <StyledDatePickerContainer className={`${hidden ? 'uk-hidden' : ''}`}>
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
      <FormValidatorErrorMessage validObj={valid} newInput />
    </StyledDatePickerContainer>
  );
}

DatePicker.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.string,
  }),
  value: PropTypes.string,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  min: PropTypes.string,
  max: PropTypes.string,
};

DatePicker.defaultProps = {
  valid: undefined,
  value: '',
  min: undefined,
  max: undefined,
  disabled: false,
  hidden: false,
};
