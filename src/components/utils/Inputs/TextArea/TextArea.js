import React from 'react';
import { PropTypes } from 'prop-types';
import { StyledTextAreaContainer } from './TextArea.styles';

const TextArea = ({ title, name, id }) => {
  return (
    <StyledTextAreaContainer>
      <div className="label" id={id}>
        <label htmlFor={name}>{title}</label>
      </div>
      <textarea name={name} rows={5} />
    </StyledTextAreaContainer>
  );
};

TextArea.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default TextArea;
