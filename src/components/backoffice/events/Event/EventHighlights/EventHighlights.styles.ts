import styled from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

export const StyledItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  // Mobile responsiveness
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    grid-template-columns: 1fr;
  }
`;
