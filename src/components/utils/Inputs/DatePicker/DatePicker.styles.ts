import styled from 'styled-components';
import { commonInputStyles } from '../Inputs.styles';
import { COLORS } from 'src/constants/styles';

export const StyledDatePickerContainer = styled.div`
  min-width: 300px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  input {
    ${() => commonInputStyles}
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
