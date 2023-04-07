import React from 'react';
import { PropTypes } from 'prop-types';
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
  hidden,
  value,
}) => {
  return (
    !hidden && (
      <StyledTextInputContainer>
        {showLabel && <label htmlFor={`form-input-${name}`}>{title}</label>}
        <input
          value={value}
          className={value ? '' : 'empty-value'}
          onChange={onChange}
          type={type || 'text'}
          placeholder={placeholder || title}
          name={name}
          id={id}
          data-testid={id}
        />
        <FormValidatorErrorMessage validObj={valid} newInput />
      </StyledTextInputContainer>
    )
  );
};

TextInput.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.func,
  placeholder: PropTypes.string,
  showLabel: PropTypes.bool,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.string,
  }),
  hidden: PropTypes.bool,
};

TextInput.defaultProps = {
  title: '',
  id: '',
  value: '',
  type: 'text',
  onChange: () => {},
  name: '',
  placeholder: '',
  showLabel: false,
  valid: undefined,
  hidden: false,
};
export default TextInput;
