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
      color: ${COLORS.darkGray};
      font-style: italic;
    }
    &:focus-visible {
      outline: none;
    }
    &::-webkit-calendar-picker-indicator {
      color: ${COLORS.primaryBlue};
      filter: invert(56%) sepia(70%) saturate(5137%) hue-rotate(343deg)
        brightness(100%) contrast(107%);
    }
  }
`;
