import { UserAchievement } from '@/src/api/types';
import { DepartmentName } from '@/src/constants/departements';
import { Genders } from '@/src/constants/genders';
import { UserRoles } from '@/src/constants/users';

export interface HeaderProfileProps {
  isEditable?: boolean;
  id: string;
  isAvailable: boolean;
  firstName: string;
  lastName: string;
  role: UserRoles;
  gender: Genders;
  department: DepartmentName | null;
  introduction?: string;
  hasPicture: boolean;
  achievements: UserAchievement[];

  // Stats
  createdAt: string | null;
  averageDelayResponse: number | null;
  responseRate: number | null;
  totalConversationWithMirrorRoleCount: number | null;
  lastConnection: string;

  // Only for own profile
  phone?: string;
  email?: string;
}
