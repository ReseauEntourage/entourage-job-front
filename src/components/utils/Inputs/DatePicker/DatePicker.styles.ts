import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledDatePickerContainer = styled.div`
  min-width: 300px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  input {
    width: 100%;

    border: 0.5px solid white;
    border-bottom: solid 2px ${COLORS.gray};
    padding: 4px 0;
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 30px;
    font-family: Poppins, sans-serif;
    &.empty-value {
      color: ${COLORS.darkGray};
      font-style: italic;
    }
    &:focus-visible {
      outline: none;
    }
    &::-webkit-calendar-picker-indicator {
      color: ${COLORS.primaryOrange};
      filter: invert(56%) sepia(70%) saturate(5137%) hue-rotate(343deg)
        brightness(100%) contrast(107%);
    }
  }
`;
