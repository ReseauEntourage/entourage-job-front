import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

const WIDTH = '45px';
const HEIGHT = '25px';
const TEST = '19.5px';
const HEIGHT_ROUNDED = '19.5px';
const DECALE = '3px';

export const StyledToggleContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: c;
`;

export const StyledToggle = styled.div`
  position: relative;
  display: inline-block;
  width: ${WIDTH};
  height: ${HEIGHT};
  border: 2px solid white;
  border-radius: ${HEIGHT};
  margin-right: 10px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .ent-slider {
      background-color: ${COLORS.primaryOrange};
    }

    &:focus + .ent-slider {
      box-shadow: 0 0 1px ${COLORS.primaryOrange};
    }

    &:checked + .ent-slider:before {
      -webkit-transform: translateX(${TEST});
      -ms-transform: translateX(${TEST});
      transform: translateX(${TEST});
    }
  }
`;

export const StyledSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => {
    return props.isToggled ? COLORS.primaryOrange : 'black';
  }};
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 25.5px;

  &:before {
    position: absolute;
    content: '';
    height: ${HEIGHT_ROUNDED};
    width: ${HEIGHT_ROUNDED};
    left: ${DECALE};
    bottom: ${DECALE};
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: ${HEIGHT};
    border-radius: 50%;
    transform: ${(props) => {
      return props.isToggled ? 'translateX(19.5px)' : 'translateX(0px)';
    }};
  }
`;

export const StyledToggleLabel = styled.div`
  display: flex;
  flex-direction: column;
`;
