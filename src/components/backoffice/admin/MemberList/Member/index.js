import { plateform } from 'src/utils/Device';
import MemberDesktop from 'src/components/backoffice/admin/MemberList/Member/component.desktop';
import MemberMobile from 'src/components/backoffice/admin/MemberList/Member/component.mobile';

export const Member = plateform({
  Desktop: MemberDesktop,
  Mobile: MemberMobile,
});
