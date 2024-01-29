import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UIkit from 'uikit';
import { ReduxRequestEvents } from 'src/constants';
import { useUserId } from 'src/hooks/queryParams/useUserId';
import { usePrevious } from 'src/hooks/utils';
import { profilesActions } from 'src/use-cases/profiles';
import {
  fetchSelectedProfileSelectors,
  selectSelectedProfile,
} from 'src/use-cases/profiles/profiles.selectors';

export function useSelectedProfile() {
  const userId = useUserId();
  const prevUserId = usePrevious(userId);
  const dispatch = useDispatch();

  const fetchSelectedProfileStatus = useSelector(
    fetchSelectedProfileSelectors.selectFetchSelectedProfileStatus
  );
  const prevFetchSelectedProfileStatus = usePrevious(
    fetchSelectedProfileStatus
  );

  const selectedProfile = useSelector(selectSelectedProfile);

  useEffect(() => {
    if (userId && userId !== prevUserId) {
      dispatch(
        profilesActions.fetchSelectedProfileRequested({
          userId: userId as string,
        })
      );
    }
  }, [dispatch, userId, prevUserId]);

  useEffect(() => {
    if (prevFetchSelectedProfileStatus === ReduxRequestEvents.REQUESTED) {
      if (fetchSelectedProfileStatus === ReduxRequestEvents.FAILED) {
        UIkit.notification('Une erreur est survenue', 'danger');
      }
      dispatch(profilesActions.fetchSelectedProfileReset());
    }
  }, [dispatch, fetchSelectedProfileStatus, prevFetchSelectedProfileStatus]);

  return {
    selectedProfile,
  };
}
