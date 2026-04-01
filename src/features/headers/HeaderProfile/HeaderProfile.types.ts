import { DepartmentName } from '@/src/constants/departements';
import { UserRoles } from '@/src/constants/users';

export interface HeaderProfileProps {
  isEditable?: boolean;
  id: string;
  isAvailable: boolean;
  firstName: string;
  lastName: string;
  role: UserRoles;
  department: DepartmentName;
  introduction?: string;
  hasPicture: boolean;

  // Stats
  createdAt: string | null;
  averageDelayResponse: number | null;
  responseRate: number | null;
  totalConversationWithMirrorRoleCount: number | null;
  lastConnection: string;

  // Only for own profile
  phone?: string;
  email?: string;
  driverLicenses?: string[];
}
