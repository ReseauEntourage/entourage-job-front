import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRole } from 'src/components/backoffice/useRole';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { usePrevious } from 'src/hooks/utils';
import { profilesActions } from 'src/use-cases/profiles';
import { isRoleIncluded, mutateToArray } from 'src/utils';
import { useDirectoryFiltersParams } from './useDirectoryFiltersParams';

const route = '/backoffice/annuaire';

export function useDirectoryFilters() {
  const { replace } = useRouter();

  const { search, helps, businessLines, departments } =
    useDirectoryFiltersParams();

  const dispatch = useDispatch();

  const user = useAuthenticatedUser();

  const role = useRole();
  const prevRole = usePrevious(role);
  const prevSearch = usePrevious(search);
  const prevHelps = usePrevious(helps);
  const prevDepartments = usePrevious(departments);
  const prevBusinessLines = usePrevious(businessLines);

  useEffect(() => {
    if (!role) {
      if (isRoleIncluded(CANDIDATE_USER_ROLES, user.role)) {
        replace({
          pathname: route,
          query: {
            helps,
            businessLines,
            departments,
            role: USER_ROLES.COACH,
          },
        });
      } else {
        replace({
          pathname: route,
          query: {
            helps,
            businessLines,
            departments,
            role: CANDIDATE_USER_ROLES,
          },
        });
      }
    }
  }, [businessLines, departments, helps, replace, role, user.role]);

  useEffect(() => {
    if (role && role.length > 0 && role !== prevRole) {
      dispatch(profilesActions.setProfilesFilters({ role }));
    }
  }, [dispatch, prevRole, role]);

  useEffect(() => {
    if (search !== prevSearch) {
      dispatch(profilesActions.setProfilesFilters({ search }));
    }
  }, [dispatch, prevRole, prevSearch, role, search]);

  useEffect(() => {
    if (helps !== prevHelps) {
      dispatch(
        profilesActions.setProfilesFilters({
          helps: helps ? mutateToArray(helps) : undefined,
        })
      );
    }
  }, [departments, dispatch, helps, prevHelps]);

  useEffect(() => {
    if (departments !== prevDepartments) {
      dispatch(
        profilesActions.setProfilesFilters({
          departments: departments ? mutateToArray(departments) : undefined,
        })
      );
    }
  }, [departments, dispatch, prevDepartments]);

  useEffect(() => {
    if (businessLines !== prevBusinessLines) {
      dispatch(
        profilesActions.setProfilesFilters({
          businessLines: businessLines
            ? mutateToArray(businessLines)
            : undefined,
        })
      );
    }
  }, [businessLines, dispatch, prevBusinessLines]);
}
