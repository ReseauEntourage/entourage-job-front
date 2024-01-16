import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UIkit from 'uikit';
import { ReduxRequestEvents } from 'src/constants';
import { usePrevious } from 'src/hooks/utils';
import {
  fetchProfilesSelectors,
  profilesActions,
  selectProfiles,
} from 'src/use-cases/profiles';

export function useDirectory() {
  const dispatch = useDispatch();

  const isFetchProfilesStatus = useSelector(
    fetchProfilesSelectors.selectFetchProfilesStatus
  );

  const prevIsFetchProfilesStatus = usePrevious(isFetchProfilesStatus);
  const profiles = useSelector(selectProfiles);

  useEffect(() => {
    if (prevIsFetchProfilesStatus === ReduxRequestEvents.REQUESTED) {
      if (isFetchProfilesStatus === ReduxRequestEvents.FAILED) {
        UIkit.notification('Une erreur est survenue', 'danger');
      }

      dispatch(profilesActions.fetchProfilesReset());
    }
  }, [dispatch, isFetchProfilesStatus, prevIsFetchProfilesStatus]);

  return {
    profiles,
  };
}
