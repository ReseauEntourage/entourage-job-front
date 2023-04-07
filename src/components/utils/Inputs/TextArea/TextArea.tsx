import PropTypes from 'prop-types';
import React from 'react';
import { StyledTextAreaContainer } from './TextArea.styles';

interface TextAreaTypes {
  title: string;
  name: string;
  id: string;
  onChange: () => void;
  value: string;
}

const TextArea = ({ title, name, id, onChange, value }: TextAreaTypes) => {
  return (
    <StyledTextAreaContainer>
      <textarea
        name={name}
        id={id}
        rows={5}
        placeholder={title}
        onChange={onChange}
        value={value}
      />
    </StyledTextAreaContainer>
  );
};

TextArea.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

TextArea.defaultProps = {
  onChange: () => {
    return null;
  },
  id: '',
  value: '',
};

export default TextArea;
