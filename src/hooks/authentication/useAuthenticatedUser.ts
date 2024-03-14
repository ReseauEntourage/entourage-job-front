import { useSelector } from 'react-redux';
import { selectAuthenticatedUser } from 'src/use-cases/current-user';

export function useAuthenticatedUser() {
  return useSelector(selectAuthenticatedUser);
}
