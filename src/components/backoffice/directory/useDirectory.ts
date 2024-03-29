import _ from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIsAtBottom } from 'src/hooks/useIsAtBottom';
import { usePrevious } from 'src/hooks/utils';
import { notificationsActions } from 'src/use-cases/notifications';
import {
  fetchProfilesSelectors,
  profilesActions,
  selectProfiles,
} from 'src/use-cases/profiles';
import { useDirectoryQueryParams } from './useDirectoryQueryParams';

// Manage directory requests and filters
export function useDirectory() {
  const dispatch = useDispatch();

  const isFetchProfilesIdle = useSelector(
    fetchProfilesSelectors.selectIsFetchProfilesIdle
  );

  const isFetchProfilesRequested = useSelector(
    fetchProfilesSelectors.selectIsFetchProfilesRequested
  );

  const isLoading = isFetchProfilesIdle || isFetchProfilesRequested;

  const isFetchProfileStatusFailed = useSelector(
    fetchProfilesSelectors.selectIsFetchProfilesFailed
  );

  const directoryFiltersParams = useDirectoryQueryParams();

  const prevDirectoryFiltersParams = usePrevious(directoryFiltersParams);

  useEffect(() => {
    if (!_.isEqual(prevDirectoryFiltersParams, directoryFiltersParams)) {
      dispatch(
        profilesActions.fetchProfilesWithFilters(directoryFiltersParams)
      );
    }
  }, [dispatch, directoryFiltersParams, prevDirectoryFiltersParams]);

  const profiles = useSelector(selectProfiles);

  useEffect(() => {
    if (isFetchProfileStatusFailed) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: `Une erreur est survenue`,
        })
      );
    }
  }, [dispatch, isFetchProfileStatusFailed]);

  useEffect(() => {
    return () => {
      dispatch(profilesActions.fetchProfilesReset());
    };
  }, [dispatch]);

  // Manage offset and profiles request when scrolling to the bottom of the page
  useIsAtBottom(() => {
    dispatch(profilesActions.fetchProfilesNextPage(directoryFiltersParams));
  });

  return {
    profiles,
    isLoading,
  };
}
