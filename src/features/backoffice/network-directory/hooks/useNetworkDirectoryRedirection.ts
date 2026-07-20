import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { ContactTypeEnum } from '@/src/constants/contactTypes';
import { NetworkDirectoryEntity } from '@/src/constants/network-directory';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { useEntity } from '@/src/hooks/queryParams/useEntity';
import { useRole } from '@/src/hooks/queryParams/useRole';

const route = '/backoffice/annuaire';

/**
 * Handles the initial redirection to the network directory page with the mandatory
 * `role` and `entity` query params when they are missing from the URL, and defaults
 * the `isAvailable` filter to checked on first load.
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
 * Separately, if `isAvailable` isn't present in the URL the first time this hook
 * gets to act, it's defaulted to `true`. This only happens once per mount (tracked via
 * a ref) so that a user unchecking the "available only" filter — which removes
 * `isAvailable` from the URL rather than setting it to `false` — doesn't get
 * silently reverted by this effect re-running.
 *
 * This hook produces no output and is intended to be called once at the page level.
 */
export function useNetworkDirectoryRedirection() {
  const { replace, query } = useRouter();
  const { role: userRole } = useAuthenticatedUser();
  const userProfile = useCurrentUserProfile();

  const role = useRole();
  const entity = useEntity();

  const hasSetDefaultIsAvailable = useRef(false);

  useEffect(() => {
    if (!userProfile) {
      return;
    }
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
      if (!userProfile.allowRemoteEvents && userProfile.department) {
        departments.push(userProfile.department);
      }
    }

    const needsRoleAndEntityDefaults = !role && !entity;
    const needsIsAvailableDefault =
      !hasSetDefaultIsAvailable.current && query.isAvailable === undefined;
    hasSetDefaultIsAvailable.current = true;

    if (!needsRoleAndEntityDefaults && !needsIsAvailableDefault) {
      return;
    }

    const roleAndEntityDefaults = needsRoleAndEntityDefaults
      ? {
          entity: NetworkDirectoryEntity.USER,
          role:
            userRole === UserRoles.CANDIDATE
              ? UserRoles.COACH
              : UserRoles.CANDIDATE,
          contactTypes: contactTypes.length > 0 ? contactTypes : undefined,
          departments: departments.length > 0 ? departments : undefined,
        }
      : {};

    replace(
      {
        pathname: route,
        query: {
          ...query,
          ...roleAndEntityDefaults,
          ...(needsIsAvailableDefault ? { isAvailable: true } : {}),
        },
      },
      undefined,
      { shallow: true }
    );
  }, [
    replace,
    role,
    userRole,
    query,
    userProfile?.allowRemoteEvents,
    userProfile?.allowPhysicalEvents,
    userProfile?.department,
    entity,
    userProfile,
  ]);
}
