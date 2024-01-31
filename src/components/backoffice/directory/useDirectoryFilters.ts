import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useRole } from 'src/hooks/queryParams/useRole';
import { usePrevious } from 'src/hooks/utils';
import {
  profilesActions,
  selectProfilesIsResetFilters,
} from 'src/use-cases/profiles';
import { isRoleIncluded } from 'src/utils';
import { useDirectoryFiltersQueryParams } from './useDirectoryFiltersQueryParams';

const route = '/backoffice/annuaire';

export function useDirectoryFilters() {
  const { replace } = useRouter();
  const user = useAuthenticatedUser();

  const isResetFilters = useSelector(selectProfilesIsResetFilters);
  const prevIsResetFilters = usePrevious(isResetFilters);

  const [isFirstRequest, setIsFirstRequest] = useState(true);

  const dispatch = useDispatch();

  const directoryFiltersParams = useDirectoryFiltersQueryParams();
  const { search, helps, businessLines, departments } = directoryFiltersParams;

  const role = useRole();
  const prevRole = usePrevious(role);
  const prevSearch = usePrevious(search);
  const prevHelps = usePrevious(helps);
  const prevDepartments = usePrevious(departments);
  const prevBusinessLines = usePrevious(businessLines);

  useEffect(() => {
    if (!role) {
      if (isRoleIncluded(CANDIDATE_USER_ROLES, user.role)) {
        replace(
          {
            pathname: route,
            query: {
              ...directoryFiltersParams,
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
              ...directoryFiltersParams,
              role: CANDIDATE_USER_ROLES,
            },
          },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [
    replace,
    businessLines,
    departments,
    helps,
    role,
    search,
    user.role,
    directoryFiltersParams,
  ]);

  useEffect(() => {
    if (isFirstRequest && role && role.length > 0) {
      dispatch(
        profilesActions.setProfilesFilters({
          role,
          search,
          helps,
          businessLines,
          departments,
        })
      );
      setIsFirstRequest(false);
    }
  }, [
    dispatch,
    businessLines,
    departments,
    helps,
    isFirstRequest,
    role,
    search,
  ]);

  useEffect(() => {
    if (isResetFilters && !prevIsResetFilters) {
      dispatch(
        profilesActions.setProfilesFilters({
          role,
          search: null,
          helps: [],
          businessLines: [],
          departments: [],
        })
      );
    }
  }, [
    dispatch,
    businessLines,
    departments,
    helps,
    role,
    search,
    isFirstRequest,
    isResetFilters,
    prevIsResetFilters,
  ]);

  useEffect(() => {
    if (!isFirstRequest && !isResetFilters && !_.isEqual(role, prevRole)) {
      dispatch(profilesActions.setProfilesRoleFilter(role));
    }
  }, [dispatch, isFirstRequest, role, prevRole, isResetFilters]);

  useEffect(() => {
    if (!isFirstRequest && !isResetFilters && !_.isEqual(search, prevSearch)) {
      dispatch(profilesActions.setProfilesSearchFilter(search));
    }
  }, [dispatch, isFirstRequest, isResetFilters, prevSearch, search]);

  useEffect(() => {
    if (!isFirstRequest && !isResetFilters && !_.isEqual(helps, prevHelps)) {
      dispatch(profilesActions.setProfilesHelpsFilter(helps));
    }
  }, [dispatch, isFirstRequest, helps, prevHelps, isResetFilters]);

  useEffect(() => {
    if (
      !isFirstRequest &&
      !isResetFilters &&
      !_.isEqual(departments, prevDepartments)
    ) {
      dispatch(profilesActions.setProfilesDepartmentsFilter(departments));
    }
  }, [dispatch, isFirstRequest, departments, prevDepartments, isResetFilters]);

  useEffect(() => {
    if (
      !isFirstRequest &&
      !isResetFilters &&
      !_.isEqual(businessLines, prevBusinessLines)
    ) {
      dispatch(profilesActions.setProfilesBusinessLinesFilter(businessLines));
    }
  }, [
    dispatch,
    isFirstRequest,
    businessLines,
    prevBusinessLines,
    isResetFilters,
  ]);
}
