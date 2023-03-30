import React, { useState } from 'react';
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
}) => {
  const [value, setValue] = useState();
  return (
    <StyledTextInputContainer>
      {showLabel && <label htmlFor={`form-input-${name}`}>{title}</label>}
      <input
        className={value ? '' : 'empty-value'}
        onChange={(e) => {
          setValue(e.target.value);
          return onChange(e);
        }}
        type={type || 'text'}
        placeholder={placeholder || title}
        name={name}
        id={id}
        data-testid={id}
      />
      <FormValidatorErrorMessage validObj={valid} newInput />
    </StyledTextInputContainer>
  );
};

TextInput.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.func,
  placeholder: PropTypes.string,
  showLabel: PropTypes.bool,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.string,
  }),
};

TextInput.defaultProps = {
  title: '',
  id: '',
  type: 'text',
  onChange: () => {},
  name: '',
  placeholder: '',
  showLabel: false,
  valid: undefined,
};
export default TextInput;
