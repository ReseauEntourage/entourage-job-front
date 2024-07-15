import { Department } from 'src/constants/departements';
import { UserRole } from 'src/constants/users';

export interface HeaderProfileProps {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: Department;
  description: string;
  isAvailable: boolean;
  isEditable?: boolean;
  cvUrl?: string;
  gotExternalCv: boolean;
}
