import { platform } from 'src/utils/Device';
import { HeaderProfileDesktop } from './HeaderProfile.desktop';
import { HeaderProfileMobile } from './HeaderProfile.mobile';

export const HeaderProfile = platform({
  Desktop: HeaderProfileDesktop,
  Mobile: HeaderProfileMobile,
});
