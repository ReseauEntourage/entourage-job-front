import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledDatePickerContainer = styled.div`
  width: 400px;
  max-width: 100%;
  input,
  label {
    width: 100%;
  }
  label {
    padding: 4px 0;
    font-size: 14px;
    line-height: 17px;
    border: 0.5px solid white;
    border-bottom: solid 2px ${COLORS.gray};
    color: ${COLORS.darkGray};
    font-style: italic;
  }
  input {
    border: 0.5px solid white;
    border-bottom: solid 2px ${COLORS.gray};
    padding: 4px 0;
    font-size: 14px;
    line-height: 17px;
    &.empty-value {
      color: ${COLORS.darkGray};
      font-style: italic;
    }
    &:focus-visible {
      outline: none;
    }
  }
`;
