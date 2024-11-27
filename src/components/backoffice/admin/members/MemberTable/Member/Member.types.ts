import { UserWithUserCandidate } from 'src/api/types';
import { USER_ROLES, UserRole } from 'src/constants/users';

export type MemberColumn =
  | 'associatedUser'
  | 'type'
  | 'zone'
  | 'lastConnection'
  | 'employed'
  | 'address'
  | 'gender'
  | 'phone'
  | 'cvUrl'
  | 'cvStatus'
  | 'cvHidden'
  | 'organization'
  | 'countRefered'
  | 'selection';

export const MemberTableByRole = {
  [USER_ROLES.CANDIDATE]: [
    'zone',
    'associatedUser',
    'lastConnection',
    'employed',
    'cvStatus',
    'cvHidden',
    'selection',
  ],
  [USER_ROLES.COACH]: [
    'zone',
    'associatedUser',
    'lastConnection',
    'employed',
    'cvStatus',
    'cvHidden',
    'selection',
  ],
  [USER_ROLES.REFERER]: [
    'organization',
    'zone',
    'countRefered',
    'lastConnection',
  ],
};

export interface MemberProps {
  columns: MemberColumn[];
  member: UserWithUserCandidate;
  role: UserRole | UserRole[];
  selectionCallback?: (memberId: string) => void;
  isEditable?: boolean;
  setMember?: (user: UserWithUserCandidate) => void;
  disableLink?: boolean;
}
