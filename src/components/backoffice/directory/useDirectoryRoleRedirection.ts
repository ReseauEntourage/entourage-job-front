import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useRole } from 'src/hooks/queryParams/useRole';
import { isRoleIncluded } from 'src/utils';

const route = '/backoffice/annuaire';

// Manage redirection to add the mandatory role query param
export function useDirectoryRoleRedirection() {
  const { replace, query } = useRouter();
  const { role: userRole } = useAuthenticatedUser();

  const role = useRole();

  useEffect(() => {
    if (!role) {
      if (isRoleIncluded(CANDIDATE_USER_ROLES, userRole)) {
        replace(
          {
            pathname: route,
            query: {
              ...query,
              role: USER_ROLES.COACH,
            },
          },
          undefined,
          { shallow: true }
        );
      } else {
        replace(
          {
            pathname: route,
            query: {
              ...query,
              role: CANDIDATE_USER_ROLES,
            },
          },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [replace, role, userRole, query]);
}
