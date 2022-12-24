import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from '../../../forms/FormValidatorErrorMessage';
import { StyledDatePickerContainer } from './DatePicker.styles';

const DatePicker = ({
  id,
  name,
  title,
  valid,
  hidden,
  onChange,
  disabled,
  // value,
  min,
  max,
}) => {
  // const [emptyValue, setEmptyValue] = useState(true);
  const [value, setValue] = useState();
  return (
    <StyledDatePickerContainer className={`${hidden ? 'uk-hidden' : ''}`}>
      {title ? (
        <label className="" htmlFor={id}>
          {title}
        </label>
      ) : null}
      <input
        id={id}
        className={`${!value ? 'empty-value' : ''}`}
        name={name}
        value={value}
        min={min}
        max={max}
        type="date"
        onChange={(e) => {
          setValue(e.target.value);
          console.log(e.target.value);
          onChange();
        }}
        disabled={disabled}
        hidden={hidden}
      />
      <FormValidatorErrorMessage validObj={valid} />
    </StyledDatePickerContainer>
  );
};

DatePicker.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.string,
  }),
  // value: PropTypes.string,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  min: PropTypes.string,
  max: PropTypes.string,
};

DatePicker.defaultProps = {
  valid: undefined,
  // value: '',
  min: undefined,
  max: undefined,
  disabled: false,
  hidden: false,
};

export default DatePicker;
