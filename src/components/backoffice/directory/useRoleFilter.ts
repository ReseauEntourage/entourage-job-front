import { useRole } from 'src/hooks/queryParams/useRole';

export function useRoleFilter() {
  const roleFilter = useRole();
  if (!roleFilter) {
    throw new Error('No default role');
  }

  return roleFilter;
}
