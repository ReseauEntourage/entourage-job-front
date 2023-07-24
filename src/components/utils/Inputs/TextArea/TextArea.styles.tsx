import styled, { css } from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledTextAreaContainer = styled.div`
  max-width: 100%;
  background-color: ${COLORS.white};

  border-radius: 5px;
  /* div.label {
    border-bottom: solid 2px ${COLORS.gray};
    text-align: left;
    font-size: 14px;
    line-height: 17px;
    width: 100%;
    font-style: italic;
    color: ${COLORS.darkGray};
    margin-bottom: 8px;
  } */
`;

export const StyledTextArea = styled.textarea`
  width: ${({ hasLineLimit, width }) => {
    // Hard code the width in case the width of the modal changes
    return hasLineLimit ? `${width}px` : '100%';
  }};
  font-size: 14px;
  padding-bottom: 12px;
  box-sizing: border-box;
  border: none;
  resize: none;
  border-bottom: solid 2px ${COLORS.gray};
  font-family: Poppins, sans-serif;
  // need to fix line height to calculate number of lines
  line-height: 17px;
  &::placeholder {
    font-style: italic;
    color: ${COLORS.darkGray};
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
