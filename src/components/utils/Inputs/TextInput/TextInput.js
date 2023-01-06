import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { StyledTextInputContainer } from './TextInput.styles';

const TextInput = ({ title, type, onChange, name }) => {
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
      />
    </StyledTextInputContainer>
  );
};

TextInput.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.func,
};

TextInput.defaultProps = {
  title: '',
  type: 'text',
  onChange: () => {},
  name: '',
};
export default TextInput;
