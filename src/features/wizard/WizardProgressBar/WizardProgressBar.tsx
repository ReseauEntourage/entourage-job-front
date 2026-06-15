import React from 'react';
import styled from 'styled-components';
import { LucidIcon, Tag, TagSize, TagVariant, Text } from 'src/components/ui';
import { COLORS } from 'src/constants/styles';
import { UserRoles } from 'src/constants/users';
import { WizardSubStep } from 'src/use-cases/wizard/wizard.types';

const StyledIndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledProgressTrack = styled.div`
  height: 8px;
  background: ${COLORS.gray};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 12px;
`;

const StyledProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${COLORS.primaryBlue};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const SUBSTEP_TO_MAJOR: Partial<Record<WizardSubStep, number>> = {
  '1.1-nudges': 0,
  '1.2-metiers-secteurs': 0,
  '1.3-personal-info': 0,
  '1.4-account': 0,
  '1.5-otp': 0,
  '2.1-elearning': 1,
  '3.1-social-situation': 2,
};

// Progress within the current major step (index / total sub-steps)
const SUBSTEP_INNER_PROGRESS: Partial<
  Record<WizardSubStep, { index: number; total: number }>
> = {
  '1.1-nudges': { index: 1, total: 5 },
  '1.2-metiers-secteurs': { index: 2, total: 5 },
  '1.3-personal-info': { index: 3, total: 5 },
  '1.4-account': { index: 4, total: 5 },
  '1.5-otp': { index: 5, total: 5 },
  '2.1-elearning': { index: 1, total: 1 },
  '3.1-social-situation': { index: 1, total: 1 },
};

interface WizardProgressBarProps {
  currentSubStep: WizardSubStep;
  role?: UserRoles;
}

export const WizardProgressBar = ({
  currentSubStep,
  role,
}: WizardProgressBarProps) => {
  const majorIdx = SUBSTEP_TO_MAJOR[currentSubStep];
  if (majorIdx === undefined) {
    return null;
  }

  const total = role === UserRoles.CANDIDATE ? 3 : 2;
  const inner = SUBSTEP_INNER_PROGRESS[currentSubStep];
  const percent = inner ? (inner.index / inner.total) * 100 : 0;

  return (
    <>
      <Tag variant={TagVariant.ExtraDarkBlue} size={TagSize.Large}>
        <StyledIndicatorContainer>
          <LucidIcon name="Calendar" color="white" />
          <Text color="white">
            Étape {majorIdx + 1} sur {total}
          </Text>
        </StyledIndicatorContainer>
      </Tag>
      <StyledProgressTrack>
        <StyledProgressFill $percent={percent} />
      </StyledProgressTrack>
    </>
  );
};
