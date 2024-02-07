import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UIkit from 'uikit';
import {
  fetchProfilesSelectors,
  profilesActions,
  selectProfiles,
} from 'src/use-cases/profiles';

export function useDirectory() {
  const dispatch = useDispatch();

  const isFetchProfileStatusFailed = useSelector(
    fetchProfilesSelectors.selectIsFetchProfilesFailed
  );

  const profiles = useSelector(selectProfiles);

  useEffect(() => {
    if (isFetchProfileStatusFailed) {
      UIkit.notification('Une erreur est survenue', 'danger');
    }
  }, [dispatch, isFetchProfileStatusFailed]);

  useEffect(() => {
    return () => {
      dispatch(profilesActions.fetchProfilesReset());
    };
  }, [dispatch]);

  return {
    profiles,
  };
}
