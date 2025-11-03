import _ from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  companyActions,
  fetchCompaniesSelectors,
  selectCompanies,
  selectCompaniesHasFetchedAll,
} from '@/src/use-cases/company';
import { useIsAtBottom } from 'src/hooks/useIsAtBottom';
import { usePrevious } from 'src/hooks/utils';
import { notificationsActions } from 'src/use-cases/notifications';
import {
  fetchProfilesSelectors,
  profilesActions,
  selectProfiles,
  selectProfilesHasFetchedAll,
} from 'src/use-cases/profiles';
import { useDirectoryQueryParams } from './useDirectoryQueryParams';

// Manage directory requests and filters
export function useDirectory() {
  const dispatch = useDispatch();

  /*
   ** Profile selections
   */
  const isFetchProfilesIdle = useSelector(
    fetchProfilesSelectors.selectIsFetchProfilesIdle
  );

  const isFetchProfilesRequested = useSelector(
    fetchProfilesSelectors.selectIsFetchProfilesRequested
  );

  const isProfileLoading = isFetchProfilesIdle || isFetchProfilesRequested;

  const isFetchProfileStatusFailed = useSelector(
    fetchProfilesSelectors.selectIsFetchProfilesFailed
  );

  const profiles = useSelector(selectProfiles);

  /**
   * Companies selections
   */
  const isFetchCompaniesIdle = useSelector(
    fetchCompaniesSelectors.selectIsFetchCompaniesIdle
  );

  const isFetchCompaniesRequested = useSelector(
    fetchCompaniesSelectors.selectIsFetchCompaniesRequested
  );

  const isCompaniesLoading = isFetchCompaniesIdle || isFetchCompaniesRequested;

  const isFetchCompanyStatusFailed = useSelector(
    fetchCompaniesSelectors.selectIsFetchCompaniesFailed
  );

  const companies = useSelector(selectCompanies);

  /**
   * Filters and params
   */
  const directoryFiltersParams = useDirectoryQueryParams();

  const prevDirectoryFiltersParams = usePrevious(directoryFiltersParams);

  useEffect(() => {
    if (!_.isEqual(prevDirectoryFiltersParams, directoryFiltersParams)) {
      dispatch(
        profilesActions.fetchProfilesWithFilters(directoryFiltersParams)
      );
      dispatch(
        companyActions.fetchCompaniesWithFilters(directoryFiltersParams)
      );
    }
  }, [dispatch, directoryFiltersParams, prevDirectoryFiltersParams]);

  /**
   * Effects
   */
  useEffect(() => {
    if (isFetchProfileStatusFailed || isFetchCompanyStatusFailed) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: `Une erreur est survenue`,
        })
      );
    }
  }, [dispatch, isFetchProfileStatusFailed, isFetchCompanyStatusFailed]);

  useEffect(() => {
    return () => {
      dispatch(profilesActions.resetProfilesOffset());
      dispatch(companyActions.resetCompaniesOffset());
    };
  }, [dispatch]);

  // Get state to check if all items have been fetched
  const profilesHasFetchedAll = useSelector(selectProfilesHasFetchedAll);
  const companiesHasFetchedAll = useSelector(selectCompaniesHasFetchedAll);

  // Manage offset and profiles request when scrolling to the bottom of the page
  useIsAtBottom(() => {
    // Only fetch more profiles if there are more to fetch
    if (!profilesHasFetchedAll) {
      dispatch(profilesActions.fetchProfilesNextPage(directoryFiltersParams));
    }

    // Only fetch more companies if there are more to fetch
    if (!companiesHasFetchedAll) {
      dispatch(companyActions.fetchCompaniesNextPage(directoryFiltersParams));
    }
  });

  return {
    profiles,
    companies,
    isProfileLoading,
    isCompaniesLoading,
    directoryFiltersParams,
  };
}
