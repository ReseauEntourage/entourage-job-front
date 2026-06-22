import React from 'react';
import { LucidIcon, Text } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import { TimeLineVertical } from '@/src/components/ui/TimeLines/TimeLineVertical';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';

const FLOW_STEPS: Record<
  RegistrationFlow,
  { title: string; duration: string }[]
> = {
  [RegistrationFlow.CANDIDATE]: [
    { title: 'Vos informations', duration: '~2 min' },
    { title: 'Votre situation économique', duration: '~1 min' },
    { title: 'Votre compte', duration: '~2 min' },
  ],
  [RegistrationFlow.COACH]: [
    { title: 'Vos informations', duration: '~2 min' },
    { title: 'Votre compte', duration: '~2 min' },
  ],
  [RegistrationFlow.REFERER]: [{ title: 'Votre compte', duration: '~3 min' }],
  [RegistrationFlow.COMPANY]: [
    { title: 'Votre rôle', duration: '~1 min' },
    { title: 'Votre entreprise', duration: '~1 min' },
    { title: 'Vos informations', duration: '~2 min' },
    { title: 'Votre compte', duration: '~2 min' },
  ],
};

interface WizardFlowStepsSummaryProps {
  flow: RegistrationFlow | null;
}

export const WizardFlowStepsSummary = ({
  flow,
}: WizardFlowStepsSummaryProps) => {
  if (!flow) {
    return (
      <Text>
        Sélectionnez un rôle pour découvrir les étapes de votre inscription.
      </Text>
    );
  }

  const steps = FLOW_STEPS[flow];

  return (
    <>
      <H5
        title={`${steps.length} étape${
          steps.length > 1 ? 's' : ''
        } pour compléter votre inscription`}
      />
      <Text>
        Votre parcours est personnalisé en fonction de votre situation pour vous
        accompagner au mieux.
      </Text>
      <TimeLineVertical.Container style={{ marginTop: '16px' }}>
        {steps.map((step, index) => (
          <TimeLineVertical.Item
            key={index}
            number={index + 1}
            isLast={index === steps.length - 1}
          >
            <H5 title={step.title} noMarginBottom />
            <Text>
              <LucidIcon name="Clock" size={14} /> {step.duration}
            </Text>
          </TimeLineVertical.Item>
        ))}
      </TimeLineVertical.Container>
    </>
  );
};
