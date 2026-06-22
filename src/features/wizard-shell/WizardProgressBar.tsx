import React from 'react';
import {
  StyledWizardProgressBar,
  StyledWizardStep,
  StyledWizardStepBadge,
  StyledWizardStepConnector,
  StyledWizardStepDuration,
  StyledWizardStepText,
  StyledWizardStepTitle,
} from './WizardProgressBar.styles';
import { WizardStep } from './wizard.types';

interface WizardProgressBarProps {
  steps: WizardStep[];
  currentIdx: number;
}

export const WizardProgressBar = ({
  steps,
  currentIdx,
}: WizardProgressBarProps) => {
  return (
    <StyledWizardProgressBar>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <StyledWizardStep>
            <StyledWizardStepBadge $active={currentIdx >= index}>
              {index + 1}
            </StyledWizardStepBadge>
            <StyledWizardStepText>
              <StyledWizardStepTitle $active={currentIdx >= index}>
                {step.smallTitle}
              </StyledWizardStepTitle>
              <StyledWizardStepDuration>
                {step.summary.duration}
              </StyledWizardStepDuration>
            </StyledWizardStepText>
          </StyledWizardStep>
          {index < steps.length - 1 && <StyledWizardStepConnector />}
        </React.Fragment>
      ))}
    </StyledWizardProgressBar>
  );
};
