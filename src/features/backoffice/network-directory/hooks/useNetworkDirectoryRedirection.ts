import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ContactTypeEnum } from '@/src/constants/contactTypes';
import { NetworkDirectoryEntity } from '@/src/constants/network-directory';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useEntity } from '@/src/hooks/queryParams/useEntity';
import { useRole } from '@/src/hooks/queryParams/useRole';

const route = '/backoffice/annuaire';

/**
 * Handles the initial redirection to the network directory page with the mandatory
 * `role` and `entity` query params when they are missing from the URL.
 *
 * On mount, if neither `role` nor `entity` is present in the URL, performs a
 * shallow replace so that:
 * - A **candidate** is redirected to see coaches (`role=COACH`, `entity=USER`).
 * - Any other role is redirected to see candidates (`role=CANDIDATE`, `entity=USER`).
 *
 * In both cases, `contactTypes` and `departments` are pre-filled based on the
 * authenticated user's profile preferences:
 * - Remote-only users get `contactTypes=REMOTE`.
 * - Physical-only users get `contactTypes=PHYSICAL` and their department pre-selected.
 *
 * This hook produces no output and is intended to be called once at the page level.
 */
export function useNetworkDirectoryRedirection() {
  const { replace, query } = useRouter();
  const { role: userRole, userProfile } = useAuthenticatedUser();

  const role = useRole();
  const entity = useEntity();

  useEffect(() => {
    const contactTypes = [] as ContactTypeEnum[];
    const departments = [] as string[];
    // If userProfile allows remote events and not physical events, we filter by remote only
    if (userProfile.allowRemoteEvents && !userProfile.allowPhysicalEvents) {
      contactTypes.push(ContactTypeEnum.REMOTE);
    }
    // Else if userProfile allows physical events and not remote events, we filter by physical only
    // and within the same department
    if (userProfile.allowPhysicalEvents && !userProfile.allowRemoteEvents) {
      contactTypes.push(ContactTypeEnum.PHYSICAL);
      if (!userProfile.allowRemoteEvents) {
        departments.push(userProfile.department);
      }
    }

    if (!role && !entity) {
      if (userRole === UserRoles.CANDIDATE) {
        replace(
          {
            pathname: route,
            query: {
              ...query,
              entity: NetworkDirectoryEntity.USER,
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
              entity: NetworkDirectoryEntity.USER,
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
    entity,
  ]);
}
