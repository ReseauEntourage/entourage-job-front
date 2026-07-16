import { User } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';

export type WizardPhase = 'registration' | 'email-confirmation' | 'onboarding';

export type ReduxRequestStatus =
  (typeof ReduxRequestEvents)[keyof typeof ReduxRequestEvents];

// resolveWizardPhase - Détermine la phase du wizard à partir de l'utilisateur
// courant et du statut de création de compte. Un utilisateur connecté (currentUser)
// est toujours en onboarding, même si createUserStatus reste SUCCEEDED (cas de
// reprise après rechargement).
export const resolveWizardPhase = (
  currentUser: User | null,
  createUserStatus: ReduxRequestStatus
): WizardPhase => {
  if (currentUser) {
    return 'onboarding';
  }
  if (createUserStatus === ReduxRequestEvents.SUCCEEDED) {
    return 'email-confirmation';
  }
  return 'registration';
};
