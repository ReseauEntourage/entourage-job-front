import { platform } from 'src/utils/Device';
import { OrganizationDesktop } from './Organization.desktop';
import { OrganizationMobile } from './Organization.mobile';

export const Organization = platform({
  Desktop: OrganizationDesktop,
  Mobile: OrganizationMobile,
});
