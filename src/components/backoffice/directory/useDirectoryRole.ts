import { USER_ROLES } from 'src/constants/users';
import { useRole } from 'src/hooks/queryParams/useRole';

// Failsafe to make sure that the role query param is set
export function useDirectoryRole() {
  const roleFilter = useRole();

  return roleFilter || [USER_ROLES.COACH];
}
