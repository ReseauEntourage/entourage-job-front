import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentUserActions,
  selectCurrentUserCompany,
} from 'src/use-cases/current-user';

export function useCurrentUserCompany() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUserActions.fetchCurrentCompanyRequested());
  }, [dispatch]);

  return useSelector(selectCurrentUserCompany);
}
