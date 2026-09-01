import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import {
  currentUserActions,
  fetchStaffContactSelectors,
  selectStaffContact,
} from '@/src/use-cases/current-user';

export function useCurrentUserStaffContact() {
  const dispatch = useDispatch();
  const store = useStore();
  const staffContact = useSelector(selectStaffContact);

  useEffect(() => {
    if (
      fetchStaffContactSelectors.selectIsFetchStaffContactIdle(
        store.getState() as any
      )
    ) {
      dispatch(currentUserActions.fetchStaffContactRequested());
    }
  }, [dispatch, store]);

  return staffContact;
}
