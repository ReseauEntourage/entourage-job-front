import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import {
  currentUserActions,
  selectCurrentUserStats,
  selectFetchUserStatsStatus,
} from 'src/use-cases/current-user';

export function useCurrentUserStats() {
  const dispatch = useDispatch();
  const store = useStore();
  const status = useSelector(selectFetchUserStatsStatus);

  useEffect(() => {
    const currentStatus = selectFetchUserStatsStatus(store.getState() as any);
    if (
      currentStatus === ReduxRequestEvents.IDLE ||
      currentStatus === ReduxRequestEvents.FAILED
    ) {
      dispatch(currentUserActions.fetchUserStatsRequested());
    }
  }, [dispatch, store, status]);

  return useSelector(selectCurrentUserStats);
}
