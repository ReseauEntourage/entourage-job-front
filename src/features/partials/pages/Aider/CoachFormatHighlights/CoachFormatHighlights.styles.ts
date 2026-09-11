import { styled } from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

export const StyledCoachFormatHighlights = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
`;

export const StyledCardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  width: 100%;
  margin-top: 32px;

  @media (min-width: ${BREAKPOINTS.desktop}px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StyledCTAContainer = styled.div`
  margin-top: 32px;
`;
