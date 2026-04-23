import { useRouter } from 'next/router';
import { UserRoles } from 'src/constants/users';

export function useRole() {
  const {
    query: { role },
  } = useRouter();

  if (!role) {
    return undefined;
  }
  return (Array.isArray(role) ? role[0] : role) as UserRoles;
}
