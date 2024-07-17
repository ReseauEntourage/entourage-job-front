import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUserId } from 'src/hooks/queryParams/useUserId';
import { notificationsActions } from 'src/use-cases/notifications';

import { profilesActions } from 'src/use-cases/profiles';
import {
  fetchSelectedProfileSelectors,
  selectSelectedProfile,
} from 'src/use-cases/profiles/profiles.selectors';
import { assertIsDefined } from 'src/utils/asserts';

export function useSelectedProfile() {
  const userId = useUserId();
  const dispatch = useDispatch();

  const isFetchSelectedProfileFailed = useSelector(
    fetchSelectedProfileSelectors.selectIsFetchSelectedProfileFailed
  );
  const selectedProfile = useSelector(selectSelectedProfile);

  useEffect(() => {
    if (userId) {
      dispatch(
        profilesActions.fetchSelectedProfileRequested({
          userId,
        })
      );
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (isFetchSelectedProfileFailed) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: 'Une erreur est survenue',
        })
      );
    }
  }, [dispatch, isFetchSelectedProfileFailed]);

  useEffect(() => {
    return () => {
      dispatch(profilesActions.fetchSelectedProfileReset());
    };
  }, [dispatch]);

  return {
    selectedProfile,
  };
}

export function useSelectSelectedProfile() {
  const selectedProfile = useSelector(selectSelectedProfile);

  assertIsDefined(selectedProfile, 'No selected profile');

  return selectedProfile;
}
