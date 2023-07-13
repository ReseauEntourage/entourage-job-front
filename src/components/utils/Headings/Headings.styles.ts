import styled from 'styled-components';
import { COLORS, BREAKPOINTS } from 'src/constants/styles';

export const StyledH1 = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${(props) => {
    if (COLORS[props.color]) {
      return COLORS[props.color];
    }
    if (props.color) {
      return props.color;
    }
    return 'black';
  }};
  &.center {
    text-align: center;
  }
  @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
    font-size: 24px;
  }
`;

export const StyledH2 = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => {
    if (COLORS[props.color]) {
      return COLORS[props.color];
    }
    if (props.color) {
      return props.color;
    }
    return `${COLORS.primaryOrange}`;
  }};
  &.big {
    color: ${COLORS.darkGrayFont};
    font-weight: 400;
    font-size: 36px;
  }
  &.light {
    font-weight: 400;
  }
  &.center {
    text-align: center;
  }
  @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
    font-size: 20px;
    &.big {
      font-size: 24px;
    }
  }
`;

export const StyledH3 = styled.h3`
  font-size: 24px;
  font-weight: 700;
  line-height: 36px;
  color: black;
  color: ${(props) => {
    if (COLORS[props.color]) {
      return COLORS[props.color];
    }
    if (props.color) {
      return props.color;
    }
    return 'black';
  }};
  &.center {
    text-align: center;
  }
`;

export const StyledH5 = styled.h5`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  /* margin-bottom: 24px; */
  color: ${(props) => {
    if (COLORS[props.color]) {
      return COLORS[props.color];
    }
    if (props.color) {
      return props.color;
    }
    return 'black';
  }};
  &.center {
    text-align: center;
  }
`;

export const StyledH6 = styled.h6`
  font-size: 14px;
  font-weight: 700;
  line-height: 14px;
  margin-bottom: 24px;
  color: ${(props) => {
    if (COLORS[props.color]) {
      return COLORS[props.color];
    }
    if (props.color) {
      return props.color;
    }
    return 'black';
  }};
  &.center {
    text-align: center;
  }
`;
