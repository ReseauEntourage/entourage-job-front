import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export const StyledWizardMobileStepHeader = styled.div`
  display: none;
  background-color: ${COLORS.white};
  padding: 16px 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    display: flex;
  }
`;

export const StyledWizardMobileStepHeaderProgressStrip = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background-color: ${COLORS.gray};
  overflow: hidden;
`;

export const StyledWizardMobileStepHeaderProgressFill = styled.div<{
  $percent: number;
}>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background-color: ${COLORS.primaryBlue};
  transition: width 0.3s ease;
`;
