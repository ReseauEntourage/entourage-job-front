import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const colorToHoverBackgroundColor = {
  primaryOrange: COLORS.hoverOrange,
};

export const colorToHoverColor = {
  primaryOrange: COLORS.primaryOrange,
};

export const StyledButton = styled.button`
  font-size: 14px;
  &.custom-secondary {
    padding: 6px 15px;
    background-color: white;
    border: 0.5px solid
      ${(props) => {
        return COLORS[props.color] || COLORS.primaryOrange;
      }};
    color: ${(props) => {
      return COLORS[props.color] || COLORS.primaryOrange;
    }} !important;
    border-radius: 25px;
    &:hover {
      cursor: pointer;
      background-color: ${(props) => {
        return colorToHoverBackgroundColor[props.color];
      }};
      color: ${(props) => {
        return colorToHoverColor[props.color];
      }} !important;
    }
    &.disabled {
      border-color: ${COLORS.gray};
      color: ${COLORS.gray} !important;
      &:hover {
        background-color: white;
        cursor: default;
      }
    }
  }
`;
