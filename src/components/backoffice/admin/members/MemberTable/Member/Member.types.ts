import { UserWithUserCandidate } from 'src/api/types';
import { UserRoles } from 'src/constants/users';

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
  [UserRoles.CANDIDATE]: [
    'zone',
    'associatedUser',
    'lastConnection',
    'employed',
    'cvStatus',
    'cvHidden',
    'selection',
  ],
  [UserRoles.COACH]: [
    'zone',
    'associatedUser',
    'lastConnection',
    'employed',
    'cvStatus',
    'cvHidden',
    'selection',
  ],
  [UserRoles.REFERER]: [
    'organization',
    'zone',
    'countRefered',
    'lastConnection',
  ],
};

export interface MemberProps {
  columns: MemberColumn[];
  member: UserWithUserCandidate;
  role: UserRoles | UserRoles[];
  selectionCallback?: (memberId: string) => void;
  isEditable?: boolean;
  setMember?: (user: UserWithUserCandidate) => void;
  disableLink?: boolean;
}
