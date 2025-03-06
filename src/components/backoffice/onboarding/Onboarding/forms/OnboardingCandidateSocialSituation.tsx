import React from 'react';
import { Alert, Text } from 'src/components/utils';

export const OnboardingCandidateSocialSituation = () => {
  return (
    <Alert>
      <Text weight="bold">
        Ces informations sont confidentielles, optionnelles et ne seront pas
        communiquées.
      </Text>
    </Alert>
  );
};
