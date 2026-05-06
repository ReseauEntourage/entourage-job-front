import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import {
  currentUserActions,
  selectCurrentUserCompany,
  selectFetchCurrentCompanyStatus,
} from 'src/use-cases/current-user';

export function useCurrentUserCompany() {
  const dispatch = useDispatch();
  const store = useStore();
  const status = useSelector(selectFetchCurrentCompanyStatus);

  useEffect(() => {
    const currentStatus = selectFetchCurrentCompanyStatus(
      store.getState() as any
    );
    if (
      currentStatus === ReduxRequestEvents.IDLE ||
      currentStatus === ReduxRequestEvents.FAILED
    ) {
      dispatch(currentUserActions.fetchCurrentCompanyRequested());
    }
  }, [dispatch, store, status]);

  return useSelector(selectCurrentUserCompany);
}
