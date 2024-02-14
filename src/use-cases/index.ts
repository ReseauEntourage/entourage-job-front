import { authenticationConfig, UseCaseConfigType } from './authentication';
import { cvConfig } from './cv';
import { notificationsConfig } from './notifications';
import { opportunitiesConfig } from './opportunities';
import { profilesConfig } from './profiles';

export const useCasesConfig: UseCaseConfigType = {
  authenticationConfig,
  profilesConfig,
  cvConfig,
  opportunitiesConfig,
  notificationsConfig,
};
