import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import {
  currentUserActions,
  selectCurrentUserReadDocuments,
  selectFetchCurrentReadDocumentsStatus,
} from 'src/use-cases/current-user';

export function useCurrentUserReadDocuments() {
  const dispatch = useDispatch();
  const store = useStore();
  const status = useSelector(selectFetchCurrentReadDocumentsStatus);

  useEffect(() => {
    const currentStatus = selectFetchCurrentReadDocumentsStatus(
      store.getState() as any
    );
    if (
      currentStatus === ReduxRequestEvents.IDLE ||
      currentStatus === ReduxRequestEvents.FAILED
    ) {
      dispatch(currentUserActions.fetchCurrentReadDocumentsRequested());
    }
  }, [dispatch, store, status]);

  return useSelector(selectCurrentUserReadDocuments);
}
