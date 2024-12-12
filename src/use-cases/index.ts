import { authenticationConfig } from './authentication';
import { currentUserConfig } from './current-user';
import { cvConfig } from './cv';
import { messagingConfig } from './messaging';
import { notificationsConfig } from './notifications';
import { onboardingConfig } from './onboarding';
import { opportunitiesConfig } from './opportunities';
import { profilesConfig } from './profiles';
import { referingConfig } from './refering';
import { registrationConfig } from './registration';
import { UseCaseConfigType } from './types';

export const useCasesConfig: UseCaseConfigType = {
  authenticationConfig,
  currentUserConfig,
  profilesConfig,
  cvConfig,
  opportunitiesConfig,
  registrationConfig,
  notificationsConfig,
  onboardingConfig,
  messagingConfig,
  referingConfig,
};
