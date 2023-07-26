import React, { ChangeEvent } from 'react';
import { StyledInputLabel } from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage/FieldErrorMessage';
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
  inputRef,
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
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            onChange(event.target.value)
          }
          value={value}
          ref={inputRef}
        />
      </StyledTextAreaScrollContainer>
      <StyledAnnotations>
        <div>
          <FieldErrorMessage error={error} />
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
