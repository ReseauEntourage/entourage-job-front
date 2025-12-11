import { useSelector } from 'react-redux';
import { selectStaffContact } from 'src/use-cases/current-user';

export function useCurrentUserStaffContact() {
  return useSelector(selectStaffContact);
}
