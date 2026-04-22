import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentUserActions,
  selectCurrentUserReadDocuments,
} from 'src/use-cases/current-user';

export function useCurrentUserReadDocuments() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUserActions.fetchCurrentReadDocumentsRequested());
  }, [dispatch]);

  return useSelector(selectCurrentUserReadDocuments);
}
