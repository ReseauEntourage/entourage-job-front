import { platform } from '@/src/utils/Device';
import { NavPublicDesktop } from './NavPublic.desktop';
import { NavPublicMobile } from './NavPublic.mobile';

export const NavPublic = platform({
  Desktop: NavPublicDesktop,
  Mobile: NavPublicMobile,
});
