import styled from 'styled-components';
import { COLORS, BREAKPOINTS } from 'src/constants/styles';

export const StyledTitleSection = styled.div`
  text-align: center;
  margin: 0;
  z-index: 100;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  box-sizing: border-box;
  padding: 48px 16px 28px;
  svg {
    min-width: 24px;
    rect {
      fill: ${(props) => {
        return props.svgColor || COLORS.primaryOrange;
      }};
      stroke: ${(props) => {
        return props.svgStroke || 'white';
      }};
    }
  }
  .title h2 {
    color: ${(props) => {
      return props.titleColor || 'black';
    }};
    margin: 0 20px;
    font-size: 16px;
    font-weight: 700;
  }
  @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
    padding: 48px 0 28px;
    .title h2 {
      font-size: 24px;
    }
  }
`;
