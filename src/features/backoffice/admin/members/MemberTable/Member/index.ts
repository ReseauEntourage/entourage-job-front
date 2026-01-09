import { MemberDesktop } from '@/src/features/backoffice/admin/members/MemberTable/Member/Member.desktop';
import { MemberMobile } from '@/src/features/backoffice/admin/members/MemberTable/Member/Member.mobile';
import { platform } from 'src/utils/Device';

export const Member = platform({
  Desktop: MemberDesktop,
  Mobile: MemberMobile,
});
