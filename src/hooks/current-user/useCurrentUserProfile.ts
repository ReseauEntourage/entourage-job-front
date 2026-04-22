import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentUserActions,
  selectCurrentUserProfile,
} from 'src/use-cases/current-user';

export function useCurrentUserProfile() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUserActions.fetchCurrentProfileRequested());
  }, [dispatch]);

  return useSelector(selectCurrentUserProfile);
}
