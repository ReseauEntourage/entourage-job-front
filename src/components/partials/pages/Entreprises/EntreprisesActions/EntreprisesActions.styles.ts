import styled from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

export const StyledEntreprisesActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 100px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
    gap: 30px;
  }
`;
