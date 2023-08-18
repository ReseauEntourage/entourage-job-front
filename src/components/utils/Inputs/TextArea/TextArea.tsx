import React, { ChangeEvent } from 'react';
import {
  StyledAnnotations,
  StyledAnnotationsErrorMessage,
  StyledInputLabel,
  StyledLimit,
} from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage/FieldErrorMessage';
import { useIsMobile } from 'src/hooks/utils';
import {
  StyledTextArea,
  StyledTextAreaContainer,
  StyledTextAreaScrollContainer,
} from './TextArea.styles';
import { useLineLimit } from './useLineLimit';

interface TextAreaProps extends CommonInputProps<string, HTMLTextAreaElement> {
  maxLines?: { lines: number; width: number };
  maxLength?: number;
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
  maxLength,
  showLabel,
  inputRef,
  rows,
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

  const remainingCharacters = (maxLength || 0) - (value || '').length;

  return (
    <StyledTextAreaContainer disabled={disabled}>
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
          ref={(e) => {
            if (inputRef) inputRef(e);
            textAreaRef.current = e;
          }}
          name={name}
          id={id}
          rows={rows || 5}
          placeholder={placeholder || title}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            onChange(event.target.value)
          }
          disabled={disabled}
          onBlur={onBlur}
          maxLength={!maxLines ? maxLength : null}
          value={value || ''}
        />
      </StyledTextAreaScrollContainer>
      {maxLines || maxLength ? (
        <StyledAnnotations>
          <div>
            <StyledAnnotationsErrorMessage error={error} />
          </div>
          {maxLines && (
            <StyledLimit warning={remainingLines === 0}>
              {remainingLines} ligne(s) restante(s)
            </StyledLimit>
          )}
          {!maxLines && maxLength && (
            <StyledLimit warning={remainingCharacters === 0}>
              {remainingCharacters} caractère(s) restant(s)
            </StyledLimit>
          )}
        </StyledAnnotations>
      ) : (
        <FieldErrorMessage error={error} />
      )}
    </StyledTextAreaContainer>
  );
}
