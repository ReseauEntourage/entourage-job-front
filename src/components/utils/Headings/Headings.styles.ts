import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';
import { StyledHeadingProps } from './Headings.types';

export const StyledH1 = styled.h1<StyledHeadingProps>`
  font-size: ${(props) => (props.mobile ? '24px' : '35px')};
  font-weight: ${(props) => props.weight};
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
`;

export const StyledH2 = styled.h2<StyledHeadingProps>`
  font-size: ${(props) => (props.mobile ? '20px' : '28px')};
  font-weight: ${(props) => props.weight};
  color: ${(props) => {
    if (COLORS[props.color]) {
      return COLORS[props.color];
    }
    if (props.color) {
      return props.color;
    }
    return `${COLORS.primaryBlue}`;
  }};
  text-align: ${(props) => (props.center ? 'center' : 'left')};
  &.big {
    font-size: ${(props) => (props.mobile ? '24px' : '36px')};
  }
  span.orange {
    color: ${COLORS.primaryBlue};
  }
`;

export const StyledH3 = styled.h3<StyledHeadingProps>`
  font-weight: ${(props) => props.weight};
  line-height: 36px;
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
`;

export const StyledH4 = styled.h4<StyledHeadingProps>`
  font-weight: ${(props) => props.weight};
  line-height: 24px;
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
`;

export const StyledH5 = styled.h5<StyledHeadingProps>`
  font-weight: ${(props) => props.weight};
  line-height: 24px;
  margin-top: 0;
  /* margin-bottom: 24px; */
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
`;

export const StyledH6 = styled.h6<StyledHeadingProps>`
  font-size: 14px;
  font-weight: ${(props) => props.weight};
  line-height: 14px;
  margin-bottom: 24px;
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
`;
