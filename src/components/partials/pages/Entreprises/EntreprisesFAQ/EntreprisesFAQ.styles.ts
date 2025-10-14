import styled from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

export const StyledEntrepriseFAQContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
  }
`;

export const StyledFirstColumn = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
`;

export const StyledTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const StyledFAQContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;
