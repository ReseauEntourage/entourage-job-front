import { useEffect, useState } from 'react';
import {
  USER_ROLES,
  UserRole,
  NormalUserRole,
  NORMAL_USER_ROLES,
} from 'src/constants/users';
import { isRoleIncluded } from 'src/utils';

export function useContextualRole(role: UserRole) {
  const [contextualRole, setContextualRole] = useState<NormalUserRole>(
    isRoleIncluded(NORMAL_USER_ROLES, role)
      ? (role as NormalUserRole)
      : USER_ROLES.COACH
  );

  useEffect(() => {
    setContextualRole(
      isRoleIncluded(NORMAL_USER_ROLES, role)
        ? (role as NormalUserRole)
        : USER_ROLES.COACH
    );
  }, [role]);

  return {
    contextualRole,
  };
}
