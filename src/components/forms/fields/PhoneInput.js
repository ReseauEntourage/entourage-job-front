import PropTypes from 'prop-types';
import React from 'react';
import PhoneInputWithCountry from 'react-phone-number-input/mobile';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';

export const PhoneInput = ({
  id,
  name,
  placeholder,
  title,
  type,
  valid,
  value,
  onChange,
  disabled,
  hidden,
  autocomplete,
}) => {
  const update = (eventValue) => {
    onChange(eventValue);
  };

  return (
    <div
      className={`uk-form-controls ${
        valid !== undefined ? 'uk-padding-remove-bottom' : ''
      } uk-padding-small uk-padding-remove-left uk-padding-remove-right ${
        hidden ? ' uk-hidden' : ''
      }`}
    >
      <label className="uk-form-label stay-small" htmlFor={id}>
        {title}
      </label>
      <PhoneInputWithCountry
        defaultCountry="FR"
        title={title}
        name={name}
        type={type}
        id={id}
        value={value || ''}
        placeholder={placeholder || 'Tapez votre numéro'}
        onChange={(event) => {
          return update(event);
        }}
        className={`uk-input uk-form-large ${
          valid !== undefined && valid.isInvalid ? 'uk-form-danger' : ''
        }`}
        disabled={disabled}
        autoComplete={autocomplete}
      />
      <FormValidatorErrorMessage validObj={valid} />
    </div>
  );
};

PhoneInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
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
  placeholder: 'Tapez votre texte',
  valid: undefined,
  value: '',
  disabled: false,
  hidden: false,
  autocomplete: 'tel',
};
