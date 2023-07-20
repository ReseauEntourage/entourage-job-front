import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

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
  &.mobile {
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
  &.mobile {
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
  &.mobile {
    font-size: 18px;
  }
`;

export const StyledH4 = styled.h4`
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
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
  &.mobile {
    font-size: 16px;
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
  &.mobile {
    font-size: 14px;
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

/*

28px: Expériences => 20 mobile
24px: carousel, CTA main => 18 mobile
20px: informations, Passions
16px: Partagez, coup de pouce, sous-cta => 14 mobile */
