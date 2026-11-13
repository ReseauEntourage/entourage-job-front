import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

const checkMark = (color: string) =>
  `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg width="14" height="11" viewBox="0 0 14 11" xmlns="http://www.w3.org/2000/svg"><polygon fill="${color}" points="12 1 5 7.5 2 5 1 5.5 5 10 13 1.5" /></svg>`
  )}")`;

/** Square checkbox of the filters, drawn by hand. */
export const StyledFilterCheckbox = styled.input.attrs({ type: 'checkbox' })`
  box-sizing: border-box;
  display: inline-block;
  flex: none;
  width: 16px;
  height: 16px;
  margin: 0;
  overflow: hidden;
  vertical-align: middle;
  appearance: none;
  border: 1px solid ${COLORS.checkboxBorder};
  border-radius: 0;
  background-color: ${COLORS.white};
  background-repeat: no-repeat;
  background-position: 50% 50%;
  font: inherit;
  transition: 0.2s ease-in-out;
  transition-property: background-color, border;

  &:not(:disabled) {
    cursor: pointer;
  }

  &:focus {
    outline: none;
    border-color: ${COLORS.primaryBlue};
  }

  &:checked {
    background-color: ${COLORS.primaryBlue};
    background-image: ${checkMark(COLORS.white)};
    border-color: transparent;
  }

  &:checked:focus {
    background-color: ${COLORS.primaryBlue};
  }

  /* Keyboard focus stays visible on a checked box, whose border is transparent. */
  &:focus-visible {
    outline: 2px solid ${COLORS.primaryBlue};
    outline-offset: 2px;
  }

  &:disabled {
    background-color: ${COLORS.sectionMuted};
    border-color: ${COLORS.lightRule};
  }

  &:disabled:checked {
    background-image: ${checkMark(COLORS.mutedText)};
  }
`;
