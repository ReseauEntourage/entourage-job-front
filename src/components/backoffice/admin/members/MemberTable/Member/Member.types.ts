import { User } from '@/src/api/types';
import { UserRoles } from 'src/constants/users';

export type MemberColumn =
  | 'type'
  | 'zone'
  | 'lastConnection'
  | 'address'
  | 'gender'
  | 'phone'
  | 'cvUrl'
  | 'organization'
  | 'countRefered'
  | 'selection';

export const MemberTableByRole = {
  [UserRoles.CANDIDATE]: ['zone', 'lastConnection'],
  [UserRoles.COACH]: ['zone', 'lastConnection'],
  [UserRoles.REFERER]: [
    'organization',
    'zone',
    'countRefered',
    'lastConnection',
  ],
};

export interface MemberProps {
  columns: MemberColumn[];
  member: User;
  role: UserRoles | UserRoles[];
  disableLink?: boolean;
}
