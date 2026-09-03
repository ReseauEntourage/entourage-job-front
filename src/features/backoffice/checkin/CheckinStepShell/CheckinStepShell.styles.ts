import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export const StyledCheckinStepShell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 560px;
  margin: 0 auto;
  padding: 32px 16px;

  /* On desktop, content is wrapped in a Card that already provides its own padding. */
  @media (min-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
    padding: 32px 0;
  }
`;

export const StyledCheckinStepHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const StyledCheckinStepProgress = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const StyledCheckinStepContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledCheckinStepFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

export const StyledCheckinStepError = styled.div`
  color: ${COLORS.lightRed};
`;
