import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export const StyledImpactBackground = styled.div`
  background-image: url('/static/img/wave-pattern-blue-pro.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const StyledImpactContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const SHIFT = 45;
export const StyledInsightsContainer = styled.div<{
  $withIllu?: boolean;
  $invertBgColor?: boolean;
  $nbColumns?: number;
}>`
  display: grid;
  grid-template-columns: 1fr;
  background: ${(props) =>
    !props.$invertBgColor ? COLORS.white : COLORS.hoverBlue};
  margin-top: 20px;

  @media (min-width: ${BREAKPOINTS.desktop}px) {
    margin-top: ${(props) => (props.$withIllu ? SHIFT + 20 : 20)}px;

    grid-template-columns: repeat(${(props) => props.$nbColumns || 4}, 1fr);

    > div {
      margin-top: -${(props) => (props.$withIllu ? SHIFT : 0)}px;
      box-sizing: border-box;
    }
  }
  gap: 30px;
  flex: 1;

  padding: 20px 30px 30px 30px;
  padding-top: ${(props) => (!props.$withIllu ? 60 : 0)}px;
  border-radius: 110px;
`;

export const StyledInsight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;
