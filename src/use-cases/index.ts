import { authenticationConfig } from './authentication';
import { currentUserConfig } from './current-user';
import { messagingConfig } from './messaging';
import { notificationsConfig } from './notifications';
import { onboardingConfig } from './onboarding';
import { profileCompletionConfig } from './profile-completion';
import { profilesConfig } from './profiles';
import { referingConfig } from './refering';
import { registrationConfig } from './registration';
import { UseCaseConfigType } from './types';

export const useCasesConfig: UseCaseConfigType = {
  authenticationConfig,
  currentUserConfig,
  profilesConfig,
  registrationConfig,
  notificationsConfig,
  onboardingConfig,
  messagingConfig,
  referingConfig,
  profileCompletionConfig,
};
