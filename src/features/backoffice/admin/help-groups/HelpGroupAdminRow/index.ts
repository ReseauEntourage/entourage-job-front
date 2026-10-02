import { platform } from '@/src/utils/Device';
import { HelpGroupAdminRowDesktop } from './HelpGroupAdminRow.desktop';
import { HelpGroupAdminRowMobile } from './HelpGroupAdminRow.mobile';

export const HelpGroupAdminRow = platform({
  Desktop: HelpGroupAdminRowDesktop,
  Mobile: HelpGroupAdminRowMobile,
});

export * from './HelpGroupAdminActions';
