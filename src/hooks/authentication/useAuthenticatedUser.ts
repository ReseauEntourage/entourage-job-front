import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'src/use-cases/authentication';

export function useAuthenticatedUser() {
  const currentUser = useSelector(selectCurrentUser);

  if (!currentUser) {
    throw new Error('User is not authenticated');
  }

  return currentUser;
}
