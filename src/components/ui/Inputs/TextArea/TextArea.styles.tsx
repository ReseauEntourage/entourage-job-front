import { styled, css } from 'styled-components';
import { COLORS } from '@/src/constants/styles';
import {
  commonInputContainerStyles,
  commonInputStyles,
} from '../Inputs.styles';

export const StyledTextAreaContainer = styled.div<{
  disabled?: boolean;
  $naked?: boolean;
  $noMarginBottom?: boolean;
}>`
  ${() => commonInputContainerStyles}
  ${({ $noMarginBottom }) =>
    $noMarginBottom &&
    css`
      margin-bottom: 0;
    `}
  ${({ $naked }) =>
    $naked &&
    css`
      margin-bottom: 0;
      flex: 1;
      min-width: 0;
    `}
`;

export const StyledTextArea = styled.textarea<{
  $hasLineLimit: boolean;
  $textAreaWidth?: number;
  width: number;
  $naked?: boolean;
  $framed?: boolean;
}>`
  ${() => commonInputStyles}
  width: 100%;
  padding-bottom: 12px;
  resize: none;
  width: ${({ $hasLineLimit, width }) => {
    // Hard code the width in case the width of the modal changes
    return $hasLineLimit ? `${width}px` : '100%';
  }};
  &::placeholder {
    color: ${COLORS.mediumGray};
    background-color: transparent;
    font-family: Poppins, sans-serif;
  }
  &:focus-visible {
    outline: none;
  }
  /* Framed: the border, its radius and its states belong to the frame */
  ${({ $framed }) =>
    $framed &&
    css`
      border: none;
      border-radius: 0;
      &:hover,
      &:focus {
        border: none;
      }
    `}
  ${({ $naked }) =>
    $naked &&
    css`
      border: none;
      padding: 0;
      min-height: 20px;
      max-height: 120px;
      font-size: 13px;
      line-height: 1.5;
      &:focus,
      &:hover {
        border: none;
      }
      border-radius: 0;
    `}
`;

export const StyledTextAreaScrollContainer = styled.div<{
  $hasLineLimit: boolean;
  $textAreaWidth?: number;
  width: number;
}>`
  overflow-x: auto;
  ${({ $hasLineLimit, $textAreaWidth, width }) => {
    return $hasLineLimit
      ? css`
          width: ${$textAreaWidth || width}px;
          max-width: ${width}px;
        `
      : css`
          width: 100%;
          max-width: 100%;
        `;
  }};
  min-width: 300px;
`;

// Single frame around the field and its footer: it carries the border and
// the hover / focus states the textarea carries when it is not framed
export const StyledTextAreaFrame = styled.div`
  border: 2px solid ${COLORS.gray};
  border-radius: 8px;
  background-color: transparent;
  overflow: hidden;

  &:hover {
    border-color: ${COLORS.darkGray};
  }

  &:focus-within {
    border-color: ${COLORS.primaryBlue};
  }
`;

// Counters, inside the frame, aligned to the right under the field
export const StyledTextAreaFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px;
  border-top: 1px solid ${COLORS.extraLightGray};

  > div > div {
    padding-top: 0;
  }
`;
