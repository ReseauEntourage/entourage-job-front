import styled, { css } from 'styled-components';
import {
  commonInputContainerStyles,
  commonInputStyles,
} from '../Inputs.styles';
import { COLORS } from 'src/constants/styles';

export const StyledTextAreaContainer = styled.div`
  ${() => commonInputContainerStyles}
`;

export const StyledTextArea = styled.textarea`
  ${() => commonInputStyles}
  width: 100%;
  padding-bottom: 12px;
  resize: none;
  width: ${({ hasLineLimit, width }) => {
    // Hard code the width in case the width of the modal changes
    return hasLineLimit ? `${width}px` : '100%';
  }};
  &::placeholder {
    font-style: italic;
    color: ${COLORS.darkGray};
    background-color: transparent;
    font-family: Poppins, sans-serif;
  }
  :focus-visible {
    outline: none;
  }
`;

export const StyledTextAreaScrollContainer = styled.div`
  overflow-x: auto;
  ${({ hasLineLimit, textAreaWidth, width }) => {
    return hasLineLimit
      ? css`
          width: ${textAreaWidth || width}px;
          max-width: ${width}px;
        `
      : css`
          width: 100%;
          max-width: 100%;
        `;
  }};
  min-width: 300px;
`;
