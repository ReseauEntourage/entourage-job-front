import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

const WIDTH = 45;
const HEIGHT = 25;
const TRANSLATE_X_CHECKED = 19;
const HEIGHT_ROUNDED = 19;
const DECALE = 3;

export const StyledToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const StyledToggle = styled.div`
  position: relative;

  label {
    display: flex;
    align-items: center;
  }

  input {
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0px;

    &:checked + .ent-slider {
      background-color: ${COLORS.primaryBlue};
    }

    &:focus + .ent-slider {
      box-shadow: 0 0 1px ${COLORS.primaryBlue};
    }

    &:checked + .ent-slider:before {
      -webkit-transform: translateX(${TRANSLATE_X_CHECKED}px);
      -ms-transform: translateX(${TRANSLATE_X_CHECKED}px);
      transform: translateX(${TRANSLATE_X_CHECKED}px);
    }
  }
`;

export const StyledSlider = styled.div<{ isToggled: boolean }>`
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  background-color: ${({ isToggled }) =>
    isToggled ? COLORS.primaryBlue : COLORS.darkGray};
  border-radius: ${HEIGHT_ROUNDED}px;
  transition: background-color 0.4s;

  &:before {
    position: absolute;
    content: '';
    height: ${HEIGHT_ROUNDED}px;
    width: ${HEIGHT_ROUNDED}px;
    left: ${DECALE}px;
    bottom: ${DECALE}px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.4s;
    transform: ${({ isToggled }) =>
      isToggled ? `translateX(${TRANSLATE_X_CHECKED}px)` : 'none'};
  }
`;

export const StyledToggleLabel = styled.div`
  cursor: pointer;
  margin-left: 5px;
`;
