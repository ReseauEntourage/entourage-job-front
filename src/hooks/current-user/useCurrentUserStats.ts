import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentUserActions,
  selectCurrentUserStats,
} from 'src/use-cases/current-user';

export function useCurrentUserStats() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUserActions.fetchUserStatsRequested());
  }, [dispatch]);

  return useSelector(selectCurrentUserStats);
}
