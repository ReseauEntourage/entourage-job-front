import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import {
  currentUserActions,
  selectCurrentUserProfile,
  selectFetchCurrentProfileStatus,
} from 'src/use-cases/current-user';

export function useCurrentUserProfile() {
  const dispatch = useDispatch();
  const store = useStore();
  const status = useSelector(selectFetchCurrentProfileStatus);

  useEffect(() => {
    const currentStatus = selectFetchCurrentProfileStatus(
      store.getState() as any
    );
    if (
      currentStatus === ReduxRequestEvents.IDLE ||
      currentStatus === ReduxRequestEvents.FAILED
    ) {
      dispatch(currentUserActions.fetchCurrentProfileRequested());
    }
  }, [dispatch, store, status]);

  return useSelector(selectCurrentUserProfile);
}
