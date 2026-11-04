import React from 'react';
import { Alert, LucidIcon, Text } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import { COLORS } from '@/src/constants/styles';
import { StyledOnboardingGateNotice } from './OnboardingGateNotice.styles';

export const ONBOARDING_GATE_NOTICE_TEXT =
  'Terminez votre profil pour accéder à votre espace';

/**
 * Explains why the user lands in the onboarding when they were sent away from
 * a backoffice page (see useOnboardingRedirect). Same wording whatever the
 * requested page. White text and icon on the filled blue background: the
 * Info alert's default dark text is meant for its light (outlined) variant.
 */
export const OnboardingGateNotice = () => (
  <StyledOnboardingGateNotice data-testid="onboarding-gate-notice">
    <Alert
      type={AlertType.Info}
      icon={<LucidIcon name="Info" color={COLORS.white} />}
    >
      <Text color="white">{ONBOARDING_GATE_NOTICE_TEXT}</Text>
    </Alert>
  </StyledOnboardingGateNotice>
);
