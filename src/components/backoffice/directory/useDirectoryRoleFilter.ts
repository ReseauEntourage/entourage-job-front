import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRole } from 'src/components/backoffice/useRole';
import { CANDIDATE_USER_ROLES, COACH_USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { usePrevious } from 'src/hooks/utils';
import { profilesActions } from 'src/use-cases/profiles';
import { isRoleIncluded } from 'src/utils';

const route = '/backoffice/annuaire';

export function useDirectoryRoleFilter() {
  const { replace } = useRouter();

  const dispatch = useDispatch();

  const user = useAuthenticatedUser();
  const role = useRole();
  const prevRole = usePrevious(role);

  useEffect(() => {
    if (!role) {
      if (isRoleIncluded(CANDIDATE_USER_ROLES, user.role)) {
        replace({
          pathname: route,
          query: { role: COACH_USER_ROLES },
        });
      } else {
        replace({
          pathname: route,
          query: { role: CANDIDATE_USER_ROLES },
        });
      }
    }
  }, [replace, role, user.role]);

  useEffect(() => {
    if (role && role.length > 0 && role !== prevRole) {
      dispatch(profilesActions.setProfilesRoleFilter(role));
    }
  }, [dispatch, prevRole, role]);
}
