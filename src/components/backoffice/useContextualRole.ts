import { useEffect, useState } from 'react';
import {
  CANDIDATE_USER_ROLES,
  USER_ROLES,
  UserRole,
} from 'src/constants/users';
import { isRoleIncluded } from 'src/utils';

export function useContextualRole(role: UserRole) {
  const [contextualRole, setContextualRole] = useState<
    | typeof USER_ROLES.CANDIDATE
    | typeof USER_ROLES.COACH
    | typeof USER_ROLES.ADMIN
  >(USER_ROLES.CANDIDATE);

  useEffect(() => {
    if (role === USER_ROLES.ADMIN) {
      setContextualRole(USER_ROLES.ADMIN);
    } else {
      setContextualRole(
        isRoleIncluded(CANDIDATE_USER_ROLES, role)
          ? USER_ROLES.CANDIDATE
          : USER_ROLES.COACH
      );
    }
  }, [role]);

  return {
    contextualRole,
  };
}
