import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';
import {
  colorToHoverBackgroundColor,
  colorToHoverColor,
} from 'src/components/utils/Button/styles';

export const Container = styled.div`
  font-family: Poppins, sans-serif;
  display: flex;
  align-items: center;
  padding: 6px 15px;
  background-color: white;
  font-size: 12px;
  line-height: 12px;
  border: 0.5px solid
    ${(props) => {
      return COLORS[props.color] || COLORS.primaryOrange;
    }};
  color: ${(props) => {
    return COLORS[props.color] || COLORS.primaryOrange;
  }} !important;
  polygon {
    fill: ${(props) => {
      return COLORS[props.color] || COLORS.primaryOrange;
    }};
  }
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
`;

export const LabelContainer = styled.div`
  flex: 1;
`;

export const IconContainer = styled.div`
  margin-left: 10px;

`;
