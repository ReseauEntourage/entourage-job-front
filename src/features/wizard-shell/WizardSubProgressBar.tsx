import React from 'react';
import {
  StyledSubProgressBarContainer,
  StyledSubProgressBarFill,
  StyledSubProgressBarLabel,
  StyledSubProgressBarTrack,
} from './WizardSubProgressBar.styles';

interface WizardSubProgressBarProps {
  currentInSection: number;
  totalInSection: number;
  sectionLabel: string;
}

export const WizardSubProgressBar = ({
  currentInSection,
  totalInSection,
  sectionLabel,
}: WizardSubProgressBarProps) => {
  if (totalInSection <= 1) {
    return null;
  }

  const percent = Math.round(((currentInSection + 1) / totalInSection) * 100);

  return (
    <StyledSubProgressBarContainer>
      <StyledSubProgressBarLabel>
        {sectionLabel} — étape {currentInSection + 1}/{totalInSection}
      </StyledSubProgressBarLabel>
      <StyledSubProgressBarTrack>
        <StyledSubProgressBarFill $percent={percent} />
      </StyledSubProgressBarTrack>
    </StyledSubProgressBarContainer>
  );
};
