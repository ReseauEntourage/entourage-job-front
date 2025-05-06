import { Department } from 'src/constants/departements';
import { UserRoles } from 'src/constants/users';

export interface HeaderProfileProps {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  department: Department;
  description: string;
  isAvailable: boolean;
  isEditable?: boolean;
  cvUrl?: string;
  hasExternalCv: boolean;
}
