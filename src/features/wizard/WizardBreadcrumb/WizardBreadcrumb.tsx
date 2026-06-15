import React from 'react';
import { UserRoles } from 'src/constants/users';
import {
  StyledBreadcrumb,
  StyledDivider,
  StyledStep,
  StyledStepDot,
} from './WizardBreadcrumb.styles';

interface WizardBreadcrumbProps {
  currentMajorStep: 1 | 2 | 3;
  role?: UserRoles;
}

export const WizardBreadcrumb = ({
  currentMajorStep,
  role,
}: WizardBreadcrumbProps) => {
  const steps = [
    { index: 1, label: 'Inscription' },
    { index: 2, label: 'E-learning' },
    ...(role === UserRoles.CANDIDATE
      ? [{ index: 3, label: 'Situation sociale' }]
      : []),
  ];

  const getStatus = (stepIndex: number): 'active' | 'done' | 'future' => {
    if (stepIndex < currentMajorStep) return 'done';
    if (stepIndex === currentMajorStep) return 'active';
    return 'future';
  };

  return (
    <StyledBreadcrumb aria-label="Progression du wizard">
      {steps.map((step, i) => {
        const status = getStatus(step.index);
        return (
          <React.Fragment key={step.index}>
            <StyledStep status={status}>
              <StyledStepDot status={status}>
                {status === 'done' ? '✓' : step.index}
              </StyledStepDot>
              {step.label}
            </StyledStep>
            {i < steps.length - 1 && <StyledDivider />}
          </React.Fragment>
        );
      })}
    </StyledBreadcrumb>
  );
};
