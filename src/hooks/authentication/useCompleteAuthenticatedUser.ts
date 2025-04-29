import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentUserActions,
  selectAuthenticatedUser,
  selectIsComplete,
} from 'src/use-cases/current-user';

export function useCompleteAuthenticatedUser() {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthenticatedUser);
  const isComplete = useSelector(selectIsComplete);

  useEffect(() => {
    if (!isComplete) {
      dispatch(currentUserActions.fetchCompleteUserRequested());
    }
  }, [isComplete, dispatch]);

  return user;
}
