import React from 'react';
import { StyledTextAreaContainer } from './TextArea.styles';

interface TextAreaProps {
  title: string;
  name: string;
  id?: string;
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
}: TextAreaProps) {
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
