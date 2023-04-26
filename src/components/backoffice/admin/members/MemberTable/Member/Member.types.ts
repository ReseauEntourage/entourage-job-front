import { UserWithUserCandidate } from 'src/api/types';
import { UserRole } from 'src/constants/users';

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
  | 'selection';

export interface MemberProps {
  columns: MemberColumn[];
  member: UserWithUserCandidate;
  role: UserRole | UserRole[];
  callback?: (memberId: string) => void;
  isEditable?: boolean;

  setMember?: (user: UserWithUserCandidate) => void;
  disableLink?: boolean;
}
