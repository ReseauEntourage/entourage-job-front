import { authenticationConfig, UseCaseConfigType } from './authentication';
import { cvConfig } from './cv';
import { opportunitiesConfig } from './opportunities';
import { profilesConfig } from './profiles';
import { notificationsConfig } from './notifications';

export const useCasesConfig: UseCaseConfigType = {
  authenticationConfig,
  profilesConfig,
  cvConfig,
  opportunitiesConfig,
  notificationsConfig,
};
