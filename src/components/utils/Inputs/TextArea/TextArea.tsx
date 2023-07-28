import React, { ChangeEvent, MutableRefObject } from 'react';
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
  rows?: number;
}

export function TextArea({
  title,
  name,
  id,
  placeholder,
  onChange,
  onBlur,
  value,
  hidden = false,
  disabled = false,
  error,
  maxLines,
  showLabel,
  inputRef,
  rows,
}: TextAreaProps) {
  const isMobile = useIsMobile();

  const { textAreaRef, remainingLines, textAreaWidth } = useLineLimit(
    value,
    name,
    onChange,
    inputRef as MutableRefObject<HTMLTextAreaElement>,
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
          rows={rows || 5}
          placeholder={placeholder || title}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            onChange(event.target.value)
          }
          disabled={disabled}
          onBlur={onBlur}
          value={value}
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
