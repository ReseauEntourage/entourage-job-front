import { platform } from 'src/utils/Device';
import { NavPublicContentDesktop } from './NavPublicContent.desktop';
import { NavPublicContentMobile } from './NavPublicContent.mobile';

export const NavPublicContent = platform({
  Desktop: NavPublicContentDesktop,
  Mobile: NavPublicContentMobile,
});
