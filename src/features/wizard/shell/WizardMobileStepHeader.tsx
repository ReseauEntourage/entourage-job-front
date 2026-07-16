import React from 'react';
import {
  StyledWizardMobileStepHeader,
  StyledWizardMobileStepHeaderProgressFill,
  StyledWizardMobileStepHeaderProgressStrip,
} from './WizardMobileStepHeader.styles';
import { WizardSubProgressBar } from './WizardSubProgressBar';

interface WizardMobileStepHeaderProps {
  subProgress: {
    sectionLabel: string;
    currentInSection: number;
    totalInSection: number;
  } | null;
  progressPercent: number | null;
  /** Replaces the generic section badge + shortTitle + progress bar entirely when set */
  customContent?: React.ReactNode;
}

export const WizardMobileStepHeader = ({
  subProgress,
  progressPercent,
  customContent,
}: WizardMobileStepHeaderProps) => {
  if (customContent) {
    return (
      <StyledWizardMobileStepHeader>
        {customContent}
      </StyledWizardMobileStepHeader>
    );
  }

  return (
    <StyledWizardMobileStepHeader>
      {subProgress && (
        <WizardSubProgressBar
          sectionLabel={subProgress.sectionLabel}
          currentInSection={subProgress.currentInSection}
          totalInSection={subProgress.totalInSection}
        />
      )}
      {progressPercent != null && (
        <StyledWizardMobileStepHeaderProgressStrip>
          <StyledWizardMobileStepHeaderProgressFill
            $percent={progressPercent}
          />
        </StyledWizardMobileStepHeaderProgressStrip>
      )}
    </StyledWizardMobileStepHeader>
  );
};
