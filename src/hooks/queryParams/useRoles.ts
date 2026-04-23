import { useRouter } from 'next/router';
import { UserRoles } from 'src/constants/users';

export function useRoles() {
  const {
    query: { role },
  } = useRouter();

  if (!role) {
    return [];
  }
  return (Array.isArray(role) ? role : [role]) as UserRoles[];
}
