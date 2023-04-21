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
  @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
    font-size: 24px;
  }
`;

export const StyledH2 = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${COLORS.primaryOrange};
  &.big {
    color: ${COLORS.darkGrayFont};
    font-weight: 400;
    font-size: 36px;
  }
  &.light {
    font-weight: 400;
  }
  @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
    font-size: 20px;
    &.big {
      font-size: 24px;
    }
  }
`;

export const StyledH6 = styled.h6`
  font-size: 14px;
  font-weight: 700;
  line-height: 14px;
  margin-bottom: 24px;
`;
