import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';
import { LINE_HEIGHT_MULTIPLIER, sizesPx } from '../../Text/Text.utils';
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
  align-items: stretch;
  gap: 8px;
`;

export const StyledDatePickerTextWrapper = styled.div`
  position: relative;
  flex-grow: 1;
  min-width: 0;
`;

// Shows what is left to type (e.g. `19/--/----`) behind the typed text, with
// the same box as the text field so that both texts line up
export const StyledDatePickerGhost = styled.div`
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  padding: 12px 16px;
  border: 2px solid transparent;
  font-family: Poppins, sans-serif;
  font-size: ${sizesPx.desktop.normal}px;
  line-height: ${LINE_HEIGHT_MULTIPLIER * sizesPx.desktop.normal}px;
  color: ${COLORS.mediumGray};
  white-space: pre;
  overflow: hidden;
  pointer-events: none;

  span {
    visibility: hidden;
  }
`;

// Anchors the native calendar next to the button that opens it. The button
// is as tall as the text field and square.
export const StyledDatePickerCalendar = styled.div`
  position: relative;
  flex-shrink: 0;
  display: flex;
  // Same height as the text field (2 borders and 2 paddings around a line),
  // so that the button is as wide as it is tall
  width: ${LINE_HEIGHT_MULTIPLIER * sizesPx.desktop.normal + 28}px;

  > button {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
`;

// The native date input lies, invisible, over the calendar button: a tap or a
// click lands on it, which is the only way iOS Safari opens its calendar. The
// button underneath stays for keyboard users and screen readers.
export const StyledNativeDateInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 1;

  &:disabled {
    cursor: not-allowed;
  }
`;
