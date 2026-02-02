import React from 'react';
import { Alert, Text } from '@/src/components/ui';
import { AlertVariant } from './Alert.types';
import { StyledProgramEligibilityAlertContainer } from './ProgramEligibilityAlert.styles';

export const ProgramEligibilityAlert = () => {
  return (
    <StyledProgramEligibilityAlertContainer>
      <Alert variant={AlertVariant.LightBlue}>
        <Text weight="bold">Rappel des critères</Text>
        <br />
        <Text color="black">
          Entourage Pro s&apos;adresse aux personnes qui rencontrent des
          difficultés pour accéder à l&apos;emploi, notamment celles qui vivent
          une situation de précarité matérielle et/ou qui sont isolées dans leur
          recherche (pas de réseau, sentiment d&apos;être seul face aux
          démarches, ...).
        </Text>
        <br />
        <Text color="black">
          Si vous ne vous reconnaissez pas dans ces situations, il est possible
          que ce programme ne réponde pas pleinement à vos besoins.
        </Text>
      </Alert>
    </StyledProgramEligibilityAlertContainer>
  );
};
