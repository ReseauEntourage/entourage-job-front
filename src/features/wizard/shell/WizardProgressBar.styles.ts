import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

const BADGE_SIZE = 30;

export const StyledWizardProgressBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
  gap: 16px;
`;

export const StyledWizardStep = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

export const StyledWizardStepBadge = styled.div<{
  $completed: boolean;
  $current: boolean;
}>`
  width: ${BADGE_SIZE}px;
  height: ${BADGE_SIZE}px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: Poppins, sans-serif;
  font-size: 13px;
  font-weight: 600;
  background-color: ${({ $completed }) =>
    $completed ? COLORS.primaryBlue : COLORS.white};
  color: ${({ $completed }) => ($completed ? COLORS.white : COLORS.darkGray)};
  border: 2px solid
    ${({ $completed, $current }) =>
      $completed || $current ? COLORS.primaryBlue : COLORS.gray};
`;

export const StyledWizardStepText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const StyledWizardStepTitle = styled.span<{
  $completed: boolean;
  $current: boolean;
}>`
  font-family: Poppins, sans-serif;
  font-size: 13px;
  font-weight: ${({ $completed, $current }) =>
    $completed || $current ? '600' : '400'};
  color: ${({ $completed, $current }) =>
    $completed || $current ? COLORS.black : COLORS.darkGray};
  white-space: nowrap;
`;

export const StyledWizardStepDuration = styled.span`
  font-family: Poppins, sans-serif;
  font-size: 11px;
  color: ${COLORS.darkBlue};
`;

export const StyledWizardStepConnector = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${COLORS.gray};
  min-width: 60px;
  margin: 0 8px;
`;
