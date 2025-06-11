import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const SwitchWrapper = styled.label`
  position: relative;
  min-width: 52px;
  max-width: 52px;
  height: 28px;
`;

export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  opacity: 0;
  width: 0;
  height: 0;
`;

export const Slider = styled.span<{ checked: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ checked }) =>
    checked ? COLORS.green : COLORS.mediumGray};
  transition: 0.4s;
  border-radius: 34px;

  &::before {
    position: absolute;
    content: '';
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    transform: ${({ checked }) =>
      checked ? 'translateX(22px)' : 'translateX(0)'};
  }
`;
