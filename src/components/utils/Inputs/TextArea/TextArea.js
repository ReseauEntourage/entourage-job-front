import React from 'react';
import { StyledTextAreaContainer } from './TextArea.styles';

const TextArea = ({ label, name, id }) => {
  return (
    <StyledTextAreaContainer>
      <div className="label">
        <label>{label}</label>
      </div>
      <textarea />
    </StyledTextAreaContainer>
  );
};

export default TextArea;
