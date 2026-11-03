import React from 'react';
import { Alert } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import { StyledOnboardingGateNotice } from './OnboardingGateNotice.styles';

export const ONBOARDING_GATE_NOTICE_TEXT =
  'Terminez votre profil pour accéder à votre espace';

/**
 * Explains why the user lands in the onboarding when they were sent away from
 * a backoffice page (see useOnboardingRedirect). Same wording whatever the
 * requested page.
 */
export const OnboardingGateNotice = () => (
  <StyledOnboardingGateNotice data-testid="onboarding-gate-notice">
    <Alert type={AlertType.Info}>{ONBOARDING_GATE_NOTICE_TEXT}</Alert>
  </StyledOnboardingGateNotice>
);
