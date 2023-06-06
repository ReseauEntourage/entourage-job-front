import { plateform } from 'src/utils/Device';
import { OrganizationDesktop } from './Organization.desktop';
import { OrganizationMobile } from './Organization.mobile';
import { OrganizationProps } from './Organization.types';

export const Organization: (props: OrganizationProps) => JSX.Element =
  plateform({
    Desktop: OrganizationDesktop,
    Mobile: OrganizationMobile,
  });
