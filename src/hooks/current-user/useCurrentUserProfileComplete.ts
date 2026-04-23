import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import {
  currentUserActions,
  selectCurrentUserProfileComplete,
  selectFetchCurrentProfileCompleteStatus,
} from 'src/use-cases/current-user';

export function useCurrentUserProfileComplete() {
  const dispatch = useDispatch();
  const store = useStore();
  const status = useSelector(selectFetchCurrentProfileCompleteStatus);

  useEffect(() => {
    const currentStatus = selectFetchCurrentProfileCompleteStatus(
      store.getState() as any
    );
    if (
      currentStatus === ReduxRequestEvents.IDLE ||
      currentStatus === ReduxRequestEvents.FAILED
    ) {
      dispatch(currentUserActions.fetchCurrentProfileCompleteRequested());
    }
  }, [dispatch, store, status]);

  return useSelector(selectCurrentUserProfileComplete);
}
