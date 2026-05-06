import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import {
  currentUserActions,
  selectCurrentUserAchievements,
  selectFetchCurrentAchievementsStatus,
} from 'src/use-cases/current-user';

export function useCurrentUserAchievements() {
  const dispatch = useDispatch();
  const store = useStore();
  const status = useSelector(selectFetchCurrentAchievementsStatus);

  useEffect(() => {
    const currentStatus = selectFetchCurrentAchievementsStatus(
      store.getState() as any
    );
    if (
      currentStatus === ReduxRequestEvents.IDLE ||
      currentStatus === ReduxRequestEvents.FAILED
    ) {
      dispatch(currentUserActions.fetchCurrentAchievementsRequested());
    }
  }, [dispatch, store, status]);

  return useSelector(selectCurrentUserAchievements);
}
