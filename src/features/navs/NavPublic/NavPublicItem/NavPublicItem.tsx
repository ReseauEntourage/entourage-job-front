import { platform } from '@/src/utils/Device';
import { NavPublicItemDesktop } from './NavPublicItem.desktop';
import { NavPublicItemMobile } from './NavPublicItem.mobile';

export const NavPublicItem = platform({
  Desktop: NavPublicItemDesktop,
  Mobile: NavPublicItemMobile,
});
