import { authentication } from './authentication';
import { currentUser } from './current-user';
import { cv } from './cv';
import { notifications } from './notifications';
import { onboarding } from './onboarding';
import { opportunities } from './opportunities';
import { profiles } from './profiles';
import { registration } from './registration';

export const extendedSlices = [
  authentication,
  currentUser,
  profiles,
  cv,
  opportunities,
  registration,
  notifications,
  onboarding,
];
