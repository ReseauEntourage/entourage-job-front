import { useEffect, useState } from 'react';
import {
  CANDIDATE_USER_ROLES,
  USER_ROLES,
  UserRole,
  NormalUserRole,
} from 'src/constants/users';
import { isRoleIncluded } from 'src/utils';

export function useContextualRole(role: UserRole) {
  const [contextualRole, setContextualRole] = useState<NormalUserRole>(
    isRoleIncluded(CANDIDATE_USER_ROLES, role)
      ? USER_ROLES.CANDIDATE
      : USER_ROLES.COACH
  );

  useEffect(() => {
    setContextualRole(
      isRoleIncluded(CANDIDATE_USER_ROLES, role)
        ? USER_ROLES.CANDIDATE
        : USER_ROLES.COACH
    );
  }, [role]);

  return {
    contextualRole,
  };
}
