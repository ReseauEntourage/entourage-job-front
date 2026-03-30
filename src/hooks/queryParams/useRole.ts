import { useRouter } from 'next/router';
import { UserRoles } from 'src/constants/users';

export function useRole() {
  const {
    query: { role },
  } = useRouter();

  if (!role) {
    return [] as UserRoles[];
  }
  return (Array.isArray(role) ? role : [role]) as UserRoles[];
}
