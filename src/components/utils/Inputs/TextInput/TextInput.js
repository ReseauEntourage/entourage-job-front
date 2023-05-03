import React from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';
import { StyledTextInputContainer } from './TextInput.styles';

const TextInput = ({
  id,
  title,
  type,
  onChange,
  name,
  placeholder,
  showLabel,
  valid,
  style,
  value,
}) => {
  return (
    <StyledTextInputContainer>
      {showLabel && <label htmlFor={`form-input-${name}`}>{title}</label>}
      <input
        className={`${value ? '' : 'empty-value'} ${style}`}
        onChange={onChange}
        type={type || 'text'}
        placeholder={placeholder || title}
        name={name}
        id={id}
        value={value}
        data-testid={id}
      />
      <FormValidatorErrorMessage validObj={valid} newInput />
    </StyledTextInputContainer>
  );
};

TextInput.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.func,
  placeholder: PropTypes.string,
  showLabel: PropTypes.bool,
  id: PropTypes.string,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.string,
  }),
  style: PropTypes.string,
  value: PropTypes.string,
};

TextInput.defaultProps = {
  title: '',
  type: 'text',
  onChange: () => {},
  name: '',
  placeholder: '',
  showLabel: false,
  id: '',
  valid: undefined,
  value: '',
  style: '',
};
export default TextInput;
