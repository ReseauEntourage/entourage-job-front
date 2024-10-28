import styled from 'styled-components';
import {
  commonInputContainerStyles,
  commonInputStyles,
} from '../Inputs.styles';
import { COLORS } from 'src/constants/styles';

export const StyledDatePickerContainer = styled.div`
  ${() => commonInputContainerStyles}
  input {
    ${() => commonInputStyles}
    &.empty-value {
      color: ${COLORS.mediumGray};
      font-style: italic;
    }
    &:focus-visible {
      outline: none;
    }
    &::-webkit-calendar-picker-indicator {
      color: ${COLORS.primaryBlue};
      filter: invert(70%) sepia(15%) saturate(1500%) hue-rotate(180deg)
        brightness(90%) contrast(85%);
    }
  }
`;
