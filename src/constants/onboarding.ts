import { UserRoles } from './users';

export enum OnboardingStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

// Rôles pour lesquels l'onboarding ne doit pas être bloquant (pas de redirection forcée)
export const onboardingExcludedRoles: UserRoles[] = [
  UserRoles.ADMIN,
  UserRoles.REFERER,
];
