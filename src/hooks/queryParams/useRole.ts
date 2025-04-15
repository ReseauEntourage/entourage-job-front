import { useRouter } from 'next/router';
import { UserRoles } from 'src/constants/users';

export function useRole() {
  const {
    query: { role },
  } = useRouter();

  return role as UserRoles[];
}
