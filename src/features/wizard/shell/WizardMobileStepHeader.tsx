import React from 'react';
import {
  StyledWizardMobileStepHeader,
  StyledWizardMobileStepHeaderRow,
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
  /** Shown on the badge row (right side), or on its own row above customContent */
  helpLink?: React.ReactNode;
}

export const WizardMobileStepHeader = ({
  subProgress,
  progressPercent,
  customContent,
  helpLink,
}: WizardMobileStepHeaderProps) => {
  if (customContent) {
    return (
      <StyledWizardMobileStepHeader>
        {helpLink && (
          <StyledWizardMobileStepHeaderRow>
            {helpLink}
          </StyledWizardMobileStepHeaderRow>
        )}
        {customContent}
      </StyledWizardMobileStepHeader>
    );
  }

  return (
    <StyledWizardMobileStepHeader>
      {(subProgress || helpLink) && (
        <StyledWizardMobileStepHeaderRow>
          {subProgress && (
            <WizardSubProgressBar
              sectionLabel={subProgress.sectionLabel}
              currentInSection={subProgress.currentInSection}
              totalInSection={subProgress.totalInSection}
            />
          )}
          {helpLink}
        </StyledWizardMobileStepHeaderRow>
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
