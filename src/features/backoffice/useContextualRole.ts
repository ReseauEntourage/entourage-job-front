import { useEffect, useState } from 'react';
import {
  UserRoles,
  NormalUserRoles,
  getNormalUserRoles,
} from 'src/constants/users';
import { isRoleIncluded } from 'src/utils';

export function useContextualRole(role: UserRoles) {
  const [contextualRole, setContextualRole] = useState<NormalUserRoles>(
    isRoleIncluded(getNormalUserRoles(), role)
      ? (role as NormalUserRoles)
      : UserRoles.COACH
  );

  useEffect(() => {
    setContextualRole(
      isRoleIncluded(getNormalUserRoles(), role)
        ? (role as NormalUserRoles)
        : UserRoles.COACH
    );
  }, [role]);

  return {
    contextualRole,
  };
}
