import React, { ChangeEvent } from 'react';
import { StyledInputLabel } from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
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

interface TextAreaProps extends CommonInputProps<string, HTMLTextAreaElement> {
  maxLines?: { lines: number; width: number };
}

export function TextArea({
  title,
  name,
  id,
  onChange,
  value,
  hidden,
  error,
  maxLines,
  showLabel,
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
      {showLabel && (
        <StyledInputLabel htmlFor={`form-input-${name}`}>
          {title}
        </StyledInputLabel>
      )}
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
          <FormValidatorErrorMessage error={error} />
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
