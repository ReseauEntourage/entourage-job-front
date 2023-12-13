import React, { ChangeEvent, useEffect } from 'react';
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
  setIsMaxLinesReached?: (isMaxLinesReached: boolean) => void;
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
  setIsMaxLinesReached,
}: TextAreaProps) {
  const isMobile = useIsMobile();

  const { textAreaRef, remainingLines, maxLinesReached, textAreaWidth } =
    useLineLimit(value, name, onChange, maxLines?.lines);

  useEffect(
    // @ts-expect-error after enable TS strict mode. Please, try to fix it
    () => {
      if (!maxLines) return null;
      if (maxLinesReached) {
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        setIsMaxLinesReached(true);
      } else {
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        setIsMaxLinesReached(false);
      }
    }
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
          placeholder={
            showLabel ? placeholder || 'Écrivez...' : placeholder || title
          }
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
            <StyledLimit warning={remainingLines < 0}>
              {remainingLines >= 0 ? (
                <span>{remainingLines} ligne(s) restante(s)</span>
              ) : (
                <span>
                  Limite dépassée de {Math.abs(remainingLines)} ligne(s)
                </span>
              )}
            </StyledLimit>
          )}
          {!maxLines && maxLength && (
            <StyledLimit warning={remainingCharacters < 0}>
              {remainingCharacters >= 0 ? (
                <span>{remainingCharacters} caractère(s) restant(s)</span>
              ) : (
                <span>
                  Limite dépassée de {Math.abs(remainingCharacters)}{' '}
                  caractères(s)
                </span>
              )}
            </StyledLimit>
          )}
        </StyledAnnotations>
      ) : (
        <FieldErrorMessage error={error} />
      )}
    </StyledTextAreaContainer>
  );
}
