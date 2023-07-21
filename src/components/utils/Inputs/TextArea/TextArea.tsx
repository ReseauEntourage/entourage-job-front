import React from 'react';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { useIsMobile } from 'src/hooks/utils';
import {
  StyledAnnotations,
  StyledLineLimit,
  StyledTextArea,
  StyledTextAreaContainer,
  StyledTextAreaScrollContainer,
} from './TextArea.styles';
import { useLineLimit } from './useLineLimit';

interface TextAreaProps {
  title: string;
  name: string;
  id?: string;
  onChange: (e) => void;
  value: string;
  hidden?: boolean;
  valid?: {
    isInvalid: boolean;
    message: string;
  };
  maxLines?: { lines: number; width: number };
}

export function TextArea({
  title,
  name,
  id,
  onChange,
  value,
  hidden,
  valid,
  maxLines,
}: TextAreaProps) {
  const isMobile = useIsMobile();

  const { textAreaRef, remainingLines, textAreaWidth } = useLineLimit(
    value,
    name,
    onChange,
    maxLines?.lines
  );

  if (hidden) {
    return null;
  }

  const maxLinesWidth = maxLines?.width || 655;

  return (
    <StyledTextAreaContainer>
      <StyledTextAreaScrollContainer
        textAreaWidth={textAreaWidth}
        isMobile={isMobile}
        hasLineLimit={!!maxLines}
        width={maxLinesWidth}
      >
        <StyledTextArea
          isMobile={isMobile}
          hasLineLimit={!!maxLines}
          width={maxLinesWidth}
          ref={textAreaRef}
          name={name}
          id={id}
          rows={5}
          placeholder={title}
          onChange={onChange}
          value={value}
        />
      </StyledTextAreaScrollContainer>
      <StyledAnnotations>
        <div>
          <FormValidatorErrorMessage validObj={valid} />
        </div>
        {maxLines && (
          <StyledLineLimit warning={remainingLines === 0}>
            {remainingLines} ligne(s) restante(s)
          </StyledLineLimit>
        )}
      </StyledAnnotations>
    </StyledTextAreaContainer>
  );
}
