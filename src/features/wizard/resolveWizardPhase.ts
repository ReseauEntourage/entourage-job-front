import { User } from '@/src/api/types';

export type WizardPhase = 'registration' | 'email-confirmation' | 'onboarding';

// resolveWizardPhase - Détermine la phase du wizard à partir de l'utilisateur
// courant et du statut de création de compte. Un utilisateur connecté (currentUser)
// est toujours en onboarding, même si isCreateUserSucceeded reste vrai (cas de
// reprise après rechargement).
export const resolveWizardPhase = (
  currentUser: User | null,
  isCreateUserSucceeded: boolean
): WizardPhase => {
  if (currentUser) {
    return 'onboarding';
  }
  if (isCreateUserSucceeded) {
    return 'email-confirmation';
  }
  return 'registration';
};
