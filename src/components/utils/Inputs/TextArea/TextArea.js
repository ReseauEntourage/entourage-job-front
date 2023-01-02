import React from 'react';
import { PropTypes } from 'prop-types';
import { StyledTextAreaContainer } from './TextArea.styles';

const TextArea = ({ label, name, id }) => {
  return (
    <StyledTextAreaContainer>
      <div className="label" id={id}>
        <label htmlFor={name}>{label}</label>
      </div>
      <textarea name={name} rows={5} />
    </StyledTextAreaContainer>
  );
};

TextArea.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default TextArea;
