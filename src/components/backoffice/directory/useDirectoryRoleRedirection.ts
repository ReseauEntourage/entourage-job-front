import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useRole } from 'src/hooks/queryParams/useRole';

const route = '/backoffice/annuaire';

// Manage redirection to add the mandatory role query param
export function useDirectoryRoleRedirection() {
  const { replace, query } = useRouter();
  const { role: userRole } = useAuthenticatedUser();

  const role = useRole();

  useEffect(() => {
    if (!role) {
      if (userRole === UserRoles.CANDIDATE) {
        replace(
          {
            pathname: route,
            query: {
              ...query,
              role: UserRoles.COACH,
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
              role: [UserRoles.CANDIDATE],
            },
          },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [replace, role, userRole, query]);
}
