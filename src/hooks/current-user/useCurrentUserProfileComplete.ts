import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentUserActions,
  selectCurrentUserProfileComplete,
} from 'src/use-cases/current-user';

export function useCurrentUserProfileComplete() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUserActions.fetchCurrentProfileCompleteRequested());
  }, [dispatch]);

  return useSelector(selectCurrentUserProfileComplete);
}
