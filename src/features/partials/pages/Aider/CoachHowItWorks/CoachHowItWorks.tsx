import React from 'react';
import { Section, Text } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import { COLORS } from '@/src/constants/styles';
import {
  StyledCoachHowItWorks,
  StyledStep,
  StyledStepBadge,
  StyledStepIcon,
  StyledStepsGrid,
} from './CoachHowItWorks.styles';

interface Step {
  title: string;
  description: string;
  illu: React.ReactNode;
}

const STEPS: Step[] = [
  {
    title: 'Vous suivez une courte formation en ligne',
    description:
      'Une dizaine de minutes pour comprendre la posture et apprendre à communiquer avec les candidats.',
    illu: <SvgIcon name="IlluBulleQuestionCheck" width={64} height={51} />,
  },
  {
    title: 'Vous complétez votre profil',
    description:
      "Votre parcours, votre expérience et les coups de pouce que vous souhaitez proposer (relire un CV, préparer un entretien, faire découvrir votre métier, ouvrir votre carnet d'adresses, etc.)",
    illu: <SvgIcon name="IlluCV" width={64} height={66} />,
  },
  {
    title:
      'Vous êtes mis en relation avec des candidats adaptés à votre profil',
    description:
      'Vous leur proposez des coups de pouce et pouvez parcourir le réseau pour contacter d’autres candidats si vous le souhaitez.',
    illu: <SvgIcon name="IlluDossierCandidat" width={64} height={57} />,
  },
  {
    title: 'Vous échangez à votre rythme',
    description:
      'En visio ou en présentiel, vous fixez la fréquence et vous pouvez mettre en pause quand vous voulez.',
    illu: <SvgIcon name="IlluPoigneeDeMain" width={64} height={45} />,
  },
];

export const CoachHowItWorks = () => {
  return (
    <Section>
      <StyledCoachHowItWorks>
        <H2
          title="Comment ça marche ?"
          weight="bold"
          color={COLORS.primaryBlue}
          center
          noMarginBottom
        />

        <StyledStepsGrid>
          {STEPS.map((step, index) => (
            <StyledStep key={index}>
              <StyledStepIcon>{step.illu}</StyledStepIcon>
              <StyledStepBadge>{index + 1}</StyledStepBadge>
              <Text size={13} weight="bold" color="primaryBlue" center>
                {step.title}
              </Text>
              <Text size="small" weight="normal" color="black" center>
                {step.description}
              </Text>
            </StyledStep>
          ))}
        </StyledStepsGrid>
      </StyledCoachHowItWorks>
    </Section>
  );
};
