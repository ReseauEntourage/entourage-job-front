import React from 'react';
import { Section, Text } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { COLORS } from '@/src/constants/styles';
import {
  StyledConnectedStepsGrid,
  StyledStep,
  StyledStepBadge,
  StyledStepIcon,
  StyledStepsGrid,
} from './ConnectedStepsGrid.styles';

export interface ConnectedStep {
  title: string;
  description: string;
  illu: React.ReactNode;
}

interface ConnectedStepsGridProps {
  title: string;
  steps: ConnectedStep[];
}

export const ConnectedStepsGrid = ({
  title,
  steps,
}: ConnectedStepsGridProps) => {
  return (
    <Section className="custom-page">
      <StyledConnectedStepsGrid>
        <H2
          title={title}
          weight="bold"
          color={COLORS.primaryBlue}
          center
          noMarginBottom
        />

        <StyledStepsGrid>
          {steps.map((step, index) => (
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
      </StyledConnectedStepsGrid>
    </Section>
  );
};
