import { platform } from 'src/utils/Device';
import { NavConnectedContentDesktop } from './NavConnectedContent.desktop';
import { NavConnectedContentMobile } from './NavConnectedContent.mobile';

export const NavConnectedContent = platform({
  Desktop: NavConnectedContentDesktop,
  Mobile: NavConnectedContentMobile,
});
