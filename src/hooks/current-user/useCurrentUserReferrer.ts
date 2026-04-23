import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import {
  currentUserActions,
  selectCurrentUserReferrer,
  selectFetchCurrentReferrerStatus,
} from 'src/use-cases/current-user';

export function useCurrentUserReferrer() {
  const dispatch = useDispatch();
  const store = useStore();
  const status = useSelector(selectFetchCurrentReferrerStatus);

  useEffect(() => {
    const currentStatus = selectFetchCurrentReferrerStatus(
      store.getState() as any
    );
    if (
      currentStatus === ReduxRequestEvents.IDLE ||
      currentStatus === ReduxRequestEvents.FAILED
    ) {
      dispatch(currentUserActions.fetchCurrentReferrerRequested());
    }
  }, [dispatch, store, status]);

  return useSelector(selectCurrentUserReferrer);
}
