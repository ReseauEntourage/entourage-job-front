import { useRouter } from 'next/router';
import { UserRole } from 'src/constants/users';

export function useRole() {
  const {
    query: { role },
  } = useRouter();

  return role as UserRole[];
}
