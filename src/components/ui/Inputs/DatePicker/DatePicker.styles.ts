import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';
import {
  commonInputContainerStyles,
  commonInputStyles,
} from '../Inputs.styles';

export const StyledDatePickerContainer = styled.div<{ disabled?: boolean }>`
  ${() => commonInputContainerStyles}
  input[type='text'] {
    ${() => commonInputStyles}
    &::placeholder {
      color: ${COLORS.mediumGray};
    }
    &:focus-visible {
      outline: none;
    }
  }
`;

export const StyledDatePickerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledDatePickerTextWrapper = styled.div`
  flex-grow: 1;
  min-width: 0;
`;

// Anchors the native calendar next to the button that opens it
export const StyledDatePickerCalendar = styled.div`
  position: relative;
  flex-shrink: 0;
`;

// The native date input is only the source of the calendar: it is never
// shown nor focused, the text field next to it is the actual input
export const StyledNativeDateInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 100%;
  opacity: 0;
  pointer-events: none;
`;
