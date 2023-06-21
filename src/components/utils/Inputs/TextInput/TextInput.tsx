import PropTypes from 'prop-types';
import React from 'react';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { StyledTextInputContainer } from './TextInput.styles';

export function TextInput({
  id,
  title,
  type,
  onChange,
  name,
  placeholder,
  showLabel,
  valid,
  style,
  hidden,
  value,
}) {
  if (hidden) {
    return null;
  }

  return (
    <StyledTextInputContainer>
      {showLabel && <label htmlFor={`form-input-${name}`}>{title}</label>}
      <input
        value={value}
        className={`${value ? '' : 'empty-value'} ${style}`}
        onChange={onChange}
        type={type || 'text'}
        placeholder={placeholder || title}
        name={name}
        id={id}
        data-testid={id}
      />
      <FormValidatorErrorMessage validObj={valid} newInput />
    </StyledTextInputContainer>
  );
}

TextInput.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  showLabel: PropTypes.bool,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.string,
  }),
  hidden: PropTypes.bool,
  style: PropTypes.string,
};

TextInput.defaultProps = {
  title: '',
  id: '',
  value: '',
  type: 'text',
  onChange: () => {
    return null;
  },
  name: '',
  placeholder: '',
  showLabel: false,
  valid: undefined,
  hidden: false,
  style: '',
};
