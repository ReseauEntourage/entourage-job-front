import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUserId } from 'src/hooks/queryParams/useUserId';
import { profilesActions } from 'src/use-cases/profiles';
import {
  fetchSelectedProfileSelectors,
  selectSelectedProfile,
} from 'src/use-cases/profiles/profiles.selectors';

export function useSelectedProfile() {
  const userId = useUserId();
  const dispatch = useDispatch();

  const isFetchedSelectedProfileIdle = useSelector(
    fetchSelectedProfileSelectors.selectIsFetchSelectedProfileIdle
  );

  const selectedProfile = useSelector(selectSelectedProfile);

  useEffect(() => {
    if (isFetchedSelectedProfileIdle && userId) {
      dispatch(
        profilesActions.fetchSelectedProfileRequested({
          userId: userId as string,
        })
      );
    }
  }, [dispatch, isFetchedSelectedProfileIdle, userId]);

  return {
    selectedProfile,
  };
}
