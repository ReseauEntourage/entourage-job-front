import React from 'react';
import { TimeLineHorizontal } from 'src/components/ui/TimeLines/TimeLineHorizontal';
import { UserRoles } from 'src/constants/users';
import { WizardSubStep } from 'src/use-cases/wizard/wizard.types';

interface WizardStep {
  smallTitle: string;
  duration: string;
  majorIndex: number;
}

const SUBSTEP_TO_MAJOR: Partial<Record<WizardSubStep, number>> = {
  '1.1-nudges': 0,
  '1.2-metiers-secteurs': 0,
  '1.3-personal-info': 0,
  '1.4-account': 0,
  '1.5-otp': 0,
  '2.1-elearning': 1,
  '3.1-social-situation': 2,
};

const WIZARD_STEPS_BASE: WizardStep[] = [
  { smallTitle: 'Inscription', duration: '~15 min', majorIndex: 0 },
  { smallTitle: 'E-learning', duration: '~10 min', majorIndex: 1 },
];

const STEP_SOCIAL: WizardStep = {
  smallTitle: 'Ma situation',
  duration: '~5 min',
  majorIndex: 2,
};

interface WizardBreadcrumbProps {
  currentSubStep: WizardSubStep;
  role?: UserRoles;
}

export const WizardBreadcrumb = ({
  currentSubStep,
  role,
}: WizardBreadcrumbProps) => {
  const steps =
    role === UserRoles.CANDIDATE
      ? [...WIZARD_STEPS_BASE, STEP_SOCIAL]
      : WIZARD_STEPS_BASE;

  const currentMajor = SUBSTEP_TO_MAJOR[currentSubStep];
  if (currentMajor === undefined) {
    return null;
  }

  const BADGE_SIZE = 50;

  return (
    <TimeLineHorizontal.Container>
      <TimeLineHorizontal.Line badgeSize={BADGE_SIZE} />
      <TimeLineHorizontal.ItemGroup>
        {steps.map((step, index) => (
          <TimeLineHorizontal.Item
            key={index}
            number={index + 1}
            isLast={index === steps.length - 1}
            active={currentMajor > index}
            content={step.smallTitle}
            badgeSize={BADGE_SIZE}
            duration={step.duration}
          />
        ))}
      </TimeLineHorizontal.ItemGroup>
    </TimeLineHorizontal.Container>
  );
};
