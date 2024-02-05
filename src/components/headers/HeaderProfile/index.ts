import { plateform } from 'src/utils/Device';
import { HeaderProfileDesktop } from './HeaderProfile.desktop';
import { HeaderProfileMobile } from './HeaderProfile.mobile';

export const HeaderProfile = plateform({
  Desktop: HeaderProfileDesktop,
  Mobile: HeaderProfileMobile,
});
