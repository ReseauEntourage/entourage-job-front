import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledImpactContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const SHIFT = 45;
export const StyledInsightsContainer = styled.div<{
  withIllu?: boolean;
  invertBgColor?: boolean;
}>`
  display: grid;
  grid-template-columns: 1fr;
  @media (min-width: ${BREAKPOINTS.desktop}px) {
    grid-template-columns: repeat(4, 1fr);
    background: ${(props) =>
      !props.invertBgColor ? COLORS.white : COLORS.hoverBlue};

    margin-top: ${(props) => (props.withIllu ? SHIFT + 20 : 20)}px;
    > div {
      margin-top: -${(props) => (props.withIllu ? SHIFT : 0)}px;
      box-sizing: border-box;
    }
  }
  gap: 30px;
  flex: 1;

  padding: 0px 75px 60px 75px;
  padding-top: ${(props) => (!props.withIllu ? 60 : 0)}px;
  border-radius: 110px;
`;

export const StyledInsight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;
