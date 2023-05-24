import { useRouter } from 'next/router';
import { UserRole } from 'src/constants/users';

export function useRole(): UserRole {
  const {
    query: { role },
  } = useRouter();

  return role as UserRole | UserRole[];
}
