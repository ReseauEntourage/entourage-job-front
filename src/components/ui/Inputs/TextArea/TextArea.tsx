import React, { ChangeEvent, useEffect } from 'react';
import {
  StyledAnnotations,
  StyledAnnotationsErrorMessage,
  StyledInputLabel,
  StyledLimit,
  StyledLimitContainer,
} from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import { Text } from 'src/components/ui';
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
  minLength?: number;
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
  minLength,
  maxLength,
  showLabel,
  inputRef,
  rows,
  setIsMaxLinesReached,
}: TextAreaProps) {
  const isMobile = useIsMobile();
  const { textAreaRef, remainingLines, maxLinesReached, textAreaWidth } =
    useLineLimit(value, name, onChange, maxLines?.lines);

  useEffect(() => {
    if (!maxLines) {
      return;
    }
    if (setIsMaxLinesReached) {
      if (maxLinesReached) {
        setIsMaxLinesReached(true);
      } else {
        setIsMaxLinesReached(false);
      }
    }
  }, [maxLines, maxLinesReached, setIsMaxLinesReached]);

  if (hidden) {
    return null;
  }

  const maxLinesWidth = maxLines?.width || 655;

  const remainingCharacters = (maxLength || 0) - (value || '').length;
  const currentLength = (value || '').length;
  const missingCharacters = minLength ? minLength - currentLength : 0;
  const isBelowMinLength = !!minLength && missingCharacters > 0;
  const shouldShowAnnotations = !!maxLines || !!maxLength || !!minLength;
  const shouldShowFooter = !!error || shouldShowAnnotations;

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
          device={isMobile ? 'mobile' : 'desktop'}
          hasLineLimit={!!maxLines}
          width={maxLinesWidth}
          ref={(e) => {
            if (inputRef) {
              inputRef(e);
            }
            textAreaRef.current = e;
          }}
          name={name}
          id={id}
          data-testid={id}
          rows={rows || 5}
          placeholder={
            (showLabel ? placeholder : placeholder || title) || 'Écrivez'
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
      {shouldShowFooter && (
        <StyledAnnotations>
          {error && <StyledAnnotationsErrorMessage error={error} />}
          {shouldShowAnnotations && (
            <StyledLimitContainer>
              {maxLines && (
                <StyledLimit>
                  {remainingLines >= 0 ? (
                    <Text size="small" color="darkGray">
                      {remainingLines} ligne(s) restante(s)
                    </Text>
                  ) : (
                    <Text size="small" color="lightRed">
                      Limite dépassée de {Math.abs(remainingLines)} ligne(s)
                    </Text>
                  )}
                </StyledLimit>
              )}
              {!maxLines && (
                <>
                  {isBelowMinLength ? (
                    <StyledLimit>
                      <Text size="small" color="darkGray">
                        Encore {missingCharacters} caractère(s) nécessaire(s)
                      </Text>
                    </StyledLimit>
                  ) : (
                    maxLength && (
                      <StyledLimit>
                        {remainingCharacters >= 0 ? (
                          <Text size="small" color="darkGray">
                            {remainingCharacters} caractère(s) restant(s)
                          </Text>
                        ) : (
                          <Text size="small" color="lightRed">
                            Limite dépassée de {Math.abs(remainingCharacters)}{' '}
                            caractères(s)
                          </Text>
                        )}
                      </StyledLimit>
                    )
                  )}
                </>
              )}
            </StyledLimitContainer>
          )}
        </StyledAnnotations>
      )}
    </StyledTextAreaContainer>
  );
}
