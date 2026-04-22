import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentUserActions,
  selectCurrentUserReferredUsers,
} from 'src/use-cases/current-user';

export function useCurrentUserReferredUsers() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUserActions.fetchCurrentReferredUsersRequested());
  }, [dispatch]);

  return useSelector(selectCurrentUserReferredUsers);
}
