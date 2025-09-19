import { MemberDesktop } from 'src/components/backoffice/admin/members/MemberTable/Member/Member.desktop';
import { MemberMobile } from 'src/components/backoffice/admin/members/MemberTable/Member/Member.mobile';
import { platform } from 'src/utils/Device';

export const Member = platform({
  Desktop: MemberDesktop,
  Mobile: MemberMobile,
});
