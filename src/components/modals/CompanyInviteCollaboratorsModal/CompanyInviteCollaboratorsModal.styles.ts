import styled from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

export const StyledModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const StyledPreambleStepContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 75px;
  margin-top: 5px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 32px;
    flex-direction: column;
  }
`;

export const StyledPreambleStep = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;
