import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UIkit from 'uikit';
import { useUserId } from 'src/hooks/queryParams/useUserId';
import { profilesActions } from 'src/use-cases/profiles';
import {
  fetchSelectedProfileSelectors,
  selectSelectedProfile,
} from 'src/use-cases/profiles/profiles.selectors';

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
      UIkit.notification('Une erreur est survenue', 'danger');
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

  if (!selectedProfile) {
    throw new Error('No selected profile');
  }

  return selectedProfile;
}
