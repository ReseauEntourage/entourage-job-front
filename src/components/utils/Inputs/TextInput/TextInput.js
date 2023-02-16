import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { StyledTextInputContainer } from './TextInput.styles';

const TextInput = ({ label, password, onChange }) => {
  const [value, setValue] = useState();
  return (
    <StyledTextInputContainer>
      <input
        className={value ? '' : 'empty-value'}
        onChange={(e) => {
          setValue(e.target.value);
          return onChange();
        }}
        type={type || 'text'}
        placeholder={title}
        name={name}
        id={`form-input-${name}`}
      />
    </StyledTextInputContainer>
  );
};

TextInput.propTypes = {
  label: PropTypes.string,
  password: PropTypes.bool,
  onChange: PropTypes.func,
};

TextInput.defaultProps = {
  label: '',
  password: false,
  onChange: () => {},
};
export default TextInput;
