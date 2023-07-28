import styled, { css } from 'styled-components';
import { commonInputStyles } from '../Inputs.styles';
import { COLORS } from 'src/constants/styles';

export const StyledTextAreaContainer = styled.div`
  max-width: 100%;
  background-color: ${COLORS.white};
  border-radius: 5px;
`;

export const StyledTextArea = styled.textarea`
  ${() => commonInputStyles}
  width: 100%;
  padding-bottom: 12px;
  resize: vertical;
  margin-bottom: 30px;
  width: ${({ hasLineLimit, width }) => {
    // Hard code the width in case the width of the modal changes
    return hasLineLimit ? `${width}px` : '100%';
  }};
  &::placeholder {
    font-style: italic;
    color: ${COLORS.darkGray};
    background-color: ${COLORS.transpare};
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
  margin-bottom: 30px;
  min-width: 300px;
`;

export const StyledAnnotations = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledLineLimit = styled.div`
  color: ${({ warning }) => {
    return warning ? COLORS.noRed : COLORS.darkGray;
  }};
  font-size: 12px;
  text-align: right;
  align-self: flex-end;
  transform: translate(0, -30px);
`;
