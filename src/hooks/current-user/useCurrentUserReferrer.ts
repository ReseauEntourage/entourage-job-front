import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentUserActions,
  selectCurrentUserReferrer,
} from 'src/use-cases/current-user';

export function useCurrentUserReferrer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUserActions.fetchCurrentReferrerRequested());
  }, [dispatch]);

  return useSelector(selectCurrentUserReferrer);
}
