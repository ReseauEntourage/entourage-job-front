import PropTypes from 'prop-types';
import React from 'react';
import { StyledTextAreaContainer } from './TextArea.styles';

interface TextAreaTypes {
  title: string;
  name: string;
  id: string;
  onChange: (event) => void;
  value: string;
  hidden?: boolean;
}

export function TextArea({
  title,
  name,
  id,
  onChange,
  value,
  hidden,
}: TextAreaTypes) {
  if (hidden) {
    return null;
  }

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
}

TextArea.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  hidden: PropTypes.bool,
};

TextArea.defaultProps = {
  onChange: () => {
    return null;
  },
  id: '',
  value: '',
  hidden: false,
};
