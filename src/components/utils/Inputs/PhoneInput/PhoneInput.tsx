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
  showLabel,
  placeholder,
}) {
  if (hidden) {
    return null;
  }

  return (
    <>
      <StyledPhoneInput>
        {showLabel && <label htmlFor={`form-input-${name}`}>{title}</label>}
        <PhoneInputWithCountry
          defaultCountry="FR"
          title={title}
          name={name}
          id={id}
          data-testid={id}
          value={value || ''}
          placeholder={placeholder || title}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autocomplete}
        />
      </StyledPhoneInput>
      <FormValidatorErrorMessage validObj={valid} newInput />
    </>
  );
}

PhoneInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.string,
  }),
  value: PropTypes.string,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  autocomplete: PropTypes.string,
  showLabel: PropTypes.bool,
  placeholder: PropTypes.string,
};

PhoneInput.defaultProps = {
  id: '',
  valid: undefined,
  value: '',
  disabled: false,
  hidden: false,
  autocomplete: 'tel',
  title: '',
  name: '',
  showLabel: false,
  placeholder: '',
};
