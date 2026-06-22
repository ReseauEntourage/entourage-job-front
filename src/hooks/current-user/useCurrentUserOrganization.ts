import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import {
  currentUserActions,
  selectCurrentUserOrganization,
  selectFetchCurrentOrganizationStatus,
} from 'src/use-cases/current-user';

export function useCurrentUserOrganization() {
  const dispatch = useDispatch();
  const store = useStore();

  useEffect(() => {
    const currentStatus = selectFetchCurrentOrganizationStatus(
      store.getState() as any
    );
    if (
      currentStatus === ReduxRequestEvents.IDLE ||
      currentStatus === ReduxRequestEvents.FAILED
    ) {
      dispatch(currentUserActions.fetchCurrentOrganizationRequested());
    }
  }, [dispatch, store]);

  return useSelector(selectCurrentUserOrganization);
}
