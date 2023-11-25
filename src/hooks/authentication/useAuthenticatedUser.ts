import { useSelector } from 'react-redux';
import { User, UserWithUserCandidate } from 'src/api/types';
import { selectCurrentUser } from 'src/use-cases/authentication';

export function useAuthenticatedUser() {
  const currentUser = useSelector(selectCurrentUser) as
    | User
    | UserWithUserCandidate;

  if (!currentUser) {
    throw new Error('User is not authenticated');
  }

  return currentUser;
}
