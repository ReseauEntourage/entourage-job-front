import { authenticationConfig } from './authentication';
import { companyConfig } from './company';
import { currentUserConfig } from './current-user';
import { messagingConfig } from './messaging';
import { notificationsConfig } from './notifications';
import { onboardingConfig } from './onboarding';
import { profileCompletionConfig } from './profile-completion';
import { profilesConfig } from './profiles';
import { recruitementAlertsConfig } from './recruitement-alerts';
import { referingConfig } from './refering';
import { registrationConfig } from './registration';
import { UseCaseConfigType } from './types';

export const useCasesConfig: UseCaseConfigType = {
  authenticationConfig,
  currentUserConfig,
  profilesConfig,
  recruitementAlertsConfig,
  registrationConfig,
  notificationsConfig,
  onboardingConfig,
  messagingConfig,
  referingConfig,
  profileCompletionConfig,
  companyConfig,
};
