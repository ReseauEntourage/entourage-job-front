import PropTypes from 'prop-types';
import React from 'react';
import { StyledTextAreaContainer } from './TextArea.styles';

interface TextAreaTypes {
  title: string;
  name: string;
  id: string;
  onChange: () => void;
}

const TextArea = ({ title, name, id, onChange }: TextAreaTypes) => {
  return (
    <StyledTextAreaContainer>
      <textarea
        name={name}
        id={id}
        rows={5}
        placeholder={title}
        onChange={onChange}
      />
    </StyledTextAreaContainer>
  );
};

TextArea.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  onChange: PropTypes.func,
};

TextArea.defaultProps = {
  onChange: () => {
    return null;
  },
  id: '',
};

export default TextArea;
