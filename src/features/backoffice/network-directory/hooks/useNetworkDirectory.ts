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
import { useNetworkDirectoryQueryParams } from './useNetworkDirectoryQueryParams';

/**
 * Central hook that drives the network directory data layer.
 *
 * Responsibilities:
 * - Dispatches profile and company fetch requests whenever the active filters change
 *   (detected via deep-equality comparison with the previous params).
 * - Companies are always fetched with `onlyWithReferent: true`.
 * - Triggers pagination by dispatching `fetchProfilesNextPage` / `fetchCompaniesNextPage`
 *   when the user scrolls to the bottom of the page, as long as more items remain to fetch.
 * - Shows a danger notification when either the profile or company fetch fails.
 * - Resets the pagination offsets for both profiles and companies on unmount.
 *
 * @returns An object containing:
 * - `profiles` — the list of profiles currently loaded in the Redux store.
 * - `companies` — the list of companies currently loaded in the Redux store.
 * - `isProfileLoading` — `true` while the profile fetch is idle or in progress.
 * - `isCompaniesLoading` — `true` while the company fetch is idle or in progress.
 * - `directoryFiltersParams` — the current filter/sort params aggregated by `useNetworkDirectoryQueryParams`.
 */
export function useNetworkDirectory() {
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
  const directoryFiltersParams = useNetworkDirectoryQueryParams();

  const prevDirectoryFiltersParams = usePrevious(directoryFiltersParams);

  useEffect(() => {
    if (!_.isEqual(prevDirectoryFiltersParams, directoryFiltersParams)) {
      dispatch(
        profilesActions.fetchProfilesWithFilters(directoryFiltersParams)
      );
      dispatch(
        companyActions.fetchCompaniesWithFilters({
          ...directoryFiltersParams,
          onlyWithReferent: true,
        })
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
      dispatch(
        companyActions.fetchCompaniesNextPage({
          ...directoryFiltersParams,
          onlyWithReferent: true,
        })
      );
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
