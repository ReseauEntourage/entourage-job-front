import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ContactTypeEnum } from '@/src/constants/contactTypes';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useRole } from 'src/hooks/queryParams/useRole';

const route = '/backoffice/annuaire';

// Manage redirection to add the mandatory role query param
export function useDirectoryRoleRedirection() {
  const { replace, query } = useRouter();
  const { role: userRole, userProfile } = useAuthenticatedUser();

  const role = useRole();

  useEffect(() => {
    const contactTypes = [] as ContactTypeEnum[];
    const departments = [] as string[];
    if (userProfile.allowRemoteEvents) {
      contactTypes.push(ContactTypeEnum.REMOTE);
    }
    if (userProfile.allowPhysicalEvents) {
      contactTypes.push(ContactTypeEnum.PHYSICAL);
      if (!userProfile.allowRemoteEvents) {
        departments.push(userProfile.department);
      }
    }

    if (!role) {
      if (userRole === UserRoles.CANDIDATE) {
        replace(
          {
            pathname: route,
            query: {
              ...query,
              role: UserRoles.COACH,
              contactTypes: contactTypes.length > 0 ? contactTypes : undefined,
              departments: departments.length > 0 ? departments : undefined,
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
              contactTypes: contactTypes.length > 0 ? contactTypes : undefined,
              departments: departments.length > 0 ? departments : undefined,
            },
          },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [
    replace,
    role,
    userRole,
    query,
    userProfile.allowRemoteEvents,
    userProfile.allowPhysicalEvents,
    userProfile.department,
  ]);
}
