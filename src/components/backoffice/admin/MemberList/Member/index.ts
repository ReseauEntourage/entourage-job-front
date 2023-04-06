import { MemberDesktop } from 'src/components/backoffice/admin/MemberList/Member/Member.desktop';
import { MemberMobile } from 'src/components/backoffice/admin/MemberList/Member/Member.mobile';
import { plateform } from 'src/utils/Device';

export const Member = plateform({
  Desktop: MemberDesktop,
  Mobile: MemberMobile,
});
