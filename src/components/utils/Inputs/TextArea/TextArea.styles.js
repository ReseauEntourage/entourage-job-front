import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledTextAreaContainer = styled.div`
  max-width: 100%;
  background-color: ${COLORS.white};
  border-radius: 5px;
  div.label {
    border-bottom: solid 2px ${COLORS.gray};
    text-align: left;
    font-size: 14px;
    line-height: 17px;
    padding: 4px 0;
    width: 100%;
    font-style: italic;
    color: ${COLORS.darkGray};
    margin-bottom: 8px;
  }
  textarea {
    width: 100%;
    padding: 12px;
    box-sizing: border-box;
    border: none;
    resize: vertical;
    :focus-visible {
      outline: none;
    }
  }
`;
