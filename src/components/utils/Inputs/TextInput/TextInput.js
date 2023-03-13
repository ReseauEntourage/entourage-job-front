import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';
import { StyledTextInputContainer } from './TextInput.styles';

const TextInput = ({ id, title, type, onChange, name, valid }) => {
  const [value, setValue] = useState();
  return (
    <StyledTextInputContainer>
      <input
        className={value ? '' : 'empty-value'}
        onChange={(e) => {
          setValue(e.target.value);
          return onChange(e);
        }}
        type={type || 'text'}
        placeholder={title}
        name={name}
        id={id}
      />
      <FormValidatorErrorMessage validObj={valid} />
    </StyledTextInputContainer>
  );
};

TextInput.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.func,
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
  valid: undefined,
};
export default TextInput;
