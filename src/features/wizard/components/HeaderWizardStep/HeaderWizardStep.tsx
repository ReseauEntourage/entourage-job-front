import React from 'react';
import { Text } from '@/src/components/ui';
import { H4 } from '@/src/components/ui/Headings';
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
}

export const HeaderWizardStep = ({
  title,
  description,
  subProgress,
}: HeaderWizardStepProps) => {
  return (
    <StyledContainer>
      {subProgress && (
        <StyledDesktopSubProgress>
          <WizardSubProgressBar
            sectionLabel={subProgress.sectionLabel}
            currentInSection={subProgress.currentInSection}
            totalInSection={subProgress.totalInSection}
          />
        </StyledDesktopSubProgress>
      )}
      <H4 title={title} />
      {description && <Text size="large">{description}</Text>}
    </StyledContainer>
  );
};
