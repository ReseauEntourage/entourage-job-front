import { authenticationConfig } from './authentication';
import { companyConfig } from './company';
import { currentUserConfig } from './current-user';
import { elearningConfig } from './elearning';
// Side-effect only: `donation-block` is fully RTK Query (no slice), so it is
// not part of `useCasesConfig`, but its `injectEndpoints` registration still
// needs to run at app startup.
import './donation-block';
import { eventsConfig } from './events';
import { gamificationConfig } from './gamification';
import { messagingConfig } from './messaging';
import { notificationsConfig } from './notifications';
import { onboardingConfig as onboardingNewConfig } from './onboarding';
import { onboardingConfig } from './onboardingOld';
// Side-effect only: `profile-completion` has no slice/saga left (fully
// migrated to RTK Query — see design.md Decision 5), so it can't be part of
// `useCasesConfig` below, but its `injectEndpoints`/`listenerMiddleware`
// registration still needs to run at app startup like every other domain's.
import './profile-completion';
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
  companyConfig,
  eventsConfig,
  onboardingNewConfig,
  elearningConfig,
  gamificationConfig,
};
