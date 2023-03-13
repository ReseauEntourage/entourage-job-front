import PropTypes from 'prop-types';
import React from 'react';
import PhoneInputWithCountry from 'react-phone-number-input/mobile';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';
import { StyledPhoneInput } from './PhoneInput.styles';

export function PhoneInput({
  id,
  name,
  title,
  valid,
  value,
  onChange,
  disabled,
  hidden,
  autocomplete,
}) {
  const update = (eventValue) => {
    if (onChange) onChange(eventValue);
  };

  return (
    <StyledPhoneInput hidden={hidden}>
      <PhoneInputWithCountry
        defaultCountry="FR"
        title={title}
        name={name}
        id={id}
        value={value || ''}
        placeholder={title}
        onChange={(event) => {
          return update(event);
        }}
        disabled={disabled}
        autoComplete={autocomplete}
      />
      <FormValidatorErrorMessage validObj={valid} />
    </StyledPhoneInput>
  );
}

PhoneInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  title: PropTypes.string,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.string,
  }),
  value: PropTypes.string,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  autocomplete: PropTypes.string,
};

PhoneInput.defaultProps = {
  id: '',
  valid: undefined,
  value: '',
  disabled: false,
  hidden: false,
  autocomplete: 'tel',
  title: '',
  onChange: undefined,
  name: '',
};
