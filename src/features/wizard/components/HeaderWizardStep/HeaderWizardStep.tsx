import React from 'react';
import { Text } from '@/src/components/ui';
import { H4 } from '@/src/components/ui/Headings';
import { OnboardingReferentContact } from '../../shell/OnboardingReferentContact';
import { WizardSubProgressBar } from '../../shell/WizardSubProgressBar';
import {
  StyledContainer,
  StyledDesktopSubProgress,
} from './HeaderWizardStep.styles';

interface HeaderWizardStepProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  subProgress?: {
    sectionLabel: string;
    currentInSection: number;
    totalInSection: number;
  } | null;
  /** True once the user is logged in and going through the onboarding (not registration). */
  isOnboardingPhase?: boolean;
}

export const HeaderWizardStep = ({
  title,
  description,
  subProgress,
  isOnboardingPhase = false,
}: HeaderWizardStepProps) => {
  return (
    <StyledContainer>
      {(subProgress || isOnboardingPhase) && (
        <StyledDesktopSubProgress>
          {subProgress && (
            <WizardSubProgressBar
              sectionLabel={subProgress.sectionLabel}
              currentInSection={subProgress.currentInSection}
              totalInSection={subProgress.totalInSection}
            />
          )}
          {isOnboardingPhase && <OnboardingReferentContact />}
        </StyledDesktopSubProgress>
      )}
      <H4 title={title} />
      {description && <Text size="large">{description}</Text>}
    </StyledContainer>
  );
};
