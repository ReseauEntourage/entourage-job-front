import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import {
  currentUserActions,
  selectCurrentUserReferredUsers,
  selectFetchCurrentReferredUsersStatus,
} from 'src/use-cases/current-user';

export function useCurrentUserReferredUsers() {
  const dispatch = useDispatch();
  const store = useStore();
  const status = useSelector(selectFetchCurrentReferredUsersStatus);

  useEffect(() => {
    const currentStatus = selectFetchCurrentReferredUsersStatus(
      store.getState() as any
    );
    if (
      currentStatus === ReduxRequestEvents.IDLE ||
      currentStatus === ReduxRequestEvents.FAILED
    ) {
      dispatch(currentUserActions.fetchCurrentReferredUsersRequested());
    }
  }, [dispatch, store, status]);

  return useSelector(selectCurrentUserReferredUsers);
}
