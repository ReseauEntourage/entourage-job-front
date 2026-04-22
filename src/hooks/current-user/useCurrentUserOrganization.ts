import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentUserActions,
  selectCurrentUserOrganization,
} from 'src/use-cases/current-user';

export function useCurrentUserOrganization() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUserActions.fetchCurrentOrganizationRequested());
  }, [dispatch]);

  return useSelector(selectCurrentUserOrganization);
}
