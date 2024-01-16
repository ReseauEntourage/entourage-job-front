import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profilesActions } from 'src/use-cases/profiles';
import {
  fetchSelectedProfileSelectors,
  selectSelectedProfile,
} from 'src/use-cases/profiles/profiles.selectors';

export function useSelectedProfile() {
  const {
    query: { userId },
  } = useRouter();
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
