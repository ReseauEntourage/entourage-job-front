import type { JSX } from 'react';
import { MemberDesktop } from 'src/components/backoffice/admin/members/MemberTable/Member/Member.desktop';
import { MemberMobile } from 'src/components/backoffice/admin/members/MemberTable/Member/Member.mobile';
import { plateform } from 'src/utils/Device';
import { MemberProps } from './Member.types';

export const Member: (props: MemberProps) => JSX.Element = plateform({
  Desktop: MemberDesktop,
  Mobile: MemberMobile,
});
