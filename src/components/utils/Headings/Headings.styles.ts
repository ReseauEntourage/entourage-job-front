import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';
import { FONT_WEIGHTS, StyledHeadingProps } from './Headings.types';

export const StyledH1 = styled.h1<StyledHeadingProps>`
  font-size: ${(props) => (props.mobile ? '24px' : '32px')};
  line-height: 1.5;
  font-weight: ${(props) => FONT_WEIGHTS[props.weight]};
  color: ${(props) => {
    if (COLORS[props.color]) {
      return COLORS[props.color];
    }
    if (props.color) {
      return props.color;
    }
    return COLORS.black;
  }};
  text-align: ${(props) => (props.center ? 'center' : 'left')};
  margin: 0;
`;

export const StyledH2 = styled.h2<StyledHeadingProps>`
  font-size: ${(props) => (props.mobile ? '20px' : '28px')};
  line-height: 1.5;
  font-weight: ${(props) => FONT_WEIGHTS[props.weight]};
  color: ${(props) => {
    if (COLORS[props.color]) {
      return COLORS[props.color];
    }
    if (props.color) {
      return props.color;
    }
    return COLORS.black;
  }};
  text-align: ${(props) => (props.center ? 'center' : 'left')};
  span.orange {
    color: ${COLORS.primaryBlue};
  }
  margin: 0;
`;

export const StyledH3 = styled.h3<StyledHeadingProps>`
  font-weight: ${(props) => FONT_WEIGHTS[props.weight]};
  line-height: 1.5;
  color: black;
  color: ${(props) => {
    if (COLORS[props.color]) {
      return COLORS[props.color];
    }
    if (props.color) {
      return props.color;
    }
    return COLORS.black;
  }};
  text-align: ${(props) => (props.center ? 'center' : 'left')};
  font-size: ${(props) => (props.mobile ? '18px' : '24px')};
  margin: 0;
`;

export const StyledH4 = styled.h4<StyledHeadingProps>`
  font-weight: ${(props) => FONT_WEIGHTS[props.weight]};
  line-height: 1.5;
  color: ${(props) => {
    if (COLORS[props.color]) {
      return COLORS[props.color];
    }
    if (props.color) {
      return props.color;
    }
    return COLORS.black;
  }};
  text-align: ${(props) => (props.center ? 'center' : 'left')};
  font-size: ${(props) => (props.mobile ? '16px' : '20px')};
  margin: 0;
`;

export const StyledH5 = styled.h5<StyledHeadingProps>`
  font-weight: ${(props) => FONT_WEIGHTS[props.weight]};
  line-height: 1.5;
  margin-top: 0;
  color: ${(props) => {
    if (COLORS[props.color]) {
      return COLORS[props.color];
    }
    if (props.color) {
      return props.color;
    }
    return COLORS.black;
  }};
  text-align: ${(props) => (props.center ? 'center' : 'left')};
  font-size: ${(props) => (props.mobile ? '14px' : '16px')};
  margin: 0;
`;

export const StyledH6 = styled.h6<StyledHeadingProps>`
  font-size: 14px;
  font-weight: ${(props) => FONT_WEIGHTS[props.weight]};
  line-height: 1.5;
  color: ${(props) => {
    if (COLORS[props.color]) {
      return COLORS[props.color];
    }
    if (props.color) {
      return props.color;
    }
    return COLORS.black;
  }};
  text-align: ${(props) => (props.center ? 'center' : 'left')};
  margin: 0;
`;
